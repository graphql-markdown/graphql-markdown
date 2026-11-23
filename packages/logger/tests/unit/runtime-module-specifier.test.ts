import { afterEach, describe, expect, test, vi } from "vitest";

import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runtimeModuleSpecifier } from "../../src";

const globalScope = globalThis as typeof globalThis & { Deno?: unknown };

describe("runtimeModuleSpecifier", () => {
  afterEach(() => {
    delete globalScope.Deno;
    vi.restoreAllMocks();
  });

  describe("relative paths", () => {
    const projectDir = resolve(tmpdir(), "project", "docs");

    test.each(["./lib/logger.mjs", "../lib/logger.mjs"])(
      "resolves %s from the current working directory",
      (name) => {
        vi.spyOn(process, "cwd").mockReturnValue(projectDir);
        const expected = pathToFileURL(resolve(projectDir, name)).href;

        expect(runtimeModuleSpecifier(name)).toBe(expected);
        globalScope.Deno = {};
        expect(runtimeModuleSpecifier(name)).toBe(expected);
      },
    );
  });

  describe("without Deno", () => {
    test.each([
      "graphql-config",
      "@graphql-markdown/diff",
      "/abs/x.js",
      "file:///x.js",
    ])("returns %s unchanged", (name) => {
      expect(runtimeModuleSpecifier(name)).toBe(name);
    });
  });

  describe("with Deno", () => {
    test.each([
      ["graphql-config", "npm:graphql-config"],
      ["@docusaurus/logger", "npm:@docusaurus/logger"],
    ])("prefixes bare name %s with npm:", (name, expected) => {
      globalScope.Deno = {};
      expect(runtimeModuleSpecifier(name)).toBe(expected);
    });

    test("prefixes @graphql-markdown/* with jsr:", () => {
      globalScope.Deno = {};
      expect(runtimeModuleSpecifier("@graphql-markdown/diff")).toBe(
        "jsr:@graphql-markdown/diff",
      );
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
    ])("passes %s through unchanged", (name) => {
      globalScope.Deno = {};
      expect(runtimeModuleSpecifier(name)).toBe(name);
    });
  });
});
