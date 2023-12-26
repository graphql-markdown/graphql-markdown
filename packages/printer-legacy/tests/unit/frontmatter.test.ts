import { formatFrontMatterProp } from "../../src/frontmatter";

describe("frontMatter", () => {
  describe("formatFrontMatterProp", () => {
    test("returns empty structure if undefined", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp(undefined)).toStrictEqual([]);
    });

    test("returns flat structure for simple object", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: "test" })).toStrictEqual([
        "item: test",
      ]);
    });

    test("returns null for null object", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: null })).toStrictEqual([
        "item: null",
      ]);
    });

    test("returns indented structure for nested object", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: { foo: "test" } })).toStrictEqual([
        "item:",
        "  foo: test",
      ]);
    });

    test("returns indented structure for deep nested object", () => {
      expect.hasAssertions();

      expect(
        formatFrontMatterProp({ level1: { level2: { level3: "value" } } }),
      ).toStrictEqual(["level1:", "  level2:", "    level3: value"]);
    });

    test("returns indented list for array", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: ["a", "b", "c"] })).toStrictEqual([
        "item:",
        "  - a",
        "  - b",
        "  - c",
      ]);
    });

    test("returns indented structure for object with array", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: { bar: ["value"] } })).toStrictEqual(
        ["item:", "  bar:", "    - value"],
      );
    });

    test("returns indented structure for array with object", () => {
      expect.hasAssertions();

      expect(formatFrontMatterProp({ item: [{ foo: "test" }] })).toStrictEqual([
        "item:",
        "  - foo: test",
      ]);
    });

    test("returns indented structure for complex object", () => {
      expect.hasAssertions();

      expect(
        formatFrontMatterProp({
          item: [
            {
              foo: "test",
              bar: ["a", "b", "c"],
              baz: { foo: "baz", zap: ["a", "b", "c"] },
            },
          ],
        }),
      ).toStrictEqual([
        "item:",
        "  - foo: test",
        "    bar:",
        "    - a",
        "    - b",
        "    - c",
        "    baz:",
        "      foo: baz",
        "      zap:",
        "      - a",
        "      - b",
        "      - c",
      ]);
    });
  });
});
