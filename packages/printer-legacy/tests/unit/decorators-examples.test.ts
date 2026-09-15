import { buildSchema } from "graphql/utilities";
import type { GraphQLObjectType } from "graphql/type";

import type { Decorators, PrintTypeOptions } from "@graphql-markdown/types";
import {
  and,
  directiveOccurrence,
  directiveOccurrences,
  getDirectiveFromSchema,
  getNamedType,
  getTypeDirectiveValuesList,
  hasDirectiveNamed,
  isEntity,
  isOperation,
  isScalarType,
} from "@graphql-markdown/graphql";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import { printDecorator, printSlotDecorators } from "../../src/decorator";
import { Printer } from "../../src/printer";

// Every code sample in docs/advanced/decorators.md is reproduced here
// verbatim (module-level `require`s become the imports above) and checked
// against its documented output, so the doc can't silently drift from the
// actual decorators pipeline.
describe("docs/advanced/decorators.md examples", () => {
  describe("Usage", () => {
    const schema = buildSchema(`
      directive @httpResponse(
        code: Int!
        description: String
      ) repeatable on FIELD_DEFINITION

      type User {
        id: ID!
      }

      type Query {
        user(id: ID!): User
          @httpResponse(code: 200, description: "OK")
          @httpResponse(code: 404, description: "User not found")
      }
    `);

    const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
    const userField = schema.getQueryType()!.getFields().user;

    test("step 2's decorator renders step 3's table", () => {
      expect.assertions(1);

      const responses = {
        id: "responses",
        predicate: hasDirectiveNamed("httpResponse"),
        title: "Responses",
        position: { after: "metadata" as const },
        resolve: (type: unknown, printOptions: PrintTypeOptions) => {
          const directive = getDirectiveFromSchema(
            "httpResponse",
            printOptions,
          );
          return directive ? getTypeDirectiveValuesList(directive, type) : [];
        },
        render: (values: Record<string, unknown>[]): string => {
          return [
            "| Code | Description |",
            "| ---- | ----------- |",
            ...values.map((value) => {
              return `| \`${value.code as number}\` | ${(value.description as string | undefined) ?? ""} |`;
            }),
          ].join("\n");
        },
      };

      expect(printDecorator(userField, responses, options)?.content).toBe(
        [
          "| Code | Description |",
          "| ---- | ----------- |",
          "| `200` | OK |",
          "| `404` | User not found |",
        ].join("\n") + "\n\n",
      );
    });
  });

  describe("Predicate", () => {
    const schema = buildSchema(`
      directive @httpResponse(code: Int!, description: String) repeatable on FIELD_DEFINITION

      type Query {
        user: String @httpResponse(code: 200, description: "OK")
      }

      type User {
        id: String @httpResponse(code: 200, description: "OK")
      }
    `);

    const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
    const queryField = schema.getQueryType()!.getFields().user;
    const objectField = (
      schema.getType("User") as GraphQLObjectType
    ).getFields().id;

    const responses = {
      id: "responses",
      predicate: and(
        hasDirectiveNamed("httpResponse"),
        isEntity("queries", "mutations"),
      ),
      title: "Responses",
      render: (values: Record<string, unknown>[]): string => {
        return values
          .map((v) => {
            return `- \`${v.code}\` ${v.description}`;
          })
          .join("\n");
      },
    };

    test("renders for a node whose entity kind matches (queries)", () => {
      expect.assertions(1);

      expect(
        printDecorator(queryField, responses, {
          ...options,
          entity: "queries",
        }),
      ).toBeDefined();
    });

    test("is skipped for a node whose entity kind does not match, even with the directive present", () => {
      expect.assertions(1);

      expect(
        printDecorator(objectField, responses, {
          ...options,
          entity: "objects",
        }),
      ).toBeUndefined();
    });
  });

  describe("Resolve", () => {
    test("a decorator with neither predicate nor resolve is a no-op", () => {
      expect.assertions(1);

      const schema = buildSchema(`type Query { id: String }`);
      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;

      expect(
        printDecorator(
          schema.getType("Query")!,
          {
            id: "noop",
            render: () => {
              return "content";
            },
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("directiveOccurrences/directiveOccurrence match their hand-written equivalents", () => {
      expect.assertions(2);

      const schema = buildSchema(`
        directive @httpResponse(
          code: Int!
          description: String
        ) repeatable on FIELD_DEFINITION

        directive @meta(type: String!) on FIELD_DEFINITION

        type Query {
          user: String
            @httpResponse(code: 200, description: "OK")
            @httpResponse(code: 404, description: "User not found")
          post: String @meta(type: "Post")
        }
      `);

      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
      const queryFields = schema.getQueryType()!.getFields();

      const handWritten = (type: unknown, printOptions: PrintTypeOptions) => {
        const directive = getDirectiveFromSchema("httpResponse", printOptions);
        return directive ? getTypeDirectiveValuesList(directive, type) : [];
      };

      expect(
        directiveOccurrences("httpResponse")(queryFields.user, options),
      ).toStrictEqual(handWritten(queryFields.user, options));
      expect(
        directiveOccurrence("meta")(queryFields.post, options),
      ).toStrictEqual([{ type: "Post" }]);
    });
  });

  describe("Examples", () => {
    describe("Response headers", () => {
      const schema = buildSchema(`
        directive @httpHeader(
          name: String!
          required: Boolean = false
        ) repeatable on FIELD_DEFINITION

        type Query {
          user: String
            @httpHeader(name: "X-Request-Id")
            @httpHeader(name: "X-Auth-Token", required: true)
        }
      `);

      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
      const field = schema.getQueryType()!.getFields().user;

      test("renders the required/optional header list", () => {
        expect.assertions(1);

        const httpHeader = {
          id: "httpHeader",
          predicate: hasDirectiveNamed("httpHeader"),
          title: "Headers",
          position: { after: "metadata" as const },
          resolve: directiveOccurrences("httpHeader"),
          render: (values: Record<string, unknown>[]): string => {
            return values
              .map((value) => {
                return `- \`${value.name}\`${value.required ? " *(required)*" : ""}`;
              })
              .join("\n");
          },
        };

        expect(printDecorator(field, httpHeader, options)?.content).toBe(
          "- `X-Request-Id`\n- `X-Auth-Token` *(required)*\n\n",
        );
      });
    });

    describe("A badge from a directive with no arguments", () => {
      const schema = buildSchema(`
        directive @beta on OBJECT | FIELD_DEFINITION

        type Query {
          user: String @beta
        }
      `);

      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
      const field = schema.getQueryType()!.getFields().user;

      test("renders the BETA badge once, with no resolve needed", () => {
        expect.assertions(2);

        const beta = {
          id: "beta",
          predicate: hasDirectiveNamed("beta"),
          position: { into: "tags" as const },
          render: (
            _values: Record<string, unknown>[],
            printOptions: PrintTypeOptions,
          ) => {
            return printOptions.formatMDXBadge!({
              text: "BETA",
              classname: "badge--danger",
            });
          },
        };

        expect(
          printSlotDecorators("tags", field, {
            ...options,
            decorators: { beta } as Decorators,
          }),
        ).toStrictEqual(['<mark class="gqlmd-mdx-badge">BETA</mark>']);
        // Sanity-check `printDecorator` too, since the doc shows the
        // decorator declaration itself, not the slot-collection call.
        expect(printDecorator(field, beta, options)?.content).toBe(
          '<mark class="gqlmd-mdx-badge">BETA</mark>\n\n',
        );
      });
    });

    describe("Meta object", () => {
      const schema = buildSchema(`
        directive @meta(type: String!) on FIELD_DEFINITION

        type ResponseMeta {
          requestId: ID!
        }

        type Query {
          user: String @meta(type: "ResponseMeta")
        }
      `);

      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
      const field = schema.getQueryType()!.getFields().user;

      test("renders a link built from the directive's own type argument", () => {
        expect.assertions(1);

        const meta = {
          id: "meta",
          predicate: hasDirectiveNamed("meta"),
          title: "Meta",
          position: { after: "code" as const },
          resolve: directiveOccurrence("meta"),
          render: (
            [value]: Record<string, unknown>[],
            printOptions: PrintTypeOptions,
          ): string => {
            const slug = String(value!.type).toLowerCase();
            return `Returned alongside the data: [\`${value!.type}\`](${printOptions.basePath}/objects/${slug}).`;
          },
        };

        expect(printDecorator(field, meta, options)?.content).toBe(
          `Returned alongside the data: [\`ResponseMeta\`](${options.basePath}/objects/responsemeta).\n\n`,
        );
      });
    });

    describe("Response type for operations", () => {
      const schema = buildSchema(`
        type User {
          id: ID!
          name: String!
        }

        type Query {
          user(id: ID!): User
          ping: String
        }
      `);

      const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
      const queryFields = schema.getQueryType()!.getFields();
      const userType = schema.getType("User")!;

      const responseType = {
        id: "responseType",
        predicate: isOperation,
        title: "Response Type",
        position: { after: "code" as const },
        resolve: (type: unknown, printOptions: PrintTypeOptions) => {
          const returnType = getNamedType((type as { type: unknown }).type);
          if (isScalarType(returnType)) {
            return [];
          }
          return [{ code: Printer.printCode(returnType, printOptions) }];
        },
        render: ([value]: Record<string, unknown>[]): string => {
          return value!.code as string;
        },
      };

      test("appends the return type's SDL, with no directive involved", () => {
        expect.assertions(2);

        expect(isOperation(queryFields.user)).toBe(true);
        expect(
          printDecorator(queryFields.user, responseType, options)?.content,
        ).toBe(`${Printer.printCode(userType, options)}\n\n`);
      });

      test("is skipped for an operation returning a scalar", () => {
        expect.assertions(1);

        expect(
          printDecorator(queryFields.ping, responseType, options),
        ).toBeUndefined();
      });
    });
  });

  describe("Migrating from customDirective", () => {
    const schema = buildSchema(`
      directive @auth(requires: String = "ADMIN") on OBJECT | FIELD_DEFINITION

      type User @auth {
        id: ID!
      }
    `);

    const options = { ...DEFAULT_OPTIONS, schema } as PrintTypeOptions;
    const type = schema.getType("User")!;

    // Stand-ins matching `directiveDescriptor`/`directiveTag`'s exact
    // `(directive, type, template?)`/`(directive, type)` signature, and
    // `withDirective`'s exact `(name, render)` signature — those helpers'
    // own behavior is covered in packages/helpers/tests/unit/directives;
    // what this test verifies is the *wiring* the migration guide
    // describes: a `predicate` gate plus a directive-definition lookup
    // inside `render`, with no `resolve`.
    const directiveDescriptor = (
      directive: { description?: string | null },
      _node: unknown,
      template: string,
    ): string => {
      return template.replace("${requires}", "ADMIN");
    };
    const directiveTag = (directive: { name: string }) => {
      return {
        text: `@${directive.name}`,
      };
    };
    const withDirective = (
      name: string,
      render: (
        directive: NonNullable<ReturnType<typeof getDirectiveFromSchema>>,
        options: PrintTypeOptions,
        context: { type: unknown },
      ) => string | undefined,
    ) => {
      return (
        _values: Record<string, unknown>[],
        printOptions: PrintTypeOptions,
        context: { type: unknown },
      ): string | undefined => {
        const directive = getDirectiveFromSchema(name, printOptions);
        return directive ? render(directive, printOptions, context) : undefined;
      };
    };

    test("authDescription renders via withDirective, no resolve", () => {
      expect.assertions(1);

      const authDescription = {
        id: "authDescription",
        predicate: hasDirectiveNamed("auth"),
        position: { into: "description" as const },
        render: withDirective("auth", (directive, _options, { type: node }) => {
          return directiveDescriptor(
            directive,
            node,
            "Requires the `${requires}` role.",
          );
        }),
      };

      expect(
        printSlotDecorators("description", type, {
          ...options,
          decorators: { authDescription } as Decorators,
        }),
      ).toStrictEqual(["Requires the `ADMIN` role."]);
    });

    test("authTag renders via the same pattern, formatted as a badge", () => {
      expect.assertions(1);

      const authTag = {
        id: "authTag",
        predicate: hasDirectiveNamed("auth"),
        position: { into: "tags" as const },
        render: withDirective("auth", (directive, renderOptions) => {
          return renderOptions.formatMDXBadge!(directiveTag(directive));
        }),
      };

      expect(
        printSlotDecorators("tags", type, {
          ...options,
          decorators: { authTag } as Decorators,
        }),
      ).toStrictEqual(['<mark class="gqlmd-mdx-badge">@auth</mark>']);
    });

    test("a decorator lacking the directive renders nothing, unaffected by always() elsewhere", () => {
      expect.assertions(1);

      // Confirms `predicate: hasDirectiveNamed(...)` — not `always()` — is
      // what's actually gating these two decorators.
      const otherType = schema.getType("__Type"); // introspection type, no @auth
      if (!otherType) {
        throw new Error("expected __Type to exist on the built schema");
      }

      const authDescription = {
        id: "authDescription",
        predicate: hasDirectiveNamed("auth"),
        position: { into: "description" as const },
        render: (): string => {
          throw new Error("render must not run: predicate should skip first");
        },
      };

      expect(
        printSlotDecorators("description", otherType, {
          ...options,
          decorators: { authDescription } as Decorators,
        }),
      ).toStrictEqual([]);
    });
  });
});
