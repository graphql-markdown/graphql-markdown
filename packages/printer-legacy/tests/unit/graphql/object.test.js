const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} = require("graphql");

const {
  DEFAULT_OPTIONS,
  OPTION_DEPRECATED,
} = require("../../../src/const/options");

const {
  printCodeObject,
  printObjectMetadata,
} = require("../../../src/graphql/object");

describe("object", () => {
  const type = new GraphQLObjectType({
    name: "TestName",
    fields: {
      one: { type: GraphQLString },
      two: { type: GraphQLBoolean, deprecationReason: "Deprecated" },
      three: {
        type: GraphQLString,
        args: {
          four: {
            type: GraphQLString,
          },
        },
      },
    },
    interfaces: () => [new GraphQLInterfaceType({ name: "TestInterfaceName" })],
  });

  describe("printObjectMetadata", () => {
    test("returns object metadata", () => {
      expect.hasAssertions();

      const metadata = printObjectMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>one</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > :::caution DEPRECATED
        > Deprecated
        > :::
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>three</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>TestName.three.<b>four</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

        ### Interfaces

        #### [\`TestInterfaceName\`](/interfaces/test-interface-name) <Badge class="badge badge--secondary" text="interface"/>
        > 
        > 
        > 
        > 

        "
      `);
    });

    test("returns object metadata with grouped deprecated", () => {
      expect.hasAssertions();

      const metadata = printObjectMetadata(type, {
        ...DEFAULT_OPTIONS,
        printDeprecated: OPTION_DEPRECATED.GROUP,
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>one</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>three</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>TestName.three.<b>four</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > :::caution DEPRECATED
        > Deprecated
        > :::
        > 
        > 
        > 

        </Details>

        ### Interfaces

        #### [\`TestInterfaceName\`](/interfaces/test-interface-name) <Badge class="badge badge--secondary" text="interface"/>
        > 
        > 
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
          two: Boolean @deprecated
          three(
            four: String
          ): String
        }"
      `);
    });

    test("returns an object with no deprecated fields if SKIP", () => {
      expect.hasAssertions();

      const code = printCodeObject(type, { printDeprecated: "skip" });

      expect(code).toMatchInlineSnapshot(`
        "type TestName implements TestInterfaceName {
          one: String
          three(
            four: String
          ): String
        }"
      `);
    });
  });
});
