import { GraphQLBoolean, GraphQLString, GraphQLInterfaceType } from "graphql";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printCodeInterface,
  printInterfaceMetadata,
} from "../../../src/graphql/interface";

describe("interface", () => {
  const type = new GraphQLInterfaceType({
    name: "TestInterfaceName",
    fields: {
      one: { type: GraphQLString },
      two: { type: GraphQLBoolean },
      three: {
        type: GraphQLString,
        args: {
          four: {
            type: GraphQLString,
          },
        },
      },
    },
  });

  describe("printInterfaceMetadata()", () => {
    test("returns interface metadata", () => {
      expect.hasAssertions();

      const metadata = printInterfaceMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.<b>one</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.<b>three</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>TestInterfaceName.three.<b>four</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        "
      `);
    });
  });

  describe("printCodeInterface()", () => {
    test("returns an interface with its fields", () => {
      expect.hasAssertions();

      const code = printCodeInterface(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`
        "interface TestInterfaceName {
          one: String
          two: Boolean
          three(
            four: String
          ): String
        }"
      `);
    });
  });
});
