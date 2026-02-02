import { GraphQLScalarType } from "graphql/type";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("graphql");

import type {
  GraphQLOperationType,
  IGetRelation,
  GraphQLSchema,
} from "@graphql-markdown/types";

jest.mock("@graphql-markdown/utils", () => {
  return {
    ...jest.requireActual("@graphql-markdown/utils"),
    escapeMDX: jest.fn((s): string => {
      return s as string;
    }),
    pathUrl: jest.fn(),
    slugify: jest.fn(),
  };
});

import * as GraphQL from "@graphql-markdown/graphql";
jest.mock("@graphql-markdown/graphql", () => {
  return {
    getNamedType: jest.fn(),
    getRelationOfReturn: jest.fn(),
    getRelationOfField: jest.fn(),
    getRelationOfImplementation: jest.fn(),
    getSchemaMap: jest.fn(),
    hasDirective: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isNamedType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
  };
});

import * as Relation from "../../src/relation";
import { DEFAULT_OPTIONS } from "../../src/const/options";

const { getRootTypeLocaleFromString, printRelationOf, printRelations } =
  Relation;

const mockGraphQL = jest.mocked(GraphQL, { shallow: true });

describe("relation", () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
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

      const relation = await printRelationOf(type, "RelationOf", jest.fn(), {
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

      const spy = jest.spyOn(Relation, "printRelationOf");

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });
      const options = { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema };

      mockGraphQL.isNamedType.mockReturnValue(true);
      mockGraphQL.isOperation.mockReturnValue(false);

      printRelations(type, options);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        type,
        "Returned By",
        GraphQL.getRelationOfReturn,
        options,
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        type,
        "Member Of",
        GraphQL.getRelationOfField,
        options,
      );
      expect(spy).toHaveBeenNthCalledWith(
        3,
        type,
        "Implemented By",
        GraphQL.getRelationOfImplementation,
        options,
      );
    });
  });
});
