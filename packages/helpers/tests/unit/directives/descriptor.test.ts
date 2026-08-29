import type * as GraphQLExecution from "graphql/execution";

vi.mock("graphql/execution", async (importOriginal) => {
  const graphql = await importOriginal<typeof GraphQLExecution>();
  const mocked = {
    ...graphql,
    getDirectiveValues: vi.fn((...args) => {
      return graphql.getDirectiveValues(
        ...(args as Parameters<typeof graphql.getDirectiveValues>),
      );
    }),
  };
  return { ...mocked, default: mocked };
});
import graphql from "graphql/execution";
import type { GraphQLDirective, GraphQLNamedType } from "graphql/type";

import { directiveDescriptor } from "../../../src";

describe("directives", () => {
  describe("directiveDescriptor", () => {
    test("returns a templated description of a directive", () => {
      expect.hasAssertions();

      vi.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor(
          {} as unknown as GraphQLDirective,
          {
            description: "Directive description",
          } as unknown as GraphQLNamedType,
          "Directive value is ${value}",
        ),
      ).toBe("Directive value is 42");
    });

    test("returns default directive description is no template set", () => {
      expect.hasAssertions();

      vi.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor(
          {
            description: "Directive description",
          } as unknown as GraphQLDirective,
          {} as unknown as GraphQLNamedType,
        ),
      ).toBe("Directive description");
    });

    test("returns empty string if default directive description", () => {
      expect.hasAssertions();

      vi.spyOn(graphql, "getDirectiveValues").mockReturnValue({ value: 42 });

      expect(
        directiveDescriptor(
          {} as unknown as GraphQLDirective,
          {} as unknown as GraphQLNamedType,
        ),
      ).toBe("");
    });
  });
});
