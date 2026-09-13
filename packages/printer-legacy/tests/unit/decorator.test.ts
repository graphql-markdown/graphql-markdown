import { buildSchema } from "graphql/utilities";

import type {
  CustomSections,
  Decorators,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import { Printer } from "../../src/printer";

import type { SectionDefinition } from "../../src/decorator";

import {
  getCustomSectionsOrder,
  getDecoratorsOrder,
  getExampleSectionDefinition,
  getSchemaEntity,
  printCustomSection,
  printCustomSections,
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

  const httpResponses: SectionDefinition = {
    name: "httpResponse",
    directive: "httpResponse",
    title: "Responses",
    render: (values) => {
      return values
        .map((value) => {
          return `- \`${value.code as number}\` ${value.description as string}`;
        })
        .join("\n");
    },
  };

  describe("printCustomSection()", () => {
    test("renders every occurrence of a repeatable directive", () => {
      expect.assertions(1);

      expect(printCustomSection(type, httpResponses, options))
        .toMatchInlineSnapshot(`
        {
          "content": "- \`200\` OK
        - \`404\` Not found

        ",
          "level": 3,
          "title": "Responses",
        }
      `);
    });

    test("uses the declared level and no title when untitled", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          type,
          { ...httpResponses, title: undefined, level: 4 },
          options,
        ),
      ).toMatchObject({ level: 4, title: undefined });
    });

    test("returns undefined if the directive is absent from the type", () => {
      expect.assertions(1);

      expect(
        printCustomSection(schema.getType("Other")!, httpResponses, options),
      ).toBeUndefined();
    });

    test("returns undefined if the directive is absent from the schema", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          type,
          { ...httpResponses, directive: "unknown" },
          options,
        ),
      ).toBeUndefined();
    });

    test("returns undefined if the schema is not set", () => {
      expect.assertions(1);

      expect(
        printCustomSection(type, httpResponses, {
          ...options,
          schema: undefined,
        }),
      ).toBeUndefined();
    });

    test("preserves the Markdown returned by the render callback", () => {
      expect.assertions(1);

      // Leading whitespace is significant in Markdown: an indented code block
      // stops being one if the section builder trims it.
      expect(
        printCustomSection(
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
        printCustomSection(
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
        printCustomSection(
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

    test("renders if appliesTo matches the entity kind", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          type,
          { ...httpResponses, appliesTo: ["objects"] },
          options,
        ),
      ).toBeDefined();
    });

    test("returns undefined if appliesTo excludes the entity kind", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          type,
          { ...httpResponses, appliesTo: ["queries"] },
          options,
        ),
      ).toBeUndefined();
    });

    test("returns undefined if appliesTo is set and the entity kind is unknown", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          { name: "NotAType" },
          { ...httpResponses, appliesTo: ["objects"] },
          options,
        ),
      ).toBeUndefined();
    });
  });

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

  describe("printCustomSections()", () => {
    const declaration = { title: "Responses", render: httpResponses.render };

    test("returns an entry per declared section, including empty ones", () => {
      expect.assertions(2);

      const sections = printCustomSections(type, {
        ...options,
        customSections: {
          httpResponse: declaration,
          unknown: declaration,
        } as CustomSections,
      });

      expect(Object.keys(sections)).toStrictEqual(["httpResponse", "unknown"]);
      expect(sections["unknown"]).toBeUndefined();
    });

    test("keeps a section named __proto__ as an own entry", () => {
      expect.assertions(2);

      // An object literal never makes `__proto__` an own property, so the name
      // only reaches the printer when defined explicitly, bypassing the
      // configuration validation.
      const customSections = Object.defineProperty({}, "__proto__", {
        value: declaration,
        enumerable: true,
      }) as CustomSections;

      const sections = printCustomSections(type, {
        ...options,
        customSections,
      });

      expect(Object.hasOwn(sections, "__proto__")).toBe(true);
      expect({ ...sections }["__proto__"]).toBeUndefined();
    });

    test("drops sections claiming a reserved name", () => {
      expect.assertions(1);

      const sections = printCustomSections(type, {
        ...options,
        customSections: { code: declaration } as CustomSections,
      });

      expect(Object.keys(sections)).toStrictEqual([]);
    });

    test("returns an empty map if no section is declared", () => {
      expect.assertions(2);

      expect(Object.keys(printCustomSections(type, options))).toStrictEqual([]);
      expect(
        Object.keys(
          printCustomSections(type, {
            ...options,
            customSections: {} as CustomSections,
          }),
        ),
      ).toStrictEqual([]);
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
        printCustomSection(
          exampleSchema.getType("Sample")!,
          getExampleSectionDefinition(exampleOptions),
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
        printCustomSection(type, getExampleSectionDefinition(options), options),
      ).toBeUndefined();
    });

    test("derives an example from the fields of a type carrying none", () => {
      expect.assertions(1);

      // `NoSample` has no example directive of its own: `printExample` walks its
      // fields instead, which is why the example section resolves its own values
      // rather than reading directive occurrences.
      expect(
        printCustomSection(
          exampleSchema.getType("NoSample")!,
          getExampleSectionDefinition(exampleOptions),
          exampleOptions,
        ),
      ).toBeDefined();
    });

    test("uses the directive name from the exampleSection option", () => {
      expect.assertions(2);

      expect(getExampleSectionDefinition(exampleOptions).directive).toBe(
        "example",
      );
      expect(
        getExampleSectionDefinition({
          ...exampleOptions,
          exampleSection: { directive: "sample" },
        }).directive,
      ).toBe("sample");
    });
  });

  describe("Printer.printType()", () => {
    test("renders the custom section on the type page, at its position", async () => {
      expect.assertions(1);

      await Printer.init(schema, "schema", "/", {
        printTypeOptions: {
          customSections: {
            httpResponse: {
              title: httpResponses.title,
              render: httpResponses.render,
              position: { after: "code" },
            },
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

  describe("getCustomSectionsOrder()", () => {
    const order = ["description", "code", "metadata", "relations"];
    const declaration = { title: "Responses", render: httpResponses.render };

    test("appends a section without position", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: { httpResponse: declaration } as CustomSections,
        }),
      ).toStrictEqual([...order, "httpResponse"]);
    });

    test("inserts a section after the named one", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: {
            httpResponse: { ...declaration, position: { after: "metadata" } },
          } as CustomSections,
        }),
      ).toStrictEqual([
        "description",
        "code",
        "metadata",
        "httpResponse",
        "relations",
      ]);
    });

    test("inserts a section before the named one", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: {
            httpResponse: { ...declaration, position: { before: "metadata" } },
          } as CustomSections,
        }),
      ).toStrictEqual([
        "description",
        "code",
        "httpResponse",
        "metadata",
        "relations",
      ]);
    });

    test("appends a section whose position names an unknown section", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: {
            httpResponse: { ...declaration, position: { after: "nope" } },
          } as CustomSections,
        }),
      ).toStrictEqual([...order, "httpResponse"]);
    });

    test("places sections in declaration order, so one can target another", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: {
            httpResponse: { ...declaration, position: { after: "code" } },
            httpHeader: {
              ...declaration,
              position: { after: "httpResponse" },
            },
          } as CustomSections,
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

    test("returns the order unchanged if no section is declared", () => {
      expect.assertions(2);

      expect(getCustomSectionsOrder(order, options)).toStrictEqual(order);
      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: {} as CustomSections,
        }),
      ).toStrictEqual(order);
    });
  });

  describe("decorators", () => {
    test("returns undefined when render is not a function, bypassing config validation", () => {
      expect.assertions(1);

      // `printDecorator` is directly callable, bypassing the config-time
      // validation that `getDecoratorsOption`/`getCustomSectionsOption`
      // otherwise enforce (see this file's own reserved-id tests, which rely
      // on the same bypass) — so a malformed `render` must still be handled
      // gracefully here rather than throwing.
      expect(
        printDecorator(
          type,
          {
            id: "responses",
            directive: "httpResponse",
            render: {} as never,
          },
          options,
        ),
      ).toBeUndefined();
    });

    test("id may differ from the directive it reads", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          {
            id: "responses",
            directive: "httpResponse",
            render: httpResponses.render,
          },
          options,
        ),
      ).toMatchObject({
        content: expect.stringContaining("200"),
      });
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

    test("predicate is AND-ed with appliesTo: either false skips", () => {
      expect.assertions(2);

      expect(
        printDecorator(
          type,
          {
            id: "httpResponse",
            render: httpResponses.render,
            predicate: () => {
              return false;
            },
            appliesTo: ["objects"],
          },
          options,
        ),
      ).toBeUndefined();

      expect(
        printDecorator(
          type,
          {
            id: "httpResponse",
            render: httpResponses.render,
            predicate: () => {
              return true;
            },
            appliesTo: ["queries"],
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

    test("a custom resolve bypasses the directive lookup entirely", () => {
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

    test("a predicate-only decorator with no directive and no resolve renders once with an empty record", () => {
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

    test("a directive-driven decorator with zero occurrences still renders nothing", () => {
      expect.assertions(1);

      expect(
        printDecorator(
          type,
          { id: "doesNotExistOnSchema", render: httpResponses.render },
          options,
        ),
      ).toBeUndefined();
    });

    test("context.directive is undefined when no schema is set", () => {
      expect.assertions(1);

      let seenDirective: unknown = "not set";

      printDecorator(
        type,
        {
          id: "marker",
          predicate: () => {
            return true;
          },
          render: (_values, _options, context) => {
            seenDirective = context.directive;
            return "rendered";
          },
        },
        { ...options, schema: undefined },
      );

      expect(seenDirective).toBeUndefined();
    });

    test("render receives id, type, directive, and entity in its context", () => {
      expect.assertions(4);

      let seen:
        | {
            id: string;
            type: unknown;
            directive: unknown;
            entity: unknown;
          }
        | undefined;

      printDecorator(
        type,
        {
          id: "httpResponse",
          render: (_values, _options, context) => {
            seen = { ...context };
            return "rendered";
          },
        },
        options,
      );

      expect(seen?.id).toBe("httpResponse");
      expect(seen?.type).toBe(type);
      expect((seen?.directive as { name?: string } | undefined)?.name).toBe(
        "httpResponse",
      );
      expect(seen?.entity).toBe("objects");
    });

    test("a decorator declared under `decorators` and one under the deprecated `customSections` produce identical output", () => {
      expect.assertions(1);

      const declaration = {
        title: "Responses",
        render: httpResponses.render,
      };

      const viaDecorators = printDecorators(type, {
        ...options,
        decorators: { httpResponse: declaration } as Decorators,
      });

      const viaCustomSections = printDecorators(type, {
        ...options,
        customSections: { httpResponse: declaration } as CustomSections,
      });

      expect(viaDecorators).toStrictEqual(viaCustomSections);
    });

    test("`decorators` takes precedence over `customSections` when both are set", () => {
      expect.assertions(1);

      const sections = printDecorators(type, {
        ...options,
        decorators: {
          httpResponse: {
            render: (): string => {
              return "from decorators";
            },
          },
        } as Decorators,
        customSections: {
          httpResponse: {
            render: (): string => {
              return "from customSections";
            },
          },
        } as CustomSections,
      });

      expect(sections["httpResponse"]).toMatchObject({
        content: expect.stringContaining("from decorators"),
      });
    });

    test("a `customSections` entry survives when `decorators` declares a different id", () => {
      expect.assertions(2);

      // Regression test: `getDeclaredDecorators` used to fall back to
      // `customSections` only when `decorators` was entirely absent
      // (`options.decorators ?? options.customSections`), silently dropping
      // every `customSections` entry the moment a single `decorators` entry
      // existed — a direct printer-API caller migrating one entry at a time
      // (the guarantee documented for `parseDeprecatedCustomSectionsOption`
      // in `@graphql-markdown/core`) would lose unrelated legacy sections.
      const sections = printDecorators(type, {
        ...options,
        decorators: {
          other: {
            predicate: (): boolean => {
              return true;
            },
            render: (): string => {
              return "from decorators";
            },
          },
        } as Decorators,
        customSections: {
          httpResponse: { title: "Responses", render: httpResponses.render },
        } as CustomSections,
      });

      expect(sections["httpResponse"]).toMatchObject({
        content: expect.stringContaining("200"),
      });
      expect(sections["other"]).toMatchObject({
        content: expect.stringContaining("from decorators"),
      });
    });

    describe("getDecoratorsOrder()", () => {
      const order = ["description", "code", "metadata", "relations"];

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

    describe("printDecorators()", () => {
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
  });
});
