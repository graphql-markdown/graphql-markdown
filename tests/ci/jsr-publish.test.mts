import { describe, expect, test } from "vitest";

import {
  isPublishedOnJsr,
  jsrMetaUrl,
  jsrPublishArgs,
  metaHasVersion,
  parseRegistryArg,
  resolveDenoBin,
  resolveJsrBin,
} from "../../packages/tooling-config/scripts/jsr-publish.mts";

describe("parseRegistryArg()", () => {
  test("defaults to all", () => {
    expect(parseRegistryArg(["--yes", "core"])).toEqual({
      registry: "all",
      rest: ["--yes", "core"],
    });
  });

  test("parses separated and = forms and strips them from rest", () => {
    expect(parseRegistryArg(["--registry", "jsr", "core"])).toEqual({
      registry: "jsr",
      rest: ["core"],
    });
    expect(parseRegistryArg(["--registry=npm", "-n"])).toEqual({
      registry: "npm",
      rest: ["-n"],
    });
  });

  test("rejects invalid or missing values", () => {
    expect(parseRegistryArg(["--registry", "pypi"]).error).toMatch(/invalid/);
    expect(parseRegistryArg(["--registry"]).error).toMatch(/invalid/);
  });
});

describe("jsr helpers", () => {
  test("jsrMetaUrl()", () => {
    expect(jsrMetaUrl("@graphql-markdown/core")).toBe(
      "https://jsr.io/@graphql-markdown/core/meta.json",
    );
  });

  test("metaHasVersion()", () => {
    expect(metaHasVersion({ versions: { "1.0.0": {} } }, "1.0.0")).toBe(true);
    expect(metaHasVersion({ versions: { "1.0.0": {} } }, "1.0.1")).toBe(false);
    expect(metaHasVersion(null, "1.0.0")).toBe(false);
    expect(metaHasVersion({}, "1.0.0")).toBe(false);
  });

  test("jsrPublishArgs()", () => {
    expect(jsrPublishArgs(false)).toEqual(["publish"]);
    expect(jsrPublishArgs(true)).toEqual(["publish", "--dry-run"]);
  });

  test("resolveJsrBin()", () => {
    const pkgBin = "/r/packages/tooling-config/node_modules/.bin/jsr";
    const rootBin = "/r/node_modules/.bin/jsr";
    expect(resolveJsrBin("/r", (p) => p === pkgBin)).toBe(pkgBin);
    expect(resolveJsrBin("/r", (p) => p === rootBin)).toBe(rootBin);
    expect(resolveJsrBin("/r", () => true)).toBe(pkgBin);
    expect(resolveJsrBin("/r", () => false)).toBeUndefined();
  });

  test("resolveDenoBin()", () => {
    const pkgBin = "/r/packages/tooling-config/node_modules/.bin/deno";
    const rootBin = "/r/node_modules/.bin/deno";
    expect(resolveDenoBin("/r", (p) => p === pkgBin)).toBe(pkgBin);
    expect(resolveDenoBin("/r", (p) => p === rootBin)).toBe(rootBin);
    expect(resolveDenoBin("/r", () => false)).toBeUndefined();
  });
});

describe("isPublishedOnJsr()", () => {
  const respond = (ok: boolean, body: unknown = {}) => {
    return (async () => {
      return { ok, json: async () => body };
    }) as unknown as typeof fetch;
  };

  test("true when the version is listed", async () => {
    expect(
      await isPublishedOnJsr(
        "@graphql-markdown/core",
        "1.0.0",
        respond(true, { versions: { "1.0.0": {} } }),
      ),
    ).toBe(true);
  });

  test("false on 404 or missing version", async () => {
    expect(await isPublishedOnJsr("@a/b", "1.0.0", respond(false))).toBe(false);
    expect(
      await isPublishedOnJsr("@a/b", "1.0.0", respond(true, { versions: {} })),
    ).toBe(false);
  });

  test("false on network error", async () => {
    const failing = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await isPublishedOnJsr("@a/b", "1.0.0", failing)).toBe(false);
  });
});
