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
    test("returns interface metadata", () => {
      expect.hasAssertions();

      const metadata = printInterfaceMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
"### Fields

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">one</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">two</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">scalar</mark> 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName</code>.<code class="gqlmd-mdx-entity-name">three</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 

##### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestInterfaceName.three</code>.<code class="gqlmd-mdx-entity-name">four</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



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
