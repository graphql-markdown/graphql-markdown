import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
} from "graphql/type";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import { printCodeInput, printInputMetadata } from "../../../src/graphql/input";

describe("input", () => {
  const type = new GraphQLInputObjectType({
    name: "TestName",
    fields: {
      one: { type: GraphQLString },
      two: { type: GraphQLBoolean },
    },
  });

  describe("printInputMetadata()", () => {
    test("returns input metadata", () => {
      expect.hasAssertions();

      const metadata = printInputMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
"### Fields

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName.</code><code class="gqlmd-mdx-entity-name">one</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestName.</code><code class="gqlmd-mdx-entity-name">two</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">scalar</mark> 



"
`);
    });
  });

  describe("printCodeInput()", () => {
    test("returns an input with its fields", () => {
      expect.hasAssertions();

      const code = printCodeInput(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`
        "input TestName {
          one: String
          two: Boolean
        }"
      `);
    });
  });
});
