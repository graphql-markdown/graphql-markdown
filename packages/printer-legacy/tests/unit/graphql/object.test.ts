import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} from "graphql/type";

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

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">one</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">two</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">scalar</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

Deprecated

</span>
</fieldset>


#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">three</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 

##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName.three</code>.<code class="gqlmd-mdx-entity-name">four</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



### Interfaces

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">TestInterfaceName</code></span>](/types/interfaces/test-interface-name) <mark class="gqlmd-mdx-badge">interface</mark> 



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

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">one</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">three</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 

##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName.three</code>.<code class="gqlmd-mdx-entity-name">four</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



 

<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">DEPRECATED</span></summary>

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName</code>.<code class="gqlmd-mdx-entity-name">two</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">scalar</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

Deprecated

</span>
</fieldset>


</details>

### Interfaces

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">TestInterfaceName</code></span>](/types/interfaces/test-interface-name) <mark class="gqlmd-mdx-badge">interface</mark> 



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
