import { GraphQLEnumType, GraphQLScalarType } from "graphql/type";

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

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EnumTypeName.</code><code class="gqlmd-mdx-entity-name">one</code></span>](#)  



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EnumTypeName.</code><code class="gqlmd-mdx-entity-name">two</code></span>](#) <mark class="gqlmd-mdx-badge">deprecated</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

Deprecated

</span>
</fieldset>


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

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EnumTypeName.</code><code class="gqlmd-mdx-entity-name">one</code></span>](#)  



 

<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary">Deprecation</summary>

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">EnumTypeName.</code><code class="gqlmd-mdx-entity-name">two</code></span>](#) <mark class="gqlmd-mdx-badge">deprecated</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

Deprecated

</span>
</fieldset>


</details>

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
