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

describe("printer", () => {
  describe("printSection()", () => {
    test("returns Markdown ### section by default", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["content"];

      const section = printSection(content, title);

      expect(section).toMatchInlineSnapshot(`
            "### section title

            #### [\`content\`](#) 
            > 
            > 

            "
          `);
    });

    test("returns Markdown custom section level", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = ["content"];

      const section = printSection(content, title, {
        level: "#",
      });

      expect(section).toMatchInlineSnapshot(`
            "# section title

            #### [\`content\`](#) 
            > 
            > 

            "
          `);
    });

    test("returns empty string if content is empty", () => {
      expect.hasAssertions();

      const title = "section title";
      const content = [];

      const section = printSection(content, title);

      expect(section).toBe("");
    });
  });

  describe("printSectionItems()", () => {
    test("returns Markdown one line per item", () => {
      expect.hasAssertions();

      const itemList = ["one", "two", "three"];

      const section = printSectionItems(itemList);

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

      const section = printSectionItems(itemList);

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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#) 
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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#)<Bullet />[\`NonNullableObjectType!\`](#) 
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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#)<Bullet />[\`[NonNullableObjectType]!\`](#) 
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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeName\`](#) 
        > 
        > ##### [\`ParameterTypeName\`](#)<Bullet />[\`String\`](#) 
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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]\`](#) 
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

      const section = printSectionItem(type);

      expect(section).toMatchInlineSnapshot(`
        "#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]!\`](#) 
        > 
        > "
      `);
    });
  });
});
