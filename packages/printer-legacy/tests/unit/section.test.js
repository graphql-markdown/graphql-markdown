const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");

const {
  printSection,
  printSectionItem,
  printSectionItems,
} = require("../../src/section");

const { DEFAULT_OPTIONS } = require("../../src/printer");

describe("section", () => {
  describe("printSection()", () => {
    test("returns Markdown ### section by default", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["section content"];

      const section = printSection(content, title, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "### section title

        #### [\`section content\`](#) 
        > 
        > 

        "
      `);
    });

    test("returns Markdown ### section with collapsible content", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["section content"];

      const section = printSection(content, title, {
        ...DEFAULT_OPTIONS,
        collapsible: true,
      });

      expect(section).toMatchInlineSnapshot(`
        "### section title

        <Details summary="Show deprecated">

        #### [\`section content\`](#) 
        > 
        > 

        </Details>

        "
      `);
    });

    test("returns Markdown custom section level", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["section content"];

      const section = printSection(content, title, {
        level: "#",
        ...DEFAULT_OPTIONS,
      });

      expect(section).toMatchInlineSnapshot(`
        "# section title

        #### [\`section content\`](#) 
        > 
        > 

        "
      `);
    });

    test("returns empty string if content is empty", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = [];

      const section = printSection(content, title, DEFAULT_OPTIONS);

      expect(section).toBe("");
    });
  });

  describe("printSectionItems()", () => {
    test("returns Markdown one line per item", () => {
      expect.hasAssertions();

      const itemList = ["one", "two", "three"];

      const section = printSectionItems(itemList, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`one\`](#) 
        > 
        > 

        #### [\`two\`](#) 
        > 
        > 

        #### [\`three\`](#) 
        > 
        > "
      `);
    });

    test("returns empty text if not a list", () => {
      expect.hasAssertions();

      const itemList = "list";

      const section = printSectionItems(itemList, DEFAULT_OPTIONS);

      expect(section).toMatch("");
    });
  });

  describe("printSectionItem()", () => {
    test("returns Markdown #### link section with description", () => {
      expect.hasAssertions();

      const type = new GraphQLObjectType({
        name: "EntityTypeName",
        description: "Lorem ipsum",
      });

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](/objects/entity-type-name) <Badge class="secondary" text="object"/>
        > Lorem ipsum
        > "
      `);
    });

    test("returns Markdown #### link section with sub type is non-nullable", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLObjectType({
            name: "NonNullableObjectType",
          }),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#)<Bullet />[\`NonNullableObjectType!\`](/objects/non-nullable-object-type) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>
        > 
        > "
      `);
    });

    test("returns Markdown #### link section with sub type list and non-nullable", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        type: new GraphQLNonNull(
          new GraphQLList(
            new GraphQLObjectType({
              name: "NonNullableObjectType",
            }),
          ),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#)<Bullet />[\`[NonNullableObjectType]!\`](/objects/non-nullable-object-type) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>
        > 
        > "
      `);
    });

    test("returns Markdown #### link section with parent type prefix", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        parentType: "parentTypePrefix",
      });

      expect(section).toMatchInlineSnapshot(`
        "#### [<code style={{ fontWeight: 'normal' }}>parentTypePrefix.<b>EntityTypeName</b></code>](#) 
        > 
        > "
      `);
    });

    test("returns Markdown #### link section with field parameters", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        args: [
          {
            name: "ParameterTypeName",
            type: GraphQLString,
          },
        ],
      };
      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#) 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>EntityTypeName.<b>ParameterTypeName</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > "
      `);
    });

    test("returns Markdown #### link section with non empty nullable list [!]", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]\`](/scalars/int) <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>
        > 
        > "
      `);
    });

    test("returns Markdown #### link section with non empty no nullable list [!]!", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLInt)),
        ),
      };

      const section = printSectionItem(type, DEFAULT_OPTIONS);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]!\`](/scalars/int) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>
        > 
        > "
      `);
    });

    test("returns no section if item matches skipDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeNameList",
        astNode: {
          directives: [{ name: { value: "@noDoc" } }],
        },
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        skipDocDirective: "@noDoc",
      });

      expect(section).toBe("");
    });

    test("returns Markdown #### link section without field parameters matching skipDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        args: [
          {
            name: "ParameterTypeName",
            type: GraphQLString,
            astNode: {
              directives: [{ name: { value: "@doc" } }],
            },
          },
          {
            name: "ParameterSkipDoc",
            type: GraphQLString,
            astNode: {
              directives: [{ name: { value: "@noDoc" } }],
            },
          },
        ],
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        skipDocDirective: "@noDoc",
      });

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#) 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>EntityTypeName.<b>ParameterTypeName</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > 

        "
      `);
    });

    test("returns Markdown #### link section with only type matching onlyDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "ParameterOnlyDoc",
        type: GraphQLString,
        astNode: {
          directives: [{ name: { value: "@doc" } }],
        },
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        onlyDocDirective: "@doc",
      });

      expect(section).toMatchInlineSnapshot(`
        "#### [\`ParameterOnlyDoc\`](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > "
      `);
    });

    test("returns Markdown #### link section empty if type does not match onlyDocDirective", () => {
      expect.hasAssertions();

      const type = {
        name: "ParameterOnlyDoc",
        type: GraphQLString,
        astNode: {
          directives: [{ name: { value: "@noDoc" } }],
        },
      };

      const section = printSectionItem(type, {
        ...DEFAULT_OPTIONS,
        onlyDocDirective: "@doc",
      });

      expect(section).toMatchInlineSnapshot(`""`);
    });
  });
});
