const { GraphQLID, GraphQLObjectType, GraphQLString } = require("graphql");

const Utils = require("@graphql-markdown/utils");

const {
  DEFAULT_OPTIONS,
  OPTION_DEPRECATED,
} = require("../../../src/const/options");
const {
  printOperationMetadata,
  printCodeOperation,
} = require("../../../src/graphql/operation");

describe("operation", () => {
  describe("printOperationMetadata()", () => {
    test("returns operation metadata", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      };

      jest.spyOn(Utils.graphql, "getTypeName").mockReturnValue("Test");

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        schema: {
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
            }),
        },
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/>
        > 
        > 
        > 
        > 

        "
      `);
    });

    test("returns operation metadata with arguments", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      jest.spyOn(Utils.graphql, "getTypeName").mockReturnValue("Test");

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        schema: {
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
            }),
        },
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Arguments

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>ArgFooBar</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

        ### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/>
        > 
        > 
        > 
        > 

        "
      `);
    });

    test("returns operation metadata with arguments with grouped deprecated", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "Foo",
            type: GraphQLString,
          },
          {
            name: "Bar",
            type: GraphQLString,
            deprecationReason: "Deprecated",
          },
        ],
      };

      jest.spyOn(Utils.graphql, "getTypeName").mockReturnValue("Test");

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        printDeprecated: OPTION_DEPRECATED.GROUP,
        schema: {
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
            }),
        },
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Arguments

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Foo</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Bar</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/>
        > <Badge class="badge badge--warning" text="DEPRECATED: Deprecated"/>
        > 
        > 
        > 
        > 
        > 

        </Details>

        ### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/>
        > 
        > 
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeOperation()", () => {
    test("returns an operation with its fields", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const code = printCodeOperation(operation);

      expect(code).toMatchInlineSnapshot(`
        "TestQuery(
          ArgFooBar: String
        ): ID
        "
      `);
    });
  });
});
