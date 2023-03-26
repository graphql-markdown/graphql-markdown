const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} = require("graphql");
const { DEFAULT_OPTIONS } = require("../../../src/printer");

const {
  printCodeObject,
  printObjectMetadata,
} = require("../../../src/graphql/object");

describe("object", () => {
  const type = new GraphQLObjectType({
    name: "TestName",
    fields: {
      one: { type: GraphQLString },
      two: { type: GraphQLBoolean },
    },
    interfaces: () => [new GraphQLInterfaceType({ name: "TestInterfaceName" })],
  });

  describe("printObjectMetadata", () => {
    test("returns object metadata", () => {
      expect.hasAssertions();

      const metadata = printObjectMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>one</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="secondary" text="scalar"/>
        > 
        > 

        ### Interfaces

        #### [\`TestInterfaceName\`](/interfaces/test-interface-name) <Badge class="secondary" text="interface"/>
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeObject()", () => {
    test("returns an object with its fields and interfaces", () => {
      expect.hasAssertions();

      const code = printCodeObject(type);

      expect(code).toMatchInlineSnapshot(`
        "type TestName implements TestInterfaceName {
          one: String
          two: Boolean
        }"
      `);
    });
  });
});
