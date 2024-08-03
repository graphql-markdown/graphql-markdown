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

#### [\`Test\`](/types/objects/test.mdx) <Badge class="badge badge--secondary" text="object"/> 



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

#### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>ArgFooBar</b></code>](#)<Bullet />[\`String\`](/types/scalars/string.mdx) <Badge class="badge badge--secondary" text="scalar"/> 



### Type

#### [\`Test\`](/types/objects/test.mdx) <Badge class="badge badge--secondary" text="object"/> 



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

#### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Foo</b></code>](#)<Bullet />[\`String\`](/types/scalars/string.mdx) <Badge class="badge badge--secondary" text="scalar"/> 



 

<Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

#### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Bar</b></code>](#)<Bullet />[\`String\`](/types/scalars/string.mdx) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/> 
:::warning[DEPRECATED]

Deprecated

:::


</Details>

### Type

#### [\`Test\`](/types/objects/test.mdx) <Badge class="badge badge--secondary" text="object"/> 



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
