const { directiveDescriptor, directiveTag } = require("../../src/helper");

jest.mock("graphql");
const graphql = require("graphql");

describe("helper", () => {
  describe("directiveDescriptor", () => {
    test("returns a templated description of a directive", () => {
      expect.hasAssertions();

      graphql.getDirectiveValues.mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor(
          {},
          { description: "Directive description" },
          "Directive value is ${value}",
        ),
      ).toBe("Directive value is 42");
    });

    test("returns default directive description is no template set", () => {
      expect.hasAssertions();

      graphql.getDirectiveValues.mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor({ description: "Directive description" }, {}),
      ).toBe("Directive description");
    });

    test("returns empty string if default directive description", () => {
      expect.hasAssertions();

      graphql.getDirectiveValues.mockReturnValue({ value: 42 });

      expect(directiveDescriptor({}, {})).toBe("");
    });
  });
  describe("directiveTag", () => {
    test("returns a tag object for the directive with custom classname", () => {
      expect.hasAssertions();

      expect(directiveTag({ name: "dummy" }, {}, "warning")).toStrictEqual({
        text: "@dummy",
        classname: "warning",
      });
    });

    test("returns a tag object for the directive with default classname", () => {
      expect.hasAssertions();

      expect(directiveTag({ name: "dummy" }, {})).toStrictEqual({
        text: "@dummy",
        classname: "badge badge--secondary",
      });
    });
  });
});
