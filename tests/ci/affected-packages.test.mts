import { describe, expect, test } from "vitest";

import { computeAffected } from "../../.github/scripts/affected-packages.mts";
import type { PackagesMap } from "../../.github/scripts/affected-packages.mts";

// A miniature stand-in for the real workspace, so the expectations stay
// readable and do not churn every time a package gains a dependency.
const packagesMap: PackagesMap = {
  "@graphql-markdown/utils": {},
  "@graphql-markdown/logger": {},
  "@graphql-markdown/graphql": {
    dependencies: { "@graphql-markdown/utils": "workspace:*" },
  },
  "@graphql-markdown/core": {
    dependencies: {
      "@graphql-markdown/graphql": "workspace:*",
      "@graphql-markdown/logger": "workspace:*",
    },
  },
  "@graphql-markdown/cli": {
    peerDependencies: { "@graphql-markdown/core": "workspace:*" },
  },
};

const allPackages = ["cli", "core", "graphql", "logger", "utils"];

describe("computeAffected() dependency closure", () => {
  test("expands a package change into its transitive dependents", () => {
    const outputs = computeAffected(
      ["packages/utils/src/string.ts"],
      packagesMap,
    );

    expect(outputs.packages).toStrictEqual(["cli", "core", "graphql", "utils"]);
    expect(outputs.code).toBe(true);
  });

  test("follows peerDependencies as well as dependencies", () => {
    expect(
      computeAffected(["packages/core/src/index.ts"], packagesMap),
    ).toHaveProperty("packages", ["cli", "core"]);
  });

  test("keeps mutation scoped to the packages changed directly", () => {
    const outputs = computeAffected(
      ["packages/utils/src/string.ts"],
      packagesMap,
    );

    // Mutation score is a function of a package's own src + tests, so an
    // upstream change must not re-run every dependent's Stryker job.
    expect(outputs.direct_packages).toStrictEqual(["utils"]);
  });
});

describe("computeAffected() global fail-open", () => {
  // Runtime tier: these change what a package's own tests execute, so they
  // widen mutation testing as well as the dependency closure.
  test.each([
    ["bun.lock"],
    ["package.json"],
    ["tsconfig.base.json"],
    ["turbo.json"],
    ["vitest.config.mjs"],
    ["packages/tooling-config/stryker/stryker.conf.mjs"],
    [".github/actions/setup/action.yml"],
  ])("runs the whole matrix, mutation included, for %s", (file) => {
    const outputs = computeAffected([file], packagesMap);

    expect(outputs.packages).toStrictEqual(allPackages);
    expect(outputs.direct_packages).toStrictEqual(allPackages);
    expect(outputs.smoke).toBe(true);
  });

  // Static tier: type definitions are erased before a mutant runs and CI
  // tooling is not part of any package, so neither can move a Stryker score.
  test.each([
    ["packages/types/src/core.d.ts"],
    [".github/scripts/affected-packages.mts"],
    // This very file: the gate must invalidate itself, or a change to its own
    // tests would report `docs_only` and never run them.
    ["tests/ci/affected-packages.test.mts"],
    ["tests/ci/vitest.config.mjs"],
  ])("runs the whole test matrix but no extra mutation job for %s", (file) => {
    const outputs = computeAffected([file], packagesMap);

    expect(outputs.packages).toStrictEqual(allPackages);
    expect(outputs.smoke).toBe(true);
  });

  test("keeps mutation on the touched packages for a types-only change", () => {
    // The shape of nearly every public API PR: a `.d.ts` edit alongside the
    // packages implementing it. The closure still covers everything, but
    // Stryker only runs where the sources actually changed.
    const outputs = computeAffected(
      ["packages/types/src/core.d.ts", "packages/core/src/config.ts"],
      packagesMap,
    );

    expect(outputs.packages).toStrictEqual(allPackages);
    expect(outputs.direct_packages).toStrictEqual(["core"]);
  });

  test("runs no mutation job for a CI-only change", () => {
    expect(
      computeAffected([".github/scripts/changed-files.sh"], packagesMap),
    ).toHaveProperty("direct_packages", []);
  });
});

describe("computeAffected() smoke targets", () => {
  test("runs every smoke target when any package changes", () => {
    expect(
      computeAffected(["packages/logger/src/index.ts"], packagesMap),
    ).toMatchObject({ smoke_cli: true, smoke_docusaurus: true });
  });

  test.each([
    ["tests/e2e/cli/specs/cli.spec.mjs", true, false],
    ["tests/e2e/docusaurus/specs/cli.spec.mjs", false, true],
    // Markdown under tests/ is generator input, not documentation.
    ["tests/e2e/__data__/anilist.md", true, true],
    ["tests/e2e/helpers/cli.mjs", true, true],
    [".github/workflows/smoke.yml", true, true],
  ])("scopes %s to the smoke targets it exercises", (file, cli, docusaurus) => {
    const outputs = computeAffected([file], packagesMap);

    expect(outputs.smoke_cli).toBe(cli);
    expect(outputs.smoke_docusaurus).toBe(docusaurus);
    // e2e specs are outside every Stryker `mutate` glob.
    expect(outputs.direct_packages).toStrictEqual([]);
  });
});

describe("computeAffected() documentation and tooling", () => {
  test("returns nothing to run for a documentation-only change", () => {
    expect(
      computeAffected(
        ["docs/settings.md", "README.md", "api/index.md", "website/src/app.js"],
        packagesMap,
      ),
    ).toMatchObject({
      code: false,
      packages: [],
      direct_packages: [],
      smoke: false,
      workflows: false,
      docs_only: true,
    });
  });

  test("ignores documentation shipped inside a package", () => {
    expect(
      computeAffected(
        ["packages/utils/docs/api.md", "packages/utils/README.md"],
        packagesMap,
      ),
    ).toMatchObject({ code: false, packages: [], docs_only: true });
  });

  test("flags its own test suite so the linter job runs it", () => {
    expect(
      computeAffected(["tests/ci/affected-packages.test.mts"], packagesMap),
    ).toMatchObject({ workflows: true, docs_only: false });
  });

  test("flags workflow changes so actionlint and shellcheck still run", () => {
    expect(
      computeAffected([".github/workflows/test.yml"], packagesMap),
    ).toMatchObject({ code: false, workflows: true, docs_only: false });
  });

  test("ignores blank lines from the git diff output", () => {
    expect(computeAffected(["", "  ", ""], packagesMap)).toMatchObject({
      docs_only: true,
    });
  });
});
