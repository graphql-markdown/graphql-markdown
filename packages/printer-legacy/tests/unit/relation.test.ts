import { GraphQLScalarType } from "graphql/type";

vi.mock("graphql");

import type {
  GraphQLOperationType,
  IGetRelation,
  GraphQLSchema,
} from "@graphql-markdown/types";

vi.mock("@graphql-markdown/utils", async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    escapeMDX: vi.fn((s): string => {
      return s as string;
    }),
    pathUrl: vi.fn(),
    slugify: vi.fn(),
  };
});

import * as GraphQL from "@graphql-markdown/graphql";
vi.mock("@graphql-markdown/graphql", () => {
  return {
    getNamedType: vi.fn(),
    getRelationOfReturn: vi.fn(),
    getRelationOfField: vi.fn(),
    getRelationOfImplementation: vi.fn(),
    getSchemaMap: vi.fn(),
    hasDirective: vi.fn(),
    isDirectiveType: vi.fn(),
    isEnumType: vi.fn(),
    isInputType: vi.fn(),
    isInterfaceType: vi.fn(),
    isNamedType: vi.fn(),
    isObjectType: vi.fn(),
    isOperation: vi.fn(),
    isScalarType: vi.fn(),
    isUnionType: vi.fn(),
  };
});

import * as Relation from "../../src/relation";
import { DEFAULT_OPTIONS } from "../../src/const/options";

const { getRootTypeLocaleFromString, printRelationOf, printRelations } =
  Relation;

const mockGraphQL = vi.mocked(GraphQL);

describe("relation", () => {
  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  describe("printRelationOf()", () => {
    test.concurrent.each([[true], [false]])(
      "returns empty string if type is undefined and isOperation is %p",
      async (isOperationMockedValue: boolean) => {
        expect.hasAssertions();

        mockGraphQL.isNamedType.mockReturnValue(false);
        mockGraphQL.isOperation.mockReturnValue(isOperationMockedValue);

        const relation = await printRelationOf(
          undefined,
          "RelationOf",
          GraphQL.getRelationOfReturn,
          { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
        );

        expect(relation).toBe("");
      },
    );

    test.concurrent.each([[true], [false]])(
      "returns empty string if type is operation and isNamedType is %p",
      async (isNamedTypeMockedValue: boolean) => {
        expect.hasAssertions();

        const type = new GraphQLScalarType({
          name: "String",
          description: "Lorem Ipsum",
        });

        mockGraphQL.isNamedType.mockReturnValue(isNamedTypeMockedValue);
        mockGraphQL.isOperation.mockReturnValue(true);

        const relation = await printRelationOf(
          type,
          "RelationOf",
          GraphQL.getRelationOfReturn,
          { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
        );

        expect(relation).toBe("");
      },
    );

    test("returns empty string if getRelation is not a function", async () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType<string, string>({
        name: "String",
        description: "Lorem Ipsum",
      });

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);

      const relation = await printRelationOf(type, "RelationOf", undefined, {
        ...DEFAULT_OPTIONS,
        schema: {} as GraphQLSchema,
      });

      expect(relation).toBe("");
    });

    test("returns empty string if schema is not defined", async () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);

      const relation = await printRelationOf(type, "RelationOf", vi.fn(), {
        ...DEFAULT_OPTIONS,
        schema: undefined,
      });

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns undefined", async () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);

      const relation = await printRelationOf(
        type,
        "RelationOf",
        (): ReturnType<IGetRelation<unknown>> => {
          return undefined as unknown as ReturnType<IGetRelation<unknown>>;
        },
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns empty map", async () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = await printRelationOf(
        type,
        "RelationOf",
        () => {
          return { objects: [] };
        },
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toBe("");
    });

    test("prints type relations", async () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const getRelationOfReturn: IGetRelation<GraphQLOperationType> = () => {
        return {
          queries: [{ name: "Foo" } as unknown as GraphQLOperationType],
          interfaces: [{ name: "Bar" } as unknown as GraphQLOperationType],
          subscriptions: [{ name: "Baz" } as unknown as GraphQLOperationType],
        };
      };

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);

      const relation = await printRelationOf(
        type,
        "RelationOf",
        getRelationOfReturn,
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toMatchInlineSnapshot(`
"### RelationOf

[\`Bar\`](#)  <mark class="gqlmd-mdx-badge">interface</mark><span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[\`Baz\`](#)  <mark class="gqlmd-mdx-badge">subscription</mark><span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[\`Foo\`](#)  <mark class="gqlmd-mdx-badge">query</mark>

"
`);
    });
  });

  describe("getRootTypeLocaleFromString()", () => {
    test("returns object of local strings from root type string", () => {
      expect.hasAssertions();

      const deprecation = getRootTypeLocaleFromString("queries");

      expect(deprecation).toMatchInlineSnapshot(`
            {
              "plural": "queries",
              "singular": "query",
            }
          `);
    });

    test("returns undefined if not root type know", () => {
      expect.hasAssertions();

      const deprecation = getRootTypeLocaleFromString("unknown");

      expect(deprecation).toBeUndefined();
    });
  });

  describe("printRelations()", () => {
    test("calls printRelationOf() for each type of relation", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });
      const options = { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema };
      const schemaMap = { objects: {} };

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);
      mockGraphQL.getSchemaMap.mockReturnValue(
        schemaMap as unknown as ReturnType<typeof GraphQL.getSchemaMap>,
      );
      mockGraphQL.getRelationOfReturn.mockReturnValue({
        queries: [{ name: "Foo" }],
      } as never);
      mockGraphQL.getRelationOfField.mockReturnValue({
        queries: [{ name: "Bar" }],
      } as never);
      mockGraphQL.getRelationOfImplementation.mockReturnValue({
        queries: [{ name: "Baz" }],
      } as never);

      const relations = printRelations(type, options);

      // `printRelationOf()` is called from within `relation.ts` through its
      // local binding, so a spy on the module namespace cannot intercept it.
      // Assert the three invocations through their observable effects instead:
      // each relation getter is invoked once with the type and the schema map,
      // and each section is rendered, in order, into the returned MDX.
      expect(mockGraphQL.getRelationOfReturn).toHaveBeenCalledExactlyOnceWith(
        type,
        schemaMap,
      );
      expect(mockGraphQL.getRelationOfField).toHaveBeenCalledExactlyOnceWith(
        type,
        schemaMap,
      );
      expect(
        mockGraphQL.getRelationOfImplementation,
      ).toHaveBeenCalledExactlyOnceWith(type, schemaMap);
      expect(relations).toMatchInlineSnapshot(`
"### Returned By

[\`Foo\`](#)  <mark class="gqlmd-mdx-badge">query</mark>

### Member Of

[\`Bar\`](#)  <mark class="gqlmd-mdx-badge">query</mark>

### Implemented By

[\`Baz\`](#)  <mark class="gqlmd-mdx-badge">query</mark>

"
`);
    });
  });
});
