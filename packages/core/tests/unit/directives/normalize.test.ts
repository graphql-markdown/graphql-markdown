/**
 * Unit tests for directive name normalization utilities.
 * @module
 */

import type { DirectiveName } from "@graphql-markdown/types";
import {
  normalizeDirectiveNames,
  uniqueDirectiveNames,
  combineDirectiveNames,
} from "../../../src/directives/normalize";

describe("Directive Name Normalization", () => {
  describe("normalizeDirectiveNames", () => {
    it("should flatten multiple directive arrays", () => {
      const cli = ["@example", "@internal"] as DirectiveName[];
      const config = ["@auth"] as DirectiveName[];

      const result = normalizeDirectiveNames(cli, config);
      expect(result).toEqual(["@example", "@internal", "@auth"]);
    });

    it("should handle single directive array", () => {
      const directives = ["@example", "@internal"] as DirectiveName[];
      const result = normalizeDirectiveNames(directives);
      expect(result).toEqual(["@example", "@internal"]);
    });

    it("should filter out null values", () => {
      const cli = ["@example"] as DirectiveName[];
      const result = normalizeDirectiveNames(cli, null, [
        "@auth",
      ] as DirectiveName[]);
      expect(result).toEqual(["@example", "@auth"]);
    });

    it("should filter out undefined values", () => {
      const cli = ["@example"] as DirectiveName[];
      const result = normalizeDirectiveNames(cli, undefined, [
        "@auth",
      ] as DirectiveName[]);
      expect(result).toEqual(["@example", "@auth"]);
    });

    it("should filter out empty arrays", () => {
      const cli = ["@example"] as DirectiveName[];
      const result = normalizeDirectiveNames(
        cli,
        [] as DirectiveName[],
        ["@auth"] as DirectiveName[],
      );
      expect(result).toEqual(["@example", "@auth"]);
    });

    it("should handle all null/undefined inputs", () => {
      const result = normalizeDirectiveNames(null, undefined, null);
      expect(result).toEqual([]);
    });

    it("should preserve duplicates during normalization", () => {
      const cli = ["@example", "@internal"] as DirectiveName[];
      const config = ["@example", "@auth"] as DirectiveName[];

      const result = normalizeDirectiveNames(cli, config);
      expect(result).toEqual(["@example", "@internal", "@example", "@auth"]);
      expect(
        result.filter((d: DirectiveName) => d === "@example"),
      ).toHaveLength(2);
    });

    it("should maintain order of directives", () => {
      const first = ["@z", "@y"] as DirectiveName[];
      const second = ["@x", "@w"] as DirectiveName[];

      const result = normalizeDirectiveNames(first, second);
      expect(result).toEqual(["@z", "@y", "@x", "@w"]);
    });

    it("should handle variadic arguments of different combinations", () => {
      const a = ["@a"] as DirectiveName[];
      const b = ["@b"] as DirectiveName[];
      const c = ["@c"] as DirectiveName[];
      const d = ["@d"] as DirectiveName[];

      const result = normalizeDirectiveNames(a, b, c, d);
      expect(result).toEqual(["@a", "@b", "@c", "@d"]);
    });
  });

  describe("uniqueDirectiveNames", () => {
    it("should remove duplicate directives", () => {
      const directives = [
        "@auth",
        "@example",
        "@auth",
        "@internal",
      ] as DirectiveName[];

      const result = uniqueDirectiveNames(directives);
      expect(result).toHaveLength(3);
      expect(result).toContain("@auth");
      expect(result).toContain("@example");
      expect(result).toContain("@internal");
    });

    it("should preserve order of first occurrence", () => {
      const directives = ["@z", "@a", "@z", "@a", "@m"] as DirectiveName[];

      const result = uniqueDirectiveNames(directives);
      expect(result).toEqual(["@z", "@a", "@m"]);
    });

    it("should handle empty array", () => {
      const result = uniqueDirectiveNames([]);
      expect(result).toEqual([]);
    });

    it("should handle array with single item", () => {
      const directives = ["@example"] as DirectiveName[];
      const result = uniqueDirectiveNames(directives);
      expect(result).toEqual(["@example"]);
    });

    it("should handle array with no duplicates", () => {
      const directives = ["@auth", "@example", "@internal"] as DirectiveName[];

      const result = uniqueDirectiveNames(directives);
      expect(result).toEqual(["@auth", "@example", "@internal"]);
    });

    it("should handle array with all duplicates", () => {
      const directives = ["@auth", "@auth", "@auth"] as DirectiveName[];
      const result = uniqueDirectiveNames(directives);
      expect(result).toEqual(["@auth"]);
    });
  });

  describe("combineDirectiveNames", () => {
    it("should combine and deduplicate directives from multiple sources", () => {
      const cli = ["@example", "@internal"] as DirectiveName[];
      const config = ["@auth", "@example"] as DirectiveName[];

      const result = combineDirectiveNames(cli, config);
      expect(result).toHaveLength(3);
      expect(result).toContain("@example");
      expect(result).toContain("@internal");
      expect(result).toContain("@auth");
    });

    it("should preserve order with combined operation", () => {
      const first = ["@z", "@a"] as DirectiveName[];
      const second = ["@z", "@b"] as DirectiveName[];

      const result = combineDirectiveNames(first, second);
      // Should maintain order from first occurrence
      expect(result[0]).toBe("@z");
      expect(result).toContain("@a");
      expect(result).toContain("@b");
    });

    it("should handle null and undefined values", () => {
      const cli = ["@example"] as DirectiveName[];
      const result = combineDirectiveNames(cli, null, undefined, [
        "@auth",
      ] as DirectiveName[]);
      expect(result).toEqual(["@example", "@auth"]);
    });

    it("should handle empty arrays in arguments", () => {
      const cli = ["@example"] as DirectiveName[];
      const result = combineDirectiveNames(
        cli,
        [] as DirectiveName[],
        ["@auth"] as DirectiveName[],
      );
      expect(result).toEqual(["@example", "@auth"]);
    });

    it("should return empty result for all null/empty inputs", () => {
      const result = combineDirectiveNames(null, undefined, []);
      expect(result).toEqual([]);
    });

    it("should eliminate all duplicates across all sources", () => {
      const source1 = ["@a", "@b"] as DirectiveName[];
      const source2 = ["@b", "@c"] as DirectiveName[];
      const source3 = ["@c", "@a"] as DirectiveName[];

      const result = combineDirectiveNames(source1, source2, source3);
      expect(result).toHaveLength(3);
      expect(new Set(result)).toEqual(new Set(["@a", "@b", "@c"]));
    });

    it("should be equivalent to combining normalize and unique operations", () => {
      const sources = [
        ["@a", "@b"],
        ["@b", "@c"],
      ] as [DirectiveName[], DirectiveName[]];

      const combined = combineDirectiveNames(...sources);
      const separate = uniqueDirectiveNames(
        normalizeDirectiveNames(...sources),
      );

      expect(combined).toEqual(separate);
    });
  });
});
