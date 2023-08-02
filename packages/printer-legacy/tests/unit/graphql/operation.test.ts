import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} from "graphql";

jest.mock("@graphql-markdown/utils", () => {
  return {
    ...jest.requireActual("@graphql-markdown/utils"),
    isDeprecated: jest.fn((t: any) => "deprecationReason" in t), // eslint-disable-line @typescript-eslint/no-explicit-any
  };
});

import { DEFAULT_OPTIONS } from "../../../src/const/options";

import {
  printOperationMetadata,
  printCodeOperation,
} from "../../../src/graphql/operation";

describe("operation", () => {
  afterEach(() => {
    jest.restoreAllMocks;
  });

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
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
              fields: {},
            }),
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/> 
        > 
        > 
        > 
        > 

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
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
              fields: {},
            }),
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Arguments

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>ArgFooBar</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

        ### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/> 
        > 
        > 
        > 
        > 

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
          getType: () =>
            new GraphQLObjectType({
              name: "Test",
              fields: {},
            }),
        } as unknown as GraphQLSchema,
      });

      expect(metadata).toMatchInlineSnapshot(`
        "### Arguments

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Foo</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > 
        > 

         

        <Details dataOpen={<><span className="deprecated">Hide deprecated</span></>} dataClose={<><span className="deprecated">Show deprecated</span></>}>

        #### [<code style={{ fontWeight: 'normal' }}>TestQuery.<b>Bar</b></code>](#)<Bullet />[\`String\`](/scalars/string) <Badge class="badge badge--deprecated badge--secondary" text="deprecated"/> <Badge class="badge badge--secondary" text="scalar"/> 
        > 
        > 
        > :::caution DEPRECATED
        > Deprecated
        > :::
        > 
        > 
        > 

        </Details>

        ### Type

        #### [\`Test\`](/objects/test) <Badge class="badge badge--secondary" text="object"/> 
        > 
        > 
        > 
        > 

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
