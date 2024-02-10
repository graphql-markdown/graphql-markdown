import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} from "graphql";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printCodeObject,
  printObjectMetadata,
} from "../../../src/graphql/object";

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
    interfaces: (): GraphQLInterfaceType[] => {
      return [
        new GraphQLInterfaceType({ name: "TestInterfaceName", fields: {} }),
      ];
    },
  });

  describe("printObjectMetadata", () => {
    test("returns object metadata", () => {
      expect.hasAssertions();

      const metadata = printObjectMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>one</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > :::warning[DEPRECATED]
        > 
        > Deprecated
        > 
        > :::
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>three</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>TestName.three.<b>four</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        ### Interfaces

        #### [\`TestInterfaceName\`](/types/interfaces/test-interface-name) <Badge class="badge badge--secondary" text="interface"/> 
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
        deprecated: "group",
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Fields

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>one</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>three</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > ##### [<code style={{ fontWeight: 'normal' }}>TestName.three.<b>four</b></code>](#)<Bullet />[\`String\`](/types/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>TestName.<b>two</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > :::warning[DEPRECATED]
        > 
        > Deprecated
        > 
        > :::
        > 
        > 
        > 

        </Details>

        ### Interfaces

        #### [\`TestInterfaceName\`](/types/interfaces/test-interface-name) <Badge class="badge badge--secondary" text="interface"/> 
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

      const code = printCodeObject(type, DEFAULT_OPTIONS);

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

      const code = printCodeObject(type, {
        ...DEFAULT_OPTIONS,
        deprecated: "skip",
      });

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
