// Maps a list of changed files to the CI work that actually needs to run, so
// workflows can skip jobs instead of filtering triggers.
//
// Trigger-level `paths:` filters are NOT usable in this repo: the
// `main-checklist` ruleset requires ~32 named checks, and a workflow that never
// starts produces no check run at all, leaving those checks pending forever. A
// job skipped by a job-level `if:` still reports a `skipped` check run, which
// GitHub counts as satisfied. So every matrix stays full width and the gating
// happens through the outputs computed here.
//
// That same "skipped counts as satisfied" rule is why every caller guards its
// jobs with `!cancelled()` and treats `needs.changes.result != 'success'` as
// "run everything": a gate that errors must not skip the matrix into a green
// PR. This script's fail-open branches cover git-level failures; the workflow
// conditions cover the job failing around it.
//
// Usage: .github/scripts/changed-files.sh <base> | node affected-packages.mts
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ORG_NAME = "@graphql-markdown";

// Real workspace packages, but with no `test:ci` script: `types` is pure
// `.d.ts` (erased before anything could run against it) and `tooling-config`
// is shared build/lint tooling, not a package with its own test suite. They
// still count towards `code` (so Lint/ts:check/etc. still run when either
// changes), but including them in `packages`/`direct_packages` would hand
// test.yml's/mutation.yml's dynamic matrices a package name whose `bun
// test:ci` doesn't exist, failing the job outright rather than skipping it.
const UNTESTABLE_PACKAGES = new Set(["types", "tooling-config"]);

type PackageMeta = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type PackagesMap = Record<string, PackageMeta>;

type AffectedOutputs = {
  code: boolean;
  packages: string[];
  direct_packages: string[];
  smoke: boolean;
  smoke_cli: boolean;
  smoke_docusaurus: boolean;
  workflows: boolean;
  docs: boolean;
  website: boolean;
  docs_only: boolean;
};

// Anything matching these invalidates the workspace graph the closure below is
// computed from, so the unit test matrix fails open to every package.
//
// They are split in two tiers because they do not all invalidate the same
// thing. A `_RUNTIME` entry changes what a package's own tests actually
// execute -- the installed dependency tree, the compiler settings, the test
// runner, the CI toolchain -- so it fans out to mutation testing as well. A
// `_STATIC` entry cannot: type definitions are erased before a mutant ever
// runs, and the CI tooling is not part of any package. Those keep mutation
// testing on the packages genuinely touched, which is most of the saving on a
// `packages/types` change -- the shape of nearly every public API PR.
const GLOBAL_RUNTIME_PATTERNS = [
  /^bun\.lock$/u,
  /^package\.json$/u,
  /^tsconfig(\..+)?\.json$/u,
  /^turbo\.json$/u,
  /^vitest\.config\.mjs$/u,
  /^packages\/tooling-config\//u,
  /^\.github\/actions\//u,
];

const GLOBAL_STATIC_PATTERNS = [
  /^packages\/types\//u,
  /^\.github\/scripts\//u,
  /^tests\/ci\//u,
];

// Scoped deliberately rather than a blanket `\.md$`: `tests/e2e/__data__` holds
// Markdown fixtures (homepages fed to the generator) that smoke tests consume.
// Prose only -- unlike the old version of this list, `website/` is NOT here:
// it used to blanket-exclude the whole Docusaurus site (React components,
// CSS, shell scripts) from every signal, which meant none of that source ever
// got linted. Only `docs/`, `api/`, and Markdown are genuinely "not code".
const PROSE_PATTERNS = [
  /^docs\//u,
  /^api\//u,
  /^[^/]+\.md$/u,
  /^\.github\/[^/]*\.md$/u,
  /^packages\/[^/]+\/docs\//u,
  /^packages\/[^/]+\/[^/]*\.md$/u,
];

