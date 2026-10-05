import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const hooks = vi.hoisted(() => {
  return {
    nuxt: { options: { rootDir: "", watch: [] as string[] } },
  };
});

vi.mock("@nuxt/kit", () => {
  return {
    defineNuxtModule: (definition: unknown) => {
      return definition;
    },
    useNuxt: () => {
      return hooks.nuxt;
    },
  };
});

const mod = (await import("../../modules/generate")).default as unknown as {
  meta: { name: string; configKey: string };
  defaults: { entry: string };
  setup: (options: { entry?: string }) => Promise<void>;
};

describe("generate module", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "generate-module-"));
    hooks.nuxt.options.rootDir = root;
    hooks.nuxt.options.watch = [];
    (globalThis as Record<string, unknown>).__generateCalls = 0;
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("declares its metadata and default entry", () => {
    expect(mod.meta).toEqual({
      name: "gqlmd-generate",
      configKey: "gqlmdGenerate",
    });
    expect(mod.defaults.entry).toBe("./generate-docs.ts");
  });

  it("watches the entry and awaits its generate()", async () => {
    writeFileSync(
      join(root, "entry.mjs"),
      "export const generate = async () => { globalThis.__generateCalls++; };",
    );

    await mod.setup({ entry: "./entry.mjs" });

    expect(hooks.nuxt.options.watch).toEqual([resolve(root, "entry.mjs")]);
    expect((globalThis as Record<string, unknown>).__generateCalls).toBe(1);
  });

  it("propagates errors thrown by generate()", async () => {
    writeFileSync(
      join(root, "fail.mjs"),
      'export const generate = async () => { throw new Error("boom"); };',
    );

    await expect(mod.setup({ entry: "./fail.mjs" })).rejects.toThrow("boom");
  });

  it("fails when the entry does not exist", async () => {
    await expect(mod.setup({ entry: "./missing.mjs" })).rejects.toThrow();
  });
});
