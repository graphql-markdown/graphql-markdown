/**
 * Covers the metadata-line and description slots that decorators can target
 * (T4 of the decorators plan). Kept in a file of its own: `section.test.ts`
 * pins its output with `toMatchInlineSnapshot`, and its "with description"
 * case is sensitive to the total test count in that file for reasons
 * unrelated to decorators (reproducible on the untouched baseline with two
 * added no-op tests) — so this behaviour is exercised here instead, without
 * perturbing that file.
 */
import { GraphQLObjectType } from "graphql/type";

import { printSectionItem } from "../../src/section";
import { DEFAULT_OPTIONS } from "../../src/const/options";

describe("printSectionItem() decorators", () => {
  test("splices a decorator targeting the metadata slot into the heading line", () => {
    expect.hasAssertions();

    const type = new GraphQLObjectType({
      name: "MetadataSlotDecoratedType",
      description: "Lorem ipsum",
      fields: {},
    });

    const section = printSectionItem(type, {
      ...DEFAULT_OPTIONS,
      decorators: {
        marker: {
          predicate: () => {
            return true;
          },
          position: { into: "metadata" },
          render: () => {
            return "MARKER";
          },
        },
      },
    });

    expect(section).toContain(
      '<mark class="gqlmd-mdx-badge">object</mark> MARKER',
    );
  });

  test("splices a decorator targeting the badges slot next to the built-in badges", () => {
    expect.hasAssertions();

    const type = new GraphQLObjectType({
      name: "BadgesSlotDecoratedType",
      description: "Lorem ipsum",
      fields: {},
    });

    const section = printSectionItem(type, {
      ...DEFAULT_OPTIONS,
      decorators: {
        marker: {
          predicate: () => {
            return true;
          },
          position: { into: "badges" },
          render: () => {
            return "EXTRA_BADGE";
          },
        },
      },
    });

    expect(section).toContain(
      '<mark class="gqlmd-mdx-badge">object</mark> EXTRA_BADGE',
    );
  });

  test("appends a decorator targeting the description slot after the description", () => {
    expect.hasAssertions();

    const type = new GraphQLObjectType({
      name: "DescriptionSlotDecoratedType",
      description: "Lorem ipsum",
      fields: {},
    });

    const section = printSectionItem(type, {
      ...DEFAULT_OPTIONS,
      decorators: {
        marker: {
          predicate: () => {
            return true;
          },
          position: { into: "description" },
          render: () => {
            return "DECORATED";
          },
        },
      },
    });

    expect(section).toContain("Lorem ipsum");
    expect(section).toContain("DECORATED");
    expect(section.indexOf("DECORATED")).toBeGreaterThan(
      section.indexOf("Lorem ipsum"),
    );
  });

  test("is unaffected by an unrelated decorator (no matching predicate)", () => {
    expect.hasAssertions();

    const type = new GraphQLObjectType({
      name: "UnaffectedType",
      description: "Lorem ipsum",
      fields: {},
    });

    const withoutDecorators = printSectionItem(type, DEFAULT_OPTIONS);
    const withNonMatchingDecorator = printSectionItem(type, {
      ...DEFAULT_OPTIONS,
      decorators: {
        marker: {
          predicate: () => {
            return false;
          },
          position: { into: "metadata" },
          render: () => {
            return "SHOULD_NOT_APPEAR";
          },
        },
      },
    });

    expect(withNonMatchingDecorator).toBe(withoutDecorators);
    expect(withNonMatchingDecorator).not.toContain("SHOULD_NOT_APPEAR");
  });
});
