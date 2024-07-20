import { GraphQLDirective, GraphQLBoolean } from "graphql/type";
import { DirectiveLocation } from "graphql/language";

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printCodeDirective,
  printDirectiveMetadata,
} from "../../../src/graphql/directive";

describe("directive", () => {
  describe("printDirectiveMetadata()", () => {
    test("returns directive metadata without params", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        locations: [],
      });

      const code = printDirectiveMetadata(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`""`);
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

      expect(code).toMatchInlineSnapshot(`
"### Arguments

#### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>ArgFooBar</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean.mdx) <Badge class="badge badge--secondary" text="scalar"/> 



"
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

      expect(code).toMatchInlineSnapshot(`
"### Arguments

#### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>Foo</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean.mdx) <Badge class="badge badge--secondary" text="scalar"/> 



 

<Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

#### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>Bar</b></code>](#)<Bullet />[\`Boolean\`](/types/scalars/boolean.mdx) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/> 
:::warning[DEPRECATED]

Deprecated

:::


</Details>

"
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
