const {
  GraphQLDirective,
  GraphQLBoolean,
  GraphQLString,
  DirectiveLocation,
} = require("graphql");

const {
  DEFAULT_OPTIONS,
  OPTION_DEPRECATED,
} = require("../../../src/const/options");

const {
  printCodeDirective,
  printDirectiveMetadata,
} = require("../../../src/graphql/directive");

describe("directive", () => {
  describe("printDirectiveMetadata()", () => {
    test("returns directive metadata without params", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
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

        #### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>ArgFooBar</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

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
        printDeprecated: OPTION_DEPRECATED.GROUP,
      });

      expect(code).toMatchInlineSnapshot(`
        "### Arguments

        #### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>Foo</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="badge badge--secondary" text="scalar"/>
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>FooBar.<b>Bar</b></code>](#)<Bullet />[\`Boolean\`](/scalars/boolean) <Badge class="badge badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/>
        > <Badge class="badge badge--warning" text="DEPRECATED: Deprecated"/>
        > 
        > 
        > 
        > 
        > 

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
        type: GraphQLString,
        locations: [],
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`"directive @FooBar"`);
    });

    test("returns a directive with its arguments", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
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
        type: GraphQLString,
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
        type: GraphQLString,
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
