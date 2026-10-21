import { describe, expect, test } from "vitest";

import {
  expectedImports,
  resolveOptionalRange,
  resolveRange,
  rewriteOptionalRanges,
  syncVersionConstant,
} from "../../packages/tooling-config/scripts/jsr-sync.mts";

const root = {
  workspaces: {
    catalog: { "graphql-config": "5.1.8", graphql: "^16.0.0 || ^17.0.0" },
    catalogs: { tools: { "@tools/utils": "12.1.0" } },
  },
};

describe("resolveRange()", () => {
  test("resolves catalog: and catalog:<group>", () => {
    const pkg = {
      dependencies: {
        "graphql-config": "catalog:",
        "@tools/utils": "catalog:tools",
      },
    };
    expect(resolveRange("graphql-config", pkg, root)).toEqual({
      value: "5.1.8",
    });
    expect(resolveRange("@tools/utils", pkg, root)).toEqual({
      value: "12.1.0",
    });
  });

  test("falls back to peerDependencies", () => {
    expect(
      resolveRange("foo", { peerDependencies: { foo: "^2.0.0" } }, root),
    ).toEqual({ value: "^2.0.0" });
  });

  test("applies the graphql override", () => {
    const pkg = { peerDependencies: { graphql: "catalog:" } };
    expect(resolveRange("graphql", pkg, root)).toEqual({ value: "^17.0.0" });
  });

  test("reports || without override", () => {
    const pkg = { dependencies: { foo: "^1 || ^2" } };
    expect(resolveRange("foo", pkg, root).problem).toMatch(/override/);
  });

  test("reports missing dependency and devDependencies-only", () => {
    expect(resolveRange("foo", {}, root).problem).toMatch(/not in/);
    expect(
      resolveRange("foo", { devDependencies: { foo: "1.0.0" } }, root).problem,
    ).toMatch(/not in/);
  });
});

describe("expectedImports()", () => {
  const versions = new Map([["@graphql-markdown/types", "1.18.0"]]);
  const pkg = { dependencies: { graphql: "catalog:", foo: "^3.0.0" } };

  test("keeps key order and computes values", () => {
    const { imports, problems } = expectedImports(
      {
        foo: "old",
        "@graphql-markdown/types": "old",
        "graphql/": "old",
        graphql: "old",
      },
      pkg,
      root,
      versions,
    );
    expect(problems).toEqual([]);
    expect(Object.keys(imports)).toEqual([
      "foo",
      "@graphql-markdown/types",
      "graphql/",
      "graphql",
    ]);
    expect(imports).toEqual({
      foo: "npm:foo@^3.0.0",
      "@graphql-markdown/types": "jsr:@graphql-markdown/types@^1.18.0",
      "graphql/": "npm:/graphql@^17.0.0/",
      graphql: "npm:graphql@^17.0.0",
    });
  });

  test("reports problems and keeps the old value", () => {
    const { imports, problems } = expectedImports(
      { missing: "keep", "@graphql-markdown/nope": "keep" },
      pkg,
      root,
      versions,
    );
    expect(problems).toHaveLength(2);
    expect(imports).toEqual({
      missing: "keep",
      "@graphql-markdown/nope": "keep",
    });
  });
});

describe("syncVersionConstant()", () => {
  test("rewrites only the literal", () => {
    const source = `/** doc */\nexport const VERSION: string = "1.0.0";\n`;
    expect(syncVersionConstant(source, "2.0.0")).toBe(
      `/** doc */\nexport const VERSION: string = "2.0.0";\n`,
    );
  });
});

describe("resolveOptionalRange()", () => {
  const versions = new Map([["@graphql-markdown/diff", "1.2.3"]]);
  const resolve = (name: string, spec: string) =>
    resolveOptionalRange(
      name,
      { dependencies: { [name]: spec } },
      root,
      versions,
    );

  test("resolves workspace specs to the workspace version", () => {
    for (const spec of ["workspace:*", "workspace:^", "workspace:~"]) {
      expect(resolve("@graphql-markdown/diff", spec)).toEqual({
        value: "^1.2.3",
      });
    }
  });

  test("resolves catalog specs and carets exact versions", () => {
    expect(resolve("graphql-config", "catalog:")).toEqual({ value: "^5.1.8" });
    expect(resolve("foo", "3.8.3")).toEqual({ value: "^3.8.3" });
  });

  test("keeps other ranges as is", () => {
    expect(resolve("foo", "~3.1.0")).toEqual({ value: "~3.1.0" });
  });

  test("reports || and missing keys", () => {
    expect(resolve("foo", "^1 || ^2").problem).toMatch(/not supported/);
    expect(resolveOptionalRange("bar", {}, root, versions).problem).toMatch(
      /not in/,
    );
  });
});

describe("rewriteOptionalRanges()", () => {
  test("rewrites only the values", () => {
    const source = `// header\nexport const R = {\n  "a/b": "^1.0.0",\n  prettier: "^3.0.0",\n};\n`;
    expect(
      rewriteOptionalRanges(source, { "a/b": "^1.1.0", prettier: "^3.8.3" }),
    ).toBe(
      `// header\nexport const R = {\n  "a/b": "^1.1.0",\n  prettier: "^3.8.3",\n};\n`,
    );
  });
});
