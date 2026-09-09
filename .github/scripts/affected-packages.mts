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
// Usage: .github/scripts/changed-files.sh <base> | node affected-packages.mts
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ORG_NAME = "@graphql-markdown";

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
  docs_only: boolean;
};

// Anything matching these invalidates every assumption below (shared build
// config, the toolchain, the type definitions every package compiles against,
// or this script itself), so they fail open to the full matrix.
const GLOBAL_PATTERNS = [
  /^bun\.lock$/u,
  /^package\.json$/u,
  /^tsconfig(\..+)?\.json$/u,
  /^turbo\.json$/u,
  /^vitest\.config\.mjs$/u,
  /^packages\/types\//u,
  /^packages\/tooling-config\//u,
  /^\.github\/actions\//u,
  /^\.github\/scripts\//u,
  /^tests\/ci\//u,
];

// Scoped deliberately rather than a blanket `\.md$`: `tests/e2e/__data__` holds
// Markdown fixtures (homepages fed to the generator) that smoke tests consume.
const DOC_PATTERNS = [
  /^docs\//u,
  /^website\//u,
  /^api\//u,
  /^[^/]+\.md$/u,
  /^\.github\/[^/]*\.md$/u,
  /^packages\/[^/]+\/docs\//u,
  /^packages\/[^/]+\/[^/]*\.md$/u,
];

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
    for (const dependent of dependentsMap.get(packageName) ?? []) {
      if (!closure.has(dependent)) {
        closure.add(dependent);
        queue.push(dependent);
      }
    }
  }

  return closure;
};

const computeAffected = (
  changedFiles: string[],
  packagesMap: PackagesMap,
): AffectedOutputs => {
  const allPackages = Object.keys(packagesMap).map(shortName);

  const files = changedFiles
    .map((file) => {
      return file.trim();
    })
    .filter(Boolean)
    .filter((file) => {
      return !matches(file, DOC_PATTERNS);
    });

  const isGlobal = files.some((file) => {
    return matches(file, GLOBAL_PATTERNS);
  });

  // `direct` drives mutation testing: Stryker mutates `src/**/*.ts` and runs
  // that same package's tests, so a module's score is a pure function of its
  // own sources and specs. An upstream change cannot move it -- it can only
  // make the tests fail, which the closure-gated unit test job already reports.
  const direct = new Set(
    isGlobal
      ? allPackages
      : files.flatMap((file) => {
          const name = /^packages\/([^/]+)\//u.exec(file)?.[1];
          return name && allPackages.includes(name) ? [name] : [];
        }),
  );

  const affected = isGlobal
    ? new Set(allPackages)
    : expandDependents(direct, getDependentsMap(packagesMap));

  // Both smoke scaffolds install every workspace package, so any package change
  // runs every smoke job; only the e2e spec directories are target-specific.
  const packagesTouched = affected.size > 0;
  const smokeCli =
    packagesTouched ||
    files.some((file) => {
      return (
        matches(file, SMOKE_PATTERNS.cli) || matches(file, SMOKE_PATTERNS.both)
      );
    });
  const smokeDocusaurus =
    packagesTouched ||
    files.some((file) => {
      return (
        matches(file, SMOKE_PATTERNS.docusaurus) ||
        matches(file, SMOKE_PATTERNS.both)
      );
    });

  // "CI tooling", not just workflow YAML: this drives the linter job's
  // actionlint / shellcheck / `test:scripts` steps, and the gate's own suite
  // lives under `tests/ci`.
  const workflows = files.some((file) => {
    return file.startsWith(".github/") || file.startsWith("tests/ci/");
  });

  const sort = (names: Iterable<string>): string[] => {
    return [...names].sort();
  };

  return {
    code: packagesTouched,
    packages: sort(affected),
    direct_packages: sort(direct),
    smoke: smokeCli || smokeDocusaurus,
    smoke_cli: smokeCli,
    smoke_docusaurus: smokeDocusaurus,
    workflows,
    docs_only: !packagesTouched && !smokeCli && !smokeDocusaurus && !workflows,
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
    (await import("../../packages/tooling-config/scripts/shared/dependencies-utils.mjs")) as {
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
