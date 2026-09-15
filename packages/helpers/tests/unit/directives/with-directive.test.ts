import { buildSchema } from "graphql/utilities";

import type { PrintTypeOptions } from "@graphql-markdown/types";

import { withDirective } from "../../../src";

const schema = buildSchema(`
  directive @auth(requires: String = "ADMIN") on OBJECT

  type WithAuth @auth {
    id: ID!
  }

  type WithoutAuth {
    id: ID!
  }
`);

const options = { basePath: "/", schema } as PrintTypeOptions;
const withAuth = schema.getType("WithAuth")!;
const context = { id: "authDescription", type: withAuth };

describe("directives", () => {
  describe("withDirective", () => {
    test("calls render with the resolved directive when present in the schema", () => {
      expect.assertions(2);

      const render = vi.fn((directive, renderOptions, renderContext) => {
        return `${directive.name}/${renderOptions.basePath}/${renderContext.id}`;
      });

      const content = withDirective("auth", render)([], options, context);

      expect(render).toHaveBeenCalledWith(
        schema.getDirective("auth"),
        options,
        context,
      );
      expect(content).toBe("auth///authDescription");
    });

    test("skips render and returns undefined when the directive is absent from the schema", () => {
      expect.assertions(1);

      const render = vi.fn(() => {
        return "should not run";
      });

      expect(
        withDirective("doesNotExist", render)([], options, context),
      ).toBeUndefined();
    });
  });
});
