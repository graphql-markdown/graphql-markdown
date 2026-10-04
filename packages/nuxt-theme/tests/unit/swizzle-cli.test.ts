import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { swizzleManifest } from "../../swizzle.manifest";

const packageRoot = join(import.meta.dirname || __dirname, "../..");

describe("gqlmd-swizzle CLI", () => {
  it("should output JSON list that matches swizzleManifest", () => {
    const swizzlePath = join(packageRoot, "bin/swizzle.mjs");

    // Run the CLI with --list flag
    let output;
    try {
      output = execFileSync("node", [swizzlePath, "--list"], {
        cwd: packageRoot,
        encoding: "utf-8",
      });
    } catch (error) {
      // If it fails, capture the error output
      if (error.stdout) {
        output = error.stdout;
      } else {
        throw new Error(`CLI failed to run: ${error.message}`, {
          cause: error,
        });
      }
    }

    // Parse the output as JSON
    let jsonOutput;
    try {
      jsonOutput = JSON.parse(output);
    } catch (error) {
      throw new Error(`CLI output is not valid JSON: ${output}`, {
        cause: error,
      });
    }

    // Verify it's an array
    expect(Array.isArray(jsonOutput)).toBe(true);

    // Verify length matches
    expect(jsonOutput).toHaveLength(swizzleManifest.length);

    // Verify each entry matches
    for (let i = 0; i < swizzleManifest.length; i++) {
      const expected = swizzleManifest[i];
      const actual = jsonOutput[i];

      expect(actual.id).toBe(expected.id);
      expect(actual.sourcePath).toBe(expected.sourcePath);
      expect(actual.targetPath).toBe(expected.targetPath);
      expect(actual.description).toBe(expected.description);
    }
  });

  it("should list all 11 components", () => {
    const swizzlePath = join(packageRoot, "bin/swizzle.mjs");

    let output;
    try {
      output = execFileSync("node", [swizzlePath, "--list"], {
        cwd: packageRoot,
        encoding: "utf-8",
      });
    } catch (error) {
      if (error.stdout) {
        output = error.stdout;
      } else {
        throw new Error(`CLI failed to run: ${error.message}`, {
          cause: error,
        });
      }
    }

    const jsonOutput = JSON.parse(output);
    expect(
      jsonOutput.map((e) => {
        return e.id;
      }),
    ).toEqual([
      "SiteHeader",
      "SiteFooter",
      "SchemaCodeCard",
      "ApiOverviewGrid",
      "ApiNamespaceLanding",
      "ApiDocumentContent",
      "ApiCodeColumn",
      "ApiSinglePageSection",
      "ApiSinglePageEntry",
      "ReferenceLayout",
      "ReferencePage",
    ]);
  });
});
