import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const promptState = vi.hoisted(() => ({
  select: vi.fn(),
  confirm: vi.fn(),
  cancelled: Symbol("cancel"),
}));

vi.mock("@clack/prompts", () => ({
  select: promptState.select,
  confirm: promptState.confirm,
  isCancel: (value: unknown) => value === promptState.cancelled,
}));

const swizzle = await import("../../bin/swizzle.mjs");
const { swizzleManifest } = await import("../../swizzle.manifest.mjs");

const entry = swizzleManifest[0];

describe("swizzle CLI functions", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "swizzle-"));
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    promptState.select.mockReset();
    promptState.confirm.mockReset();
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe("parseArgs", () => {
    it("parses value flags, boolean flags and ignores positionals", () => {
      expect(swizzle.parseArgs(["pos", "--component", "x", "--list"])).toEqual({
        component: "x",
        list: true,
      });
    });

    it("treats --yes as --force", () => {
      expect(swizzle.parseArgs(["--yes"])).toEqual({ yes: true, force: true });
    });
  });

  describe("findComponent", () => {
    it("finds a known component", () => {
      expect(swizzle.findComponent(entry.id)).toEqual({ entry });
    });

    it("fails for an unknown component", () => {
      expect(swizzle.findComponent("nope")).toEqual({ exitCode: 1 });
      expect(console.error).toHaveBeenCalledWith("Unknown component: nope");
    });
  });

  describe("promptComponent", () => {
    it("returns the selected entry", async () => {
      promptState.select.mockResolvedValue(entry.id);
      expect(await swizzle.promptComponent()).toEqual({ entry });
    });

    it("exits 0 when cancelled", async () => {
      promptState.select.mockResolvedValue(promptState.cancelled);
      expect(await swizzle.promptComponent()).toEqual({ exitCode: 0 });
    });

    it("exits 1 when prompts fail", async () => {
      promptState.select.mockRejectedValue(new Error("boom"));
      expect(await swizzle.promptComponent()).toEqual({ exitCode: 1 });
    });
  });

  describe("confirmOverwrite", () => {
    it("continues when confirmed", async () => {
      promptState.confirm.mockResolvedValue(true);
      expect(await swizzle.confirmOverwrite(entry)).toBeUndefined();
    });

    it("stops with 0 when declined or cancelled", async () => {
      promptState.confirm.mockResolvedValue(false);
      expect(await swizzle.confirmOverwrite(entry)).toBe(0);
      promptState.confirm.mockResolvedValue(promptState.cancelled);
      expect(await swizzle.confirmOverwrite(entry)).toBe(0);
    });

    it("stops with 1 when prompts fail", async () => {
      promptState.confirm.mockRejectedValue(new Error("boom"));
      expect(await swizzle.confirmOverwrite(entry)).toBe(1);
    });
  });

  describe("checkSwizzled", () => {
    const target = () => join(cwd, entry.targetPath);

    it("warns when the stamped version differs", () => {
      mkdirSync(join(target(), ".."), { recursive: true });
      writeFileSync(
        target(),
        "// swizzled from @graphql-markdown/nuxt-theme@0.0.1\n",
      );
      swizzle.checkSwizzled(cwd, "9.9.9");
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("is silent for matching versions and missing files", () => {
      swizzle.checkSwizzled(cwd, "9.9.9");
      mkdirSync(join(target(), ".."), { recursive: true });
      writeFileSync(
        target(),
        "// swizzled from @graphql-markdown/nuxt-theme@9.9.9\n",
      );
      swizzle.checkSwizzled(cwd, "9.9.9");
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe("run", () => {
    it("lists the manifest", async () => {
      expect(await swizzle.run({ list: true }, cwd)).toBe(0);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify(swizzleManifest, null, 2),
      );
    });

    it("runs the version check", async () => {
      expect(await swizzle.run({ check: true }, cwd)).toBe(0);
    });

    it("returns the failure code for an unknown component", async () => {
      expect(await swizzle.run({ component: "nope" }, cwd)).toBe(1);
    });

    it("copies the component with a stamp", async () => {
      expect(await swizzle.run({ component: entry.id }, cwd)).toBe(0);
      const copied = readFileSync(join(cwd, entry.targetPath), "utf-8");
      expect(copied).toContain("swizzled from @graphql-markdown/nuxt-theme@");
    });

    it("asks before overwriting and stops when declined", async () => {
      await swizzle.run({ component: entry.id }, cwd);
      promptState.confirm.mockResolvedValue(false);
      expect(await swizzle.run({ component: entry.id }, cwd)).toBe(0);
      expect(promptState.confirm).toHaveBeenCalled();
    });

    it("overwrites without asking when forced", async () => {
      await swizzle.run({ component: entry.id }, cwd);
      expect(await swizzle.run({ component: entry.id, force: true }, cwd)).toBe(
        0,
      );
      expect(promptState.confirm).not.toHaveBeenCalled();
    });

    it("uses the interactive prompt without --component", async () => {
      promptState.select.mockResolvedValue(entry.id);
      expect(await swizzle.run({}, cwd)).toBe(0);
    });
  });
});
