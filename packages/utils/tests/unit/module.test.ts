import { afterEach, describe, expect, test, vi } from "vitest";

import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runtimeModuleSpecifier } from "../../src/module";

const g = globalThis as Record<string, unknown>;

const projectDir = resolve(tmpdir(), "project", "docs");

describe("runtimeModuleSpecifier", () => {
  afterEach(() => {
    delete g.Deno;
    vi.restoreAllMocks();
  });

  describe("relative paths", () => {
    test.each([
      "./lib/custom-mdx.cjs",
      "../lib/custom-mdx.cjs",
      ".\\lib\\custom-mdx.cjs",
    ])("resolves %s from the current working directory", (name) => {
      vi.spyOn(process, "cwd").mockReturnValue(projectDir);
      const expected = pathToFileURL(resolve(projectDir, name)).href;

      expect(runtimeModuleSpecifier(name)).toBe(expected);
      g.Deno = {};
      expect(runtimeModuleSpecifier(name, "^1.0.0")).toBe(expected);
    });

    test("does not treat a dot-prefixed package name as a path", () => {
      expect(runtimeModuleSpecifier(".hidden-package")).toBe(".hidden-package");
    });
  });

  describe("without Deno", () => {
    test.each([
      "graphql-config",
      "@graphql-markdown/diff",
      "/abs/x.js",
      "file:///x.js",
    ])("returns %s unchanged", (name) => {
      expect(runtimeModuleSpecifier(name)).toBe(name);
      expect(runtimeModuleSpecifier(name, "^1.0.0")).toBe(name);
    });
  });

  describe("with Deno", () => {
    test.each([
      ["graphql-config", "npm:graphql-config"],
      ["@graphql-markdown/diff", "jsr:@graphql-markdown/diff"],
      ["@docusaurus/logger", "npm:@docusaurus/logger"],
    ])("prefixes %s", (name, expected) => {
      g.Deno = {};
      expect(runtimeModuleSpecifier(name)).toBe(expected);
    });

    test.each([
      "/abs/x.js",
      "file:///x.js",
      "http://x/y.js",
      "https://x/y.js",
      "jsr:@graphql-markdown/diff",
      "npm:prettier",
      "node:fs",
      "data:text/javascript,1",
    ])("passes %s through", (name) => {
      g.Deno = {};
      expect(runtimeModuleSpecifier(name, "^1.0.0")).toBe(name);
    });

    test("inserts ranges", () => {
      g.Deno = {};
      expect(runtimeModuleSpecifier("prettier", "^3.8.3")).toBe(
        "npm:prettier@^3.8.3",
      );
      expect(runtimeModuleSpecifier("@graphql-markdown/diff", "^1.1.22")).toBe(
        "jsr:@graphql-markdown/diff@^1.1.22",
      );
    });

    test("handles scoped names with subpath", () => {
      g.Deno = {};
      expect(runtimeModuleSpecifier("@scope/pkg/sub/path", "^1")).toBe(
        "npm:@scope/pkg@^1/sub/path",
      );
      expect(runtimeModuleSpecifier("pkg/sub", "^1")).toBe("npm:pkg@^1/sub");
    });
  });
});
