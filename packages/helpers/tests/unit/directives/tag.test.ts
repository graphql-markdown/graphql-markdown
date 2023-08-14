import type { GraphQLDirective, GraphQLNamedType } from "graphql";

import { directiveTag } from "../../../src";

describe("directives", () => {
  describe("directiveTag", () => {
    test("returns a tag object for the directive with custom classname", () => {
      expect.hasAssertions();

      expect(
        directiveTag(
          { name: "dummy" } as unknown as GraphQLDirective,
          {} as unknown as GraphQLNamedType,
          "warning",
        ),
      ).toStrictEqual({
        text: "@dummy",
        classname: "warning",
      });
    });

    test("returns a tag object for the directive with default classname", () => {
      expect.hasAssertions();

      expect(
        directiveTag(
          { name: "dummy" } as unknown as GraphQLDirective,
          {} as unknown as GraphQLNamedType,
        ),
      ).toStrictEqual({
        text: "@dummy",
        classname: "badge--secondary",
      });
    });
  });
});