// The Docusaurus site: React source, CSS, its own build scripts, config.
// None of it matches `^packages\//`, so it never affects package/smoke
// detection either way -- this exists purely to compute the `website`
// output below, so linter.yml can run website-specific checks on it.
const WEBSITE_PATTERNS = [/^website\//u];

const SMOKE_PATTERNS = {
  cli: [/^tests\/e2e\/cli\//u],
  docusaurus: [/^tests\/e2e\/docusaurus\//u],
  both: [
    /^tests\/e2e\/__data__\//u,
    /^tests\/e2e\/helpers\//u,
    /^\.github\/workflows\/smoke\.yml$/u,
  ],
};

const matches = (file: string, patterns: RegExp[]): boolean => {
  return patterns.some((pattern) => {
    return pattern.test(file);
  });
};

const shortName = (packageName: string): string => {
  return packageName.slice(ORG_NAME.length + 1);
};

/**
 * Reverse workspace graph: package short name -> short names that depend on it.
 */
const getDependentsMap = (
  packagesMap: PackagesMap,
): Map<string, Set<string>> => {
  const dependents = new Map<string, Set<string>>();

  for (const [name, meta] of Object.entries(packagesMap)) {
    const workspaceDependencies = Object.keys({
      ...meta.dependencies,
      ...meta.peerDependencies,
    }).filter((dependencyName) => {
      return dependencyName.startsWith(`${ORG_NAME}/`);
    });

    for (const dependencyName of workspaceDependencies) {
      const key = shortName(dependencyName);
      const entry = dependents.get(key) ?? new Set<string>();
      entry.add(shortName(name));
      dependents.set(key, entry);
    }
  }

  return dependents;
};

/**
 * Expands a seed set into its transitive dependents: a change in `utils` has to
 * retest everything that consumes `utils`.
 */
const expandDependents = (
  seed: Iterable<string>,
  dependentsMap: Map<string, Set<string>>,
): Set<string> => {
  const closure = new Set(seed);
  const queue = [...closure];

  while (queue.length > 0) {
    const packageName = queue.shift()!;
    const added = [...(dependentsMap.get(packageName) ?? [])].filter(
      (dependent) => {
        return !closure.has(dependent);
      },
    );

    added.forEach((dependent) => {
      closure.add(dependent);
    });
    queue.push(...added);
  }

  return closure;
};

/**
 * Which global tier the change set falls into: `runtime` also invalidates
 * mutation testing, `any` only the dependency closure.
 */
const getGlobalScope = (
  files: string[],
): { runtime: boolean; any: boolean } => {
  const runtime = files.some((file) => {
    return matches(file, GLOBAL_RUNTIME_PATTERNS);
  });

  const staticOnly = files.some((file) => {
    return matches(file, GLOBAL_STATIC_PATTERNS);
  });

  return { runtime, any: runtime || staticOnly };
};

/**
 * The packages a change set touches directly, ignoring the dependency graph.
 */
const getTouchedPackages = (
  files: string[],
  allPackages: string[],
): Set<string> => {
  return new Set(
    files.flatMap((file) => {
      const name = /^packages\/([^/]+)\//u.exec(file)?.[1];
      return name && allPackages.includes(name) ? [name] : [];
    }),
  );
};

/**
 * Both smoke scaffolds install every workspace package, so any package change
 * runs every smoke job; only the e2e spec directories are target-specific.
 */
const getSmokeTargets = (
  files: string[],
  packagesTouched: boolean,
): { cli: boolean; docusaurus: boolean; any: boolean } => {
  const touches = (patterns: RegExp[]): boolean => {
    return files.some((file) => {
      return matches(file, patterns) || matches(file, SMOKE_PATTERNS.both);
    });
  };

  const cli = packagesTouched || touches(SMOKE_PATTERNS.cli);
  const docusaurus = packagesTouched || touches(SMOKE_PATTERNS.docusaurus);

  return { cli, docusaurus, any: cli || docusaurus };
};

/**
 * "CI tooling", not just workflow YAML: this drives the linter job's
 * actionlint / shellcheck / `test:scripts` steps, and the gate's own suite
 * lives under `tests/ci`.
 */
const touchesCiTooling = (files: string[]): boolean => {
  return files.some((file) => {
    return file.startsWith(".github/") || file.startsWith("tests/ci/");
  });
};

/**
 * Nothing outside documentation and the website changed: every gated job can
 * skip.
 */
const isDocsOnly = (
  packagesTouched: boolean,
  smoke: boolean,
  workflows: boolean,
  website: boolean,
): boolean => {
  return !packagesTouched && !smoke && !workflows && !website;
};

const computeAffected = (
  changedFiles: string[],
  packagesMap: PackagesMap,
): AffectedOutputs => {
  const allPackages = Object.keys(packagesMap).map(shortName);

  const trimmed = changedFiles
    .map((file) => {
      return file.trim();
    })
    .filter(Boolean);

  // Prose and the website never affect package/smoke/workflow detection --
  // neither matches `^packages\//`, a global pattern, a smoke target, or
  // `.github/`/`tests/ci/` -- so filtering them out here only matters for
  // `packages/<name>/README.md`-style paths, which would otherwise falsely
  // mark that package as touched.
  const files = trimmed.filter((file) => {
    return !matches(file, PROSE_PATTERNS) && !matches(file, WEBSITE_PATTERNS);
  });

  const global = getGlobalScope(files);
  const touched = getTouchedPackages(files, allPackages);

  // `direct` drives mutation testing: Stryker mutates `src/**/*.ts` and runs
  // that same package's tests, so a module's score is a pure function of its
  // own sources and specs. An upstream change cannot move it -- it can only
  // make the tests fail, which the closure-gated unit test job already reports.
  // Only a runtime-tier global widens it past the packages actually touched.
  const direct = global.runtime ? new Set(allPackages) : touched;

  const affected = global.any
    ? new Set(allPackages)
    : expandDependents(touched, getDependentsMap(packagesMap));

  const packagesTouched = affected.size > 0;
  const smoke = getSmokeTargets(files, packagesTouched);
  const workflows = touchesCiTooling(files);
  const docs = trimmed.some((file) => {
    return matches(file, PROSE_PATTERNS);
  });
  const website = trimmed.some((file) => {
    return matches(file, WEBSITE_PATTERNS);
  });

  const sort = (names: Iterable<string>): string[] => {
    return [...names].sort();
  };
  const testable = (names: Iterable<string>): string[] => {
    return sort([...names].filter((name) => !UNTESTABLE_PACKAGES.has(name)));
  };

  return {
    code: packagesTouched,
    packages: testable(affected),
    direct_packages: testable(direct),
    smoke: smoke.any,
    smoke_cli: smoke.cli,
    smoke_docusaurus: smoke.docusaurus,
    workflows,
    docs,
    website,
    docs_only: isDocsOnly(packagesTouched, smoke.any, workflows, website),
  };
};

export { computeAffected, expandDependents, getDependentsMap };
export type { AffectedOutputs, PackageMeta, PackagesMap };

// When run directly, read the changed files from stdin and write the outputs to
// $GITHUB_OUTPUT (falling back to stdout only, for local runs).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // dependencies-utils chdir()s the process on import, so resolve $GITHUB_OUTPUT
  // against the current working directory before importing it.
  const outputFile = process.env.GITHUB_OUTPUT
    ? resolve(process.cwd(), process.env.GITHUB_OUTPUT)
    : undefined;

  const { getWorkspacePackagesMap } =
    (await import("../../packages/tooling-config/scripts/shared/dependencies-utils.mts")) as {
      getWorkspacePackagesMap: () => PackagesMap;
    };

  // Read stdin as a stream rather than readFileSync(0): a pipe can be opened
  // non-blocking, and the synchronous read then fails with EAGAIN.
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const changedFiles = Buffer.concat(chunks).toString("utf-8").split("\n");

  const outputs = computeAffected(changedFiles, getWorkspacePackagesMap());

  const report = Object.entries(outputs)
    .map(([key, value]) => {
      return `${key}=${typeof value === "boolean" ? value : JSON.stringify(value)}`;
    })
    .join("\n");

  console.log(report);
  if (outputFile) {
    appendFileSync(outputFile, `${report}\n`);
  }
}
