import type { GraphQLSchema } from "@graphql-markdown/types";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql/type";

jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    ...jest.requireActual("@graphql-markdown/graphql"),
    isDirectiveType: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isDeprecated: jest.fn((T: any): boolean => {
      return ("deprecationReason" in T) as boolean;
    }),
  };
});

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printOperationMetadata,
  printCodeOperation,
} from "../../../src/graphql/operation";

describe("operation", () => {
  describe("printOperationMetadata()", () => {
    test("returns operation metadata", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      };

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        schema: {
          getType: () => {
            return new GraphQLObjectType({
              name: "Test",
              fields: {},
            });
          },
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
"### Type

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Test</code></span>](/types/objects/test) <mark class="gqlmd-mdx-badge">object</mark> 



"
`);
    });

    test("returns operation metadata with arguments", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        schema: {
          getType: () => {
            return new GraphQLObjectType({
              name: "Test",
              fields: {},
            });
          },
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
"### Arguments

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestQuery</code>.<code class="gqlmd-mdx-entity-name">ArgFooBar</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



### Type

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Test</code></span>](/types/objects/test) <mark class="gqlmd-mdx-badge">object</mark> 



"
`);
    });

    test("returns operation metadata with arguments with grouped deprecated", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "Foo",
            type: GraphQLString,
          },
          {
            name: "Bar",
            type: GraphQLString,
            deprecationReason: "Deprecated",
          },
        ],
      };

      const metadata = printOperationMetadata(operation, {
        ...DEFAULT_OPTIONS,
        deprecated: "group",
        schema: {
          getType: () => {
            return new GraphQLObjectType({
              name: "Test",
              fields: {},
            });
          },
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
"### Arguments

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestQuery</code>.<code class="gqlmd-mdx-entity-name">Foo</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">scalar</mark> 



 

<details class="gqlmd-mdx-details">
<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">DEPRECATED</span></summary>
</details>

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">TestQuery</code>.<code class="gqlmd-mdx-entity-name">Bar</code></span>](#)<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String</code></span>](/types/scalars/string) <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">scalar</mark> 
<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️ DEPRECATED</span></legend>
<span>

Deprecated

</span>
</fieldset>
undefined### Type

#### [<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Test</code></span>](/types/objects/test) <mark class="gqlmd-mdx-badge">object</mark> 



"
`);
    });
  });

  describe("printCodeOperation()", () => {
    test("returns an operation with its fields", () => {
      expect.hasAssertions();

      const operation = {
        name: "TestQuery",
        type: GraphQLID,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const code = printCodeOperation(operation);

      expect(code).toMatchInlineSnapshot(`
        "TestQuery(
          ArgFooBar: String
        ): ID
        "
      `);
    });
  });
});
