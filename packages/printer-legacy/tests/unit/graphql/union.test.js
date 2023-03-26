const { GraphQLInt, GraphQLScalarType, GraphQLUnionType } = require("graphql");

const {
  printCodeUnion,
  printUnionMetadata,
} = require("../../../src/graphql/union");

const { DEFAULT_OPTIONS } = require("../../../src/printer");

describe("union", () => {
  const type = new GraphQLUnionType({
    name: "UnionTypeName",
    types: [{ name: "one" }, { name: "two" }],
  });

  describe("printUnionMetadata", () => {
    test("returns union metadata", () => {
      expect.hasAssertions();

      const code = printUnionMetadata(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`
        "### Possible types

        #### [<code style={{ fontWeight: 'normal' }}>UnionTypeName.<b>one</b></code>](#) 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>UnionTypeName.<b>two</b></code>](#) 
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeUnion()", () => {
    test("returns union code structure", () => {
      expect.hasAssertions();

      const code = printCodeUnion(type);

      expect(code).toMatchInlineSnapshot(`"union UnionTypeName = one | two"`);
    });

    test("returns empty string if not union type", () => {
      expect.hasAssertions();

      const scalarType = new GraphQLScalarType({
        name: "ScalarTypeName",
        type: GraphQLInt,
      });

      const code = printCodeUnion(scalarType);

      expect(code).toBe("");
    });
  });
});
