const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} = require("graphql");

const { DEFAULT_OPTIONS } = require("../../../src/const/options");

const {
  printCodeInterface,
  printInterfaceMetadata,
} = require("../../../src/graphql/interface");

describe("interface", () => {
  describe("printInterfaceMetadata()", () => {
    test("returns interface metadata", () => {
      expect.hasAssertions();

      const type = new GraphQLInterfaceType({
        name: "TestInterfaceName",
        fields: {
          one: { type: GraphQLString },
          two: { type: GraphQLBoolean },
        },
      });

      const metadata = printInterfaceMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.<b>one</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="secondary" text="scalar"/>
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeInterface()", () => {
    test("returns an interface with its fields", () => {
      expect.hasAssertions();

      const type = new GraphQLInterfaceType({
        name: "TestInterfaceName",
        fields: {
          one: { type: GraphQLString },
          two: { type: GraphQLBoolean },
        },
      });

      const code = printCodeInterface(type);

      expect(code).toMatchInlineSnapshot(`
        "interface TestInterfaceName {
          one: String
          two: Boolean
        }"
      `);
    });
  });
});
