const {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} = require("graphql");

const {
  printCodeInterface,
  printInterfaceMetadata,
} = require("../../src/interface");

describe("interface", () => {
  describe("printInterfaceMetadata", () => {});

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
