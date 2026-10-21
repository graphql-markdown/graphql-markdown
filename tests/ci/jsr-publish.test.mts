import { describe, expect, test } from "vitest";

import {
  denoRehearsalArgs,
  dirtyTreeIsFatal,
  isPublishedOnJsr,
  jsrMetaUrl,
  jsrPublishArgs,
  jsrWorkspaceJson,
  metaHasVersion,
  parseRegistryArg,
  resolveLocalBin,
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

  test.each(["jsr", "deno"])("resolveLocalBin() for %s", (name) => {
    const pkgBin = `/r/packages/tooling-config/node_modules/.bin/${name}`;
    const rootBin = `/r/node_modules/.bin/${name}`;
    expect(resolveLocalBin("/r", name, (p) => p === pkgBin)).toBe(pkgBin);
    expect(resolveLocalBin("/r", name, (p) => p === rootBin)).toBe(rootBin);
    expect(resolveLocalBin("/r", name, () => true)).toBe(pkgBin);
    expect(resolveLocalBin("/r", name, () => false)).toBeUndefined();
  });

  test("dirtyTreeIsFatal()", () => {
    const base = { dirty: true, runJsr: true, dryRun: false };
    expect(dirtyTreeIsFatal(base)).toBe(true);
    expect(dirtyTreeIsFatal({ ...base, dirty: false })).toBe(false);
    expect(dirtyTreeIsFatal({ ...base, runJsr: false })).toBe(false);
    expect(dirtyTreeIsFatal({ ...base, dryRun: true })).toBe(false);
  });

  test("jsrWorkspaceJson()", () => {
    expect(JSON.parse(jsrWorkspaceJson(["types", "core"]))).toEqual({
      workspace: ["./packages/types", "./packages/core"],
      nodeModulesDir: "none",
    });
  });

  test("denoRehearsalArgs()", () => {
    expect(denoRehearsalArgs()).toEqual([
      "publish",
      "--dry-run",
      "--allow-dirty",
    ]);
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
