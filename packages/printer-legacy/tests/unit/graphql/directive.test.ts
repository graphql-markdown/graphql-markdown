import { GraphQLDirective, GraphQLBoolean } from "graphql/type";
import { DirectiveLocation } from "graphql/language";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printCodeDirective,
  printDirectiveMetadata,
} from "../../../src/graphql/directive";

describe("directive", () => {
  describe("printDirectiveMetadata()", () => {
    test("returns undefined for directive metadata without params", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
      });

      const code = printDirectiveMetadata(type, DEFAULT_OPTIONS);

      expect(code).toBeUndefined();
    });

    test("returns directive metadata", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printDirectiveMetadata(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(String.raw`
{
  "content": "#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">FooBar</code>.<code class="gqlmd-mdx-entity-name">ArgFooBar</code></span>](#arg-foo-bar)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">scalar</mark> \{#arg-foo-bar\} 



",
  "level": 3,
  "title": "Arguments",
}
`);
    });

    test("returns directive metadata with grouped deprecated", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
        args: {
          Foo: {
            type: GraphQLBoolean,
          },
          Bar: {
            type: GraphQLBoolean,
            deprecationReason: "Deprecated",
          },
        },
      });

      const code = printDirectiveMetadata(type, {
        ...DEFAULT_OPTIONS,
        deprecated: "group",
      });

      expect(code).toMatchInlineSnapshot(String.raw`
{
  "content": "#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">FooBar</code>.<code class="gqlmd-mdx-entity-name">Foo</code></span>](#foo)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">scalar</mark> \{#foo\} 





<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">DEPRECATED</span></summary>
#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">FooBar</code>.<code class="gqlmd-mdx-entity-name">Bar</code></span>](#bar)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Boolean</code></span>](/types/scalars/boolean) <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">scalar</mark> \{#bar\} 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️ DEPRECATED</span></legend>
<span>

Deprecated

</span>
</fieldset>

</details>

",
  "level": 3,
  "title": "Arguments",
}
`);
    });
  });

  describe("printCodeDirective()", () => {
    test("returns a directive", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`"directive @FooBar"`);
    });

    test("returns a directive with its arguments", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        )"
      `);
    });

    test("returns a directive with multiple locations", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [DirectiveLocation.QUERY, DirectiveLocation.FIELD],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        ) on 
          | QUERY
          | FIELD"
      `);
    });

    test("returns a directive with single location", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [DirectiveLocation.QUERY],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        ) on QUERY"
      `);
    });
  });
});
