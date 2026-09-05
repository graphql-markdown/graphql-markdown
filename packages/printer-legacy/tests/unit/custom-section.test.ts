import { buildSchema } from "graphql/utilities";

import type {
  PrintTypeOptions,
  TypeCustomSectionOption,
} from "@graphql-markdown/types";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import { Printer } from "../../src/printer";

import {
  getCustomSectionsOrder,
  getSchemaEntity,
  printCustomSection,
  printCustomSections,
} from "../../src/custom-section";

describe("custom-section", () => {
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

  const httpResponses: TypeCustomSectionOption = {
    name: "httpResponses",
    title: "Responses",
    directive: "httpResponse",
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

    test("returns undefined if the section name is reserved", () => {
      expect.assertions(1);

      expect(
        printCustomSection(
          type,
          { ...httpResponses, name: "metadata" },
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
    test("returns an entry per declared section, including empty ones", () => {
      expect.assertions(2);

      const sections = printCustomSections(type, {
        ...options,
        customSections: [
          httpResponses,
          { ...httpResponses, name: "absent", directive: "unknown" },
        ],
      });

      expect(Object.keys(sections)).toStrictEqual(["httpResponses", "absent"]);
      expect(sections["absent"]).toBeUndefined();
    });

    test("keeps a repeated section name only once", () => {
      expect.assertions(1);

      const sections = printCustomSections(type, {
        ...options,
        customSections: [httpResponses, { ...httpResponses, title: "Other" }],
      });

      expect(sections["httpResponses"]).toMatchObject({ title: "Responses" });
    });

    test("drops sections claiming a reserved name", () => {
      expect.assertions(1);

      const sections = printCustomSections(type, {
        ...options,
        customSections: [{ ...httpResponses, name: "code" }],
      });

      expect(Object.keys(sections)).toStrictEqual([]);
    });

    test("returns an empty map if no section is declared", () => {
      expect.assertions(2);

      expect(printCustomSections(type, options)).toStrictEqual({});
      expect(
        printCustomSections(type, {
          ...options,
          customSections: {} as unknown as TypeCustomSectionOption[],
        }),
      ).toStrictEqual({});
    });
  });

  describe("Printer.printType()", () => {
    test("renders the custom section on the type page, at its position", async () => {
      expect.assertions(1);

      await Printer.init(schema, "schema", "/", {
        printTypeOptions: {
          customSections: [
            {
              ...httpResponses,
              position: { after: "code" },
            },
          ],
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

    test("appends a section without position", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [httpResponses],
        }),
      ).toStrictEqual([...order, "httpResponses"]);
    });

    test("inserts a section after the named one", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [
            { ...httpResponses, position: { after: "metadata" } },
          ],
        }),
      ).toStrictEqual([
        "description",
        "code",
        "metadata",
        "httpResponses",
        "relations",
      ]);
    });

    test("inserts a section before the named one", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [
            { ...httpResponses, position: { before: "metadata" } },
          ],
        }),
      ).toStrictEqual([
        "description",
        "code",
        "httpResponses",
        "metadata",
        "relations",
      ]);
    });

    test("appends a section whose position names an unknown section", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [{ ...httpResponses, position: { after: "nope" } }],
        }),
      ).toStrictEqual([...order, "httpResponses"]);
    });

    test("places sections in declaration order, so one can target another", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [
            { ...httpResponses, position: { after: "code" } },
            {
              ...httpResponses,
              name: "httpHeaders",
              position: { after: "httpResponses" },
            },
          ],
        }),
      ).toStrictEqual([
        "description",
        "code",
        "httpResponses",
        "httpHeaders",
        "metadata",
        "relations",
      ]);
    });

    test("places a repeated section name once, at its first declaration", () => {
      expect.assertions(1);

      expect(
        getCustomSectionsOrder(order, {
          ...options,
          customSections: [
            { ...httpResponses, position: { after: "code" } },
            { ...httpResponses, position: { after: "relations" } },
          ],
        }),
      ).toStrictEqual([
        "description",
        "code",
        "httpResponses",
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
          customSections: {} as unknown as TypeCustomSectionOption[],
        }),
      ).toStrictEqual(order);
    });
  });
});
