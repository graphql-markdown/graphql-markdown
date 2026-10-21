import { afterEach, describe, expect, test } from "vitest";

import { runtimeModuleSpecifier } from "../../src";

const globalScope = globalThis as typeof globalThis & { Deno?: unknown };

describe("runtimeModuleSpecifier", () => {
  afterEach(() => {
    delete globalScope.Deno;
  });

  describe("without Deno", () => {
    test.each([
      "graphql-config",
      "@graphql-markdown/diff",
      "./x.js",
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
      "./x.js",
      "../x.js",
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
