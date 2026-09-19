import { describe, it, expect } from "vitest";
import { swizzleManifest } from "../../swizzle.manifest";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const packageRoot = join(import.meta.dirname || __dirname, "../..");

describe("swizzleManifest", () => {
  it("should have exactly 9 entries", () => {
    expect(swizzleManifest).toHaveLength(9);
  });

  it("should have unique IDs", () => {
    const ids = swizzleManifest.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have sourcePath for each entry pointing to existing files", () => {
    for (const entry of swizzleManifest) {
      const fullPath = join(packageRoot, entry.sourcePath);
      expect(existsSync(fullPath), `File ${fullPath} should exist`).toBe(true);
      const stats = statSync(fullPath);
      expect(stats.isFile(), `${fullPath} should be a file`).toBe(true);
    }
  });

  it("should have consistent targetPath with sourcePath", () => {
    for (const entry of swizzleManifest) {
      // For now, targetPath should match sourcePath for all entries
      expect(entry.targetPath).toBe(entry.sourcePath);
    }
  });

  it("should have non-empty description for each entry", () => {
    for (const entry of swizzleManifest) {
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.description).toMatch(/\S/);
    }
  });

  it("should cover all components in app/components", () => {
    const componentDir = join(packageRoot, "app/components");
    if (existsSync(componentDir)) {
      const files = readdirSync(componentDir)
        .filter((f) => f.endsWith(".vue"))
        .sort();

      for (const file of files) {
        const fullPath = `app/components/${file}`;
        const hasEntry = swizzleManifest.some(
          (e) => e.sourcePath === fullPath
        );
        expect(
          hasEntry,
          `File app/components/${file} should have a manifest entry`
        ).toBe(true);
      }
    }
  });

  it("should cover all layouts in app/layouts", () => {
    const layoutDir = join(packageRoot, "app/layouts");
    if (existsSync(layoutDir)) {
      const files = readdirSync(layoutDir, { recursive: true })
        .filter((f) => typeof f === "string" && f.endsWith(".vue"))
        .sort();

      for (const file of files) {
        const fullPath = `app/layouts/${file}`;
        const hasEntry = swizzleManifest.some(
          (e) => e.sourcePath === fullPath
        );
        expect(
          hasEntry,
          `File app/layouts/${file} should have a manifest entry`
        ).toBe(true);
      }
    }
  });

  it("should cover all pages in app/pages", () => {
    const pageDir = join(packageRoot, "app/pages");
    if (existsSync(pageDir)) {
      const files = readdirSync(pageDir, { recursive: true })
        .filter((f) => typeof f === "string" && f.endsWith(".vue"))
        .sort();

      for (const file of files) {
        const fullPath = `app/pages/${file}`;
        const hasEntry = swizzleManifest.some(
          (e) => e.sourcePath === fullPath
        );
        expect(
          hasEntry,
          `File app/pages/${file} should have a manifest entry`
        ).toBe(true);
      }
    }
  });
});
