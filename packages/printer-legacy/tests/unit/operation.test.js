const { GraphQLID, GraphQLObjectType } = require("graphql");

const Utils = require("@graphql-markdown/utils");

const { DEFAULT_OPTIONS } = require("../../src/printer");
const { printOperationMetadata } = require("../../src/operation");

describe("operation", () => {
  describe("printOperationMetadata()", () => {
    test("returns operation metadata ", () => {
      expect.hasAssertions();

      jest.spyOn(Utils.graphql, "getTypeName").mockReturnValue("Test");

      const metadata = printOperationMetadata(
        {
          name: "TestQuery",
          type: GraphQLID,
          args: [],
        },
        {
          ...DEFAULT_OPTIONS,
          schema: {
            getType: () => new GraphQLObjectType({
              name: "Test",
            }),
          },
        },
      );

      expect(metadata).toMatchInlineSnapshot(`
        "### Type

        #### [<code style={{ fontWeight: 'normal' }}><b>Test</b></code>](#) 
        > 
        > 

        "
      `);
    });
  });
});
