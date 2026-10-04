import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const hooks = vi.hoisted(() => ({
  nuxt: {
    options: { rootDir: "", appConfig: {} as Record<string, unknown> },
    hook: vi.fn(),
  },
}));

vi.mock("@nuxt/kit", () => ({
  defineNuxtModule: (definition: unknown) => definition,
  useNuxt: () => hooks.nuxt,
}));

const mod = await import("../../modules/prerender");

describe("prerender module", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "prerender-"));
    hooks.nuxt.options.rootDir = root;
    hooks.nuxt.options.appConfig = {};
    hooks.nuxt.hook.mockReset();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("walk skips hidden and underscore entries and non-markdown files", async () => {
    mkdirSync(join(root, "a", "b"), { recursive: true });
    mkdirSync(join(root, "_private"));
    writeFileSync(join(root, "a", "b", "x.md"), "");
    writeFileSync(join(root, "a", "y.txt"), "");
    writeFileSync(join(root, "_private", "z.md"), "");
    writeFileSync(join(root, ".hidden.md"), "");
    expect(await mod.walk(root)).toEqual([join(root, "a", "b", "x.md")]);
  });

  it("walk returns nothing for a missing directory", async () => {
    expect(await mod.walk(join(root, "missing"))).toEqual([]);
  });

  it("routeFor maps files and generated.md to routes", () => {
    expect(mod.routeFor(root, join(root, "api", "types", "user.md"))).toBe(
      "/api/types/user",
    );
    expect(mod.routeFor(root, join(root, "api", "s", "generated.md"))).toBe(
      "/api/s",
    );
  });

  it("registers content routes and the base URL on prerender:routes", async () => {
    mkdirSync(join(root, "content", "api-reference"), { recursive: true });
    writeFileSync(join(root, "content", "api-reference", "generated.md"), "");

    (mod.default as { setup: () => void }).setup();
    const [hookName, nitroInit] = hooks.nuxt.hook.mock.calls[0];
    expect(hookName).toBe("nitro:init");

    const nitroHook = vi.fn();
    nitroInit({ hooks: { hook: nitroHook } });
    const [name, handler] = nitroHook.mock.calls[0];
    expect(name).toBe("prerender:routes");

    const routes = new Set<string>();
    await handler(routes);
    expect(routes.has("/api-reference")).toBe(true);

    hooks.nuxt.options.appConfig = { gqlmd: { baseURL: "docs" } };
    await handler(routes);
    expect(routes.has("/docs")).toBe(true);
  });
});
