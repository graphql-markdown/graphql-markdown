import { GraphQLObjectType, GraphQLScalarType, GraphQLUnionType } from "graphql";

import {
  printCodeUnion,
  printUnionMetadata,
} from "../../../src/graphql/union";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

describe("union", () => {
  const type = new GraphQLUnionType({
    name: "UnionTypeName",
    types: [new GraphQLObjectType<string>({ name: "one", fields: {} }), new GraphQLObjectType<string>({ name: "two", fields: {} })],
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
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>UnionTypeName.<b>two</b></code>](#)  
        > 
        > 
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

      const scalarType = new GraphQLScalarType<number>({
        name: "ScalarTypeName",
      });

      const code = printCodeUnion(scalarType);

      expect(code).toBe("");
    });
  });
});
