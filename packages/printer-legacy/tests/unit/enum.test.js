const { GraphQLInt, GraphQLEnumType, GraphQLScalarType } = require("graphql");

const { printCodeEnum, printEnumMetadata } = require("../../src/enum");

describe("enum", () => {
  const type = new GraphQLEnumType({
    name: "EnumTypeName",
    values: {
      one: { value: "one" },
      two: { value: "two" },
    },
  });

  describe("printEnumMetadata()", () => {
    test("returns enum metadata", () => {
      expect.hasAssertions();

      const metadata = printEnumMetadata(type);

      expect(metadata).toMatchInlineSnapshot(`
        "### Values

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>one</b></code>](#) 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>two</b></code>](#) 
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeEnum()", () => {
    test("returns enum code structure", () => {
      expect.hasAssertions();

      const code = printCodeEnum(type);

      expect(code).toMatchInlineSnapshot(`
        "enum EnumTypeName {
          one
          two
        }"
      `);
    });

    test("returns empty string if not enum type", () => {
      expect.hasAssertions();

      const scalarType = new GraphQLScalarType({
        name: "ScalarTypeName",
        type: GraphQLInt,
      });

      const code = printCodeEnum(scalarType);

      expect(code).toBe("");
    });
  });
});
