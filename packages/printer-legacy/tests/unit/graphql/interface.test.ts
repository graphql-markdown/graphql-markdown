import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} from "graphql/type";

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
    test("returns interface metadata", async () => {
      expect.hasAssertions();

      const metadata = await printInterfaceMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(String.raw`
"### Fields

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">one</code></span>](#one)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> \{#one\} 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">two</code></span>](#two)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">scalar</mark> \{#two\} 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">three</code></span>](#three)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> \{#three\} 

##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName.three</code>.<code class="gqlmd-mdx-entity-name">four</code></span>](#four)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> \{#four\} 



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
