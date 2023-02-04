const { GraphQLID, GraphQLObjectType, GraphQLString } = require("graphql");

const Utils = require("@graphql-markdown/utils");

const { DEFAULT_OPTIONS } = require("../../src/printer");
const { printOperationMetadata } = require("../../src/operation");

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

        #### [\`Test\`](/objects/test) <Badge class="secondary" text="object"/>
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

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>ArgFooBar</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="secondary" text="scalar"/>
        > 
        > 

        ### Type

        #### [\`Test\`](/objects/test) <Badge class="secondary" text="object"/>
        > 
        > 

        "
      `);
    });
  });
});
