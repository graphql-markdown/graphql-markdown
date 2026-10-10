import { describe, expect, test } from "vitest";

import {
  checkPackedManifest,
  findUnsafeInternalRanges,
} from "../../packages/tooling-config/scripts/tarball-check.mts";

describe("findUnsafeInternalRanges()", () => {
  test("accepts pinned internal ranges", () => {
    expect(
      findUnsafeInternalRanges({
        dependencies: { "@graphql-markdown/core": "^1.2.3" },
      }),
    ).toEqual([]);
  });

  test("rejects empty, wildcard, workspace and latest internal ranges", () => {
    const problems = findUnsafeInternalRanges({
      dependencies: {
        "@graphql-markdown/core": "",
        "@graphql-markdown/utils": "*",
        "@graphql-markdown/logger": "workspace:^",
        "create-graphql-markdown-docs": "latest",
      },
    });
    expect(problems).toEqual([
      'dependencies.@graphql-markdown/core = ""',
      'dependencies.@graphql-markdown/utils = "*"',
      'dependencies.@graphql-markdown/logger = "workspace:^"',
      'dependencies.create-graphql-markdown-docs = "latest"',
    ]);
  });

  test("treats whitespace-only ranges as empty", () => {
    expect(
      findUnsafeInternalRanges({
        dependencies: { "@graphql-markdown/core": "   " },
      }),
    ).toHaveLength(1);
  });
});

describe("findUnsafeInternalRanges() scope", () => {
  test("ignores external dependencies even with wildcard ranges", () => {
    expect(
      findUnsafeInternalRanges({
        dependencies: { graphql: "*", "left-pad": "" },
      }),
    ).toEqual([]);
  });

  test("checks peerDependencies and optionalDependencies", () => {
    const problems = findUnsafeInternalRanges({
      peerDependencies: { "@graphql-markdown/core": "*" },
      optionalDependencies: { "@graphql-markdown/cli": "workspace:" },
    });
    expect(problems).toEqual([
      'peerDependencies.@graphql-markdown/core = "*"',
      'optionalDependencies.@graphql-markdown/cli = "workspace:"',
    ]);
  });

  test("ignores devDependencies", () => {
    expect(
      findUnsafeInternalRanges({
        devDependencies: { "@graphql-markdown/core": "workspace:^" },
      }),
    ).toEqual([]);
  });
});

describe("checkPackedManifest()", () => {
  test("reports invalid JSON", () => {
    expect(checkPackedManifest("{ not json")).toEqual(["invalid package.json"]);
  });

  test("accepts a clean manifest", () => {
    const manifest = JSON.stringify({
      dependencies: { "@graphql-markdown/core": "^1.2.3", graphql: "*" },
    });
    expect(checkPackedManifest(manifest)).toEqual([]);
  });

  test("reports unsafe internal ranges under one prefixed entry", () => {
    const manifest = JSON.stringify({
      dependencies: { "@graphql-markdown/core": "workspace:^" },
      peerDependencies: { "@graphql-markdown/utils": "" },
    });
    expect(checkPackedManifest(manifest)).toEqual([
      'unpinned internal dependency ranges: dependencies.@graphql-markdown/core = "workspace:^", peerDependencies.@graphql-markdown/utils = ""',
    ]);
  });
});
