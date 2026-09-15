import { buildSchema } from "graphql/utilities";

import type { Decorators, PrintTypeOptions } from "@graphql-markdown/types";
import {
  always,
  getDirectiveFromSchema,
  getTypeDirectiveValuesList,
  hasDirectiveNamed,
} from "@graphql-markdown/graphql";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import { Printer } from "../../src/printer";

import type { ResolvedDecorator } from "../../src/decorator";

import {
  getDecoratorsOrder,
  getExampleSectionDefinition,
  getSchemaEntity,
  printDecorator,
  printDecorators,
} from "../../src/decorator";

describe("decorator", () => {
  const schema = buildSchema(`
    directive @httpResponse(
      code: Int!
      description: String
    ) repeatable on OBJECT | FIELD_DEFINITION

    directive @meta(type: String!) on OBJECT

    type ResponseMeta {
      requestId: ID!
    }

    type Test
      @httpResponse(code: 200, description: "OK")
      @httpResponse(code: 404, description: "Not found")
      @meta(type: "ResponseMeta") {
      id: ID!
    }

    type Other {
      id: ID!
    }
  `);

  const type = schema.getType("Test")!;

  const options = {
    ...DEFAULT_OPTIONS,
    schema,
  } as PrintTypeOptions;

  // A directive-driven decorator now selects its nodes and reads its
  // directive's argument values explicitly, via the same public helpers a
  // config author would use — there is no framework-provided `directive`
  // option to do this for you.
  const httpResponses: ResolvedDecorator = {
    id: "httpResponse",
    predicate: hasDirectiveNamed("httpResponse"),
    title: "Responses",
    resolve: (resolvedType, resolvedOptions) => {
      const directive = getDirectiveFromSchema("httpResponse", resolvedOptions);
      return directive
        ? getTypeDirectiveValuesList(directive, resolvedType)
        : [];
    },
    render: (values) => {
      return values
        .map((value) => {
          return `- \`${value.code as number}\` ${value.description as string}`;
        })
        .join("\n");
    },
  };

  describe("getSchemaEntity()", () => {
    test("prefers the entity kind set by the caller", () => {
      expect.assertions(1);

      expect(getSchemaEntity(type, { ...options, entity: "mutations" })).toBe(
        "mutations",
      );
    });

    test("derives the entity kind from the type", () => {
      expect.assertions(1);

      expect(getSchemaEntity(type, options)).toBe("objects");
    });

    test("returns undefined if the kind cannot be determined", () => {
      expect.assertions(1);

      expect(getSchemaEntity({ name: "NotAType" }, options)).toBeUndefined();
    });
  });

  describe("getExampleSectionDefinition()", () => {
    const exampleSchema = buildSchema(`
      directive @example(value: String) on OBJECT | FIELD_DEFINITION

      type Sample @example(value: "42") {
        id: ID!
      }

      type NoSample {
        id: ID! @example(value: "7")
      }
    `);

    const exampleOptions = {
      ...DEFAULT_OPTIONS,
      schema: exampleSchema,
    } as PrintTypeOptions;

    test("renders the example as a code block section", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          exampleSchema.getType("Sample")!,
          getExampleSectionDefinition(),
          exampleOptions,
        ),
      ).toMatchInlineSnapshot(`
        {
          "content": "
        \`\`\`graphql
        42
        \`\`\`


        ",
          "level": 3,
          "title": "Example",
        }
      `);
    });

    test("returns undefined if the schema declares no example directive", () => {
      expect.assertions(1);

      expect(
        printDecorator(type, getExampleSectionDefinition(), options),
      ).toBeUndefined();
    });

    test("derives an example from the fields of a type carrying none", () => {
      expect.assertions(1);

      // `NoSample` has no example directive of its own: `printExample` walks its
      // fields instead, which is why the example section resolves its own values
      // rather than reading directive occurrences.
      expect(
        printDecorator(
          exampleSchema.getType("NoSample")!,
          getExampleSectionDefinition(),
          exampleOptions,
        ),
      ).toBeDefined();
    });
  });

  describe("Printer.printType()", () => {
    test("renders the decorator on the type page, at its position", async () => {
      expect.assertions(1);

      await Printer.init(schema, "schema", "/", {
        decorators: {
          httpResponse: {
            title: httpResponses.title,
            predicate: httpResponses.predicate,
            resolve: httpResponses.resolve,
            render: httpResponses.render,
            position: { after: "code" },
          },
        },
      });

      const page = await Printer.printType("test", type, {
        schema,
        frontMatter: false,
      });

      expect(page).toMatchInlineSnapshot(`
        "# Test





        No description


        \`\`\`graphql
        type Test {
          id: ID!
        }
        \`\`\`


        ### Responses

        - \`200\` OK
        - \`404\` Not found



        ### Fields

        #### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">Test</code>.<code class="gqlmd-mdx-entity-name">id</code></span>](#id)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">ID!</code></span>](/schema/types/scalars/id) <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark> {#id}"
      `);
    });
  });

  describe("decorators", () => {
    test("returns undefined when render is not a function, bypassing config validation", () => {
      expect.assertions(1);

      // `printDecorator` is directly callable, bypassing the config-time
      // validation that `getDecoratorsOption` otherwise enforces (see this
      // file's own reserved-id tests, which rely on the same bypass) — so a
      // malformed `render` must still be handled gracefully here rather than
      // throwing.
      expect(
        printDecorator(
          type,
          {
            id: "responses",
            predicate: hasDirectiveNamed("httpResponse"),
            render: {} as never,
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("a decorator's id is independent of what its predicate/resolve target", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "responses",
            predicate: httpResponses.predicate,
            resolve: httpResponses.resolve,
            render: httpResponses.render,
          },
          options,
        ),
      ).toMatchObject({
        content: expect.stringContaining("200"),
      });
    });

    test("uses the declared level and no title when untitled", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          { ...httpResponses, title: undefined, level: 4 },
          options,
        ),
      ).toMatchObject({ level: 4, title: undefined });
    });

    test("preserves the Markdown returned by the render callback", () => {
      expect.assertions(1);

      // Leading whitespace is significant in Markdown: an indented code block
      // stops being one if the section builder trims it.
      expect(
        printDecorator(
          type,
          {
            ...httpResponses,
            render: () => {
              return "    indented code block";
            },
          },
          options,
        ),
      ).toMatchObject({ content: expect.stringMatching(/^ {4}indented/) });
    });

    test("returns undefined if the render callback returns no content", () => {
      expect.assertions(2);

      expect(
        printDecorator(
          type,
          {
            ...httpResponses,
            render: () => {
              return "   ";
            },
          },
          options,
        ),
      ).toBeUndefined();
      expect(
        printDecorator(
          type,
          {
            ...httpResponses,
            render: () => {
              return undefined;
            },
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("returns undefined if the schema is not set and resolve's own directive lookup fails", () => {
      expect.assertions(1);

      // `hasDirectiveNamed` reads the AST directly, so the predicate still
      // matches without a schema — but `httpResponses.resolve` looks the
      // directive definition up via `getDirectiveFromSchema`, which needs
      // one, and returns `[]` without it. With `resolve` explicitly set,
      // an empty result is never substituted (see the marker-decorator
      // tests below), so the decorator is skipped.
      expect(
        printDecorator(type, httpResponses, {
          ...options,
          schema: undefined,
        }),
      ).toBeUndefined();
    });

    test("a predicate returning false skips the decorator even when the directive is present", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "httpResponse",
            render: httpResponses.render,
            predicate: () => {
              return false;
            },
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("skips a decorator whose resolve returns a non-array value", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "custom",
            predicate: () => {
              return true;
            },
            resolve: () => {
              return undefined;
            },
            render: httpResponses.render,
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("a custom resolve produces values with no directive involved", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "custom",
            resolve: () => {
              return [{ value: 42 }];
            },
            render: (values) => {
              return `value: ${values[0]!.value as number}`;
            },
          },
          options,
        ),
      ).toMatchObject({ content: expect.stringContaining("value: 42") });
    });

    test("a predicate-only decorator with no resolve renders once with an empty record", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "marker",
            predicate: () => {
              return true;
            },
            render: (values) => {
              return `count: ${values.length}`;
            },
          },
          options,
        ),
      ).toMatchObject({ content: expect.stringContaining("count: 1") });
    });

    test("a decorator with an explicit predicate AND a custom resolve returning [] renders nothing, unlike the marker case", () => {
      expect.assertions(1);

      // Unlike the predicate-only marker decorator above, a custom `resolve`
      // returning an empty array is never ambiguous with "no arguments to
      // carry" — it means "nothing to render this time" and must be skipped,
      // not substituted with a synthetic `[{}]` record.
      expect(
        printDecorator(
          type,
          {
            id: "rows",
            predicate: () => {
              return true;
            },
            resolve: () => {
              return [];
            },
            render: (values) => {
              return values
                .map((v) => {
                  return `- ${v.code as number}`;
                })
                .join("\n");
            },
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("a decorator with neither predicate nor resolve renders nothing, for any node", () => {
      expect.assertions(1);

      // `predicate` defaults to matching every node, but `resolve` defaults
      // to producing nothing — and with no explicit `predicate` either, an
      // empty result is not substituted (that is the marker-decorator case,
      // which requires an explicit `predicate`). So a decorator declaring
      // neither is a no-op by construction, regardless of what `id` names.
      expect(
        printDecorator(
          type,
          { id: "noop", render: httpResponses.render },
          options,
        ),
      ).toBeUndefined();
    });

    test("render receives id, type, and entity in its context", () => {
      expect.assertions(3);

      let seen:
        | {
            id: string;
            type: unknown;
            entity: unknown;
          }
        | undefined;

      printDecorator(
        type,
        {
          id: "httpResponse",
          predicate: always(),
          render: (_values, _options, context) => {
            seen = { ...context };
            return "rendered";
          },
        },
        options,
      );

      expect(seen?.id).toBe("httpResponse");
      expect(seen?.type).toBe(type);
      expect(seen?.entity).toBe("objects");
    });

    describe("printDecorators()", () => {
      const declaration = { title: "Responses", render: httpResponses.render };

      test("returns an entry per declared decorator, including empty ones", () => {
        expect.assertions(2);

        const sections = printDecorators(type, {
          ...options,
          decorators: {
            httpResponse: declaration,
            unknown: declaration,
          } as Decorators,
        });

        expect(Object.keys(sections)).toStrictEqual([
          "httpResponse",
          "unknown",
        ]);
        expect(sections["unknown"]).toBeUndefined();
      });

      test("keeps a decorator named __proto__ as an own entry", () => {
        expect.assertions(2);

        // An object literal never makes `__proto__` an own property, so the id
        // only reaches the printer when defined explicitly, bypassing the
        // configuration validation.
        const decorators = Object.defineProperty({}, "__proto__", {
          value: declaration,
          enumerable: true,
        }) as Decorators;

        const sections = printDecorators(type, {
          ...options,
          decorators,
        });

        expect(Object.hasOwn(sections, "__proto__")).toBe(true);
        expect({ ...sections }["__proto__"]).toBeUndefined();
      });

      test("drops decorators claiming a reserved id", () => {
        expect.assertions(1);

        const sections = printDecorators(type, {
          ...options,
          decorators: { code: declaration } as Decorators,
        });

        expect(Object.keys(sections)).toStrictEqual([]);
      });

      test("returns an empty map if no decorator is declared", () => {
        expect.assertions(2);

        expect(Object.keys(printDecorators(type, options))).toStrictEqual([]);
        expect(
          Object.keys(
            printDecorators(type, {
              ...options,
              decorators: {} as Decorators,
            }),
          ),
        ).toStrictEqual([]);
      });

      test("excludes a decorator targeting a named slot (`into`) from the page sections map", () => {
        expect.assertions(1);

        const sections = printDecorators(type, {
          ...options,
          decorators: {
            badge: {
              render: () => {
                return "badge";
              },
              position: { into: "metadata" },
            },
          } as Decorators,
        });

        expect(Object.keys(sections)).toStrictEqual([]);
      });
    });

    describe("getDecoratorsOrder()", () => {
      const order = ["description", "code", "metadata", "relations"];
      const declaration = { title: "Responses", render: httpResponses.render };

      test("appends a decorator without position", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: { httpResponse: declaration } as Decorators,
          }),
        ).toStrictEqual([...order, "httpResponse"]);
      });

      test("inserts a decorator after the named one", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {
              httpResponse: { ...declaration, position: { after: "metadata" } },
            } as Decorators,
          }),
        ).toStrictEqual([
          "description",
          "code",
          "metadata",
          "httpResponse",
          "relations",
        ]);
      });

      test("inserts a decorator before the named one", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {
              httpResponse: {
                ...declaration,
                position: { before: "metadata" },
              },
            } as Decorators,
          }),
        ).toStrictEqual([
          "description",
          "code",
          "httpResponse",
          "metadata",
          "relations",
        ]);
      });

      test("appends a decorator whose position names an unknown section", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {
              httpResponse: { ...declaration, position: { after: "nope" } },
            } as Decorators,
          }),
        ).toStrictEqual([...order, "httpResponse"]);
      });

      test("places decorators in declaration order, so one can target another", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {
              httpResponse: { ...declaration, position: { after: "code" } },
              httpHeader: {
                ...declaration,
                position: { after: "httpResponse" },
              },
            } as Decorators,
          }),
        ).toStrictEqual([
          "description",
          "code",
          "httpResponse",
          "httpHeader",
          "metadata",
          "relations",
        ]);
      });

      test("returns the order unchanged if no decorator is declared", () => {
        expect.assertions(2);

        expect(getDecoratorsOrder(order, options)).toStrictEqual(order);
        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {} as Decorators,
          }),
        ).toStrictEqual(order);
      });

      test("excludes a decorator targeting a named slot (`into`) from the section order", () => {
        expect.assertions(1);

        expect(
          getDecoratorsOrder(order, {
            ...options,
            decorators: {
              badge: {
                render: () => {
                  return "badge";
                },
                position: { into: "metadata" },
              },
            } as Decorators,
          }),
        ).toStrictEqual(order);
      });
    });
  });
});
