import { GraphQLEnumType, GraphQLScalarType } from "graphql";

import { printCodeEnum, printEnumMetadata } from "../../../src/graphql/enum";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

describe("enum", () => {
  const type = new GraphQLEnumType({
    name: "EnumTypeName",
    values: {
      one: { value: "one" },
      two: { value: "two", deprecationReason: "Deprecated" },
    },
  });

  describe("printEnumMetadata()", () => {
    test("returns enum metadata", () => {
      expect.hasAssertions();

      const metadata = printEnumMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
        "### Values

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>one</b></code>](#)  
        > 
        > 
        > 
        > 

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>two</b></code>](#) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> 
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

        "
      `);
    });

    test("returns enum metadata with grouped deprecated", () => {
      expect.hasAssertions();

      const metadata = printEnumMetadata(type, {
        ...DEFAULT_OPTIONS,
        deprecated: "group",
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Values

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>one</b></code>](#)  
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>EnumTypeName.<b>two</b></code>](#) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> 
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

        "
      `);
    });
  });

  describe("printCodeEnum()", () => {
    test("returns enum code structure", () => {
      expect.hasAssertions();

      const code = printCodeEnum(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`
        "enum EnumTypeName {
          one
          two @deprecated
        }"
      `);
    });

    test("returns enum code structure without deprecated if SKIP", () => {
      expect.hasAssertions();

      const code = printCodeEnum(type, {
        ...DEFAULT_OPTIONS,
        deprecated: "skip",
      });

      expect(code).toMatchInlineSnapshot(`
        "enum EnumTypeName {
          one
        }"
      `);
    });

    test("returns empty string if not enum type", () => {
      expect.hasAssertions();

      const scalarType = new GraphQLScalarType<unknown>({
        name: "ScalarTypeName",
      });

      const code = printCodeEnum(scalarType, DEFAULT_OPTIONS);

      expect(code).toBe("");
    });
  });
});
