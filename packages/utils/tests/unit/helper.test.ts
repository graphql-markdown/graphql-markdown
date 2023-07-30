jest.mock("graphql", () => {
  const graphql = jest.requireActual("graphql");
  return {
    ...graphql,
    getDirectiveValues: jest.fn((...args) =>
      graphql.getDirectiveValues(...args),
    ),
  };
});
import graphql from "graphql";
import type { GraphQLDirective, GraphQLNamedType } from "graphql";

import { directiveDescriptor, directiveTag } from "../../src/helper";

describe("helper", () => {
  describe("directiveDescriptor", () => {
    test("returns a templated description of a directive", () => {
      expect.hasAssertions();

      jest.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor(
          {} as unknown as GraphQLDirective,
          { description: "Directive description" } as unknown as GraphQLNamedType,
          "Directive value is ${value}",
        ),
      ).toBe("Directive value is 42");
    });

    test("returns default directive description is no template set", () => {
      expect.hasAssertions();

      jest.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor({ description: "Directive description" } as unknown as GraphQLDirective, {} as unknown as GraphQLNamedType),
      ).toBe("Directive description");
    });

    test("returns empty string if default directive description", () => {
      expect.hasAssertions();

      jest.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(directiveDescriptor({} as unknown as GraphQLDirective, {} as unknown as GraphQLNamedType)).toBe("");
    });
  });
  describe("directiveTag", () => {
    test("returns a tag object for the directive with custom classname", () => {
      expect.hasAssertions();

      expect(directiveTag({ name: "dummy" } as unknown as GraphQLDirective, {} as unknown as GraphQLNamedType, "warning")).toStrictEqual({
        text: "@dummy",
        classname: "warning",
      });
    });

    test("returns a tag object for the directive with default classname", () => {
      expect.hasAssertions();

      expect(directiveTag({ name: "dummy" } as unknown as GraphQLDirective, {} as unknown as GraphQLNamedType)).toStrictEqual({
        text: "@dummy",
        classname: "badge--secondary",
      });
    });
  });
});
