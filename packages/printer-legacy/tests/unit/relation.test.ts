import { GraphQLScalarType } from "graphql/type";
jest.mock("graphql");

import type {
  GraphQLOperationType,
  IGetRelation,
  GraphQLSchema,
} from "@graphql-markdown/types";

jest.mock("@graphql-markdown/utils", () => {
  return {
    escapeMDX: jest.fn((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return s;
    }),
    pathUrl: jest.fn(),
    slugify: jest.fn(),
  };
});

jest.mock("@graphql-markdown/graphql", () => {
  return {
    getNamedType: jest.fn((t) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return t;
    }),
    getRelationOfReturn: jest.fn(),
    getRelationOfField: jest.fn(),
    getRelationOfImplementation: jest.fn(),
    getSchemaMap: jest.fn(),
    hasDirective: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isNamedType: jest.fn(() => {
      return true;
    }),
    isObjectType: jest.fn(),
    isOperation: jest.fn(() => {
      return false;
    }),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

import * as Relation from "../../src/relation";
import { DEFAULT_OPTIONS } from "../../src/const/options";

const { getRootTypeLocaleFromString, printRelationOf, printRelations } =
  Relation;

describe("relation", () => {
  describe("printRelationOf()", () => {
    afterAll(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    test.concurrent.each([[true], [false]])(
      "returns empty string if type is undefined and isOperation is %p",
      (isOperationMockedValue: boolean) => {
        expect.hasAssertions();

        jest.spyOn(GraphQL, "isNamedType").mockReturnValueOnce(false);
        jest
          .spyOn(GraphQL, "isOperation")
          .mockReturnValueOnce(isOperationMockedValue);

        const relation = printRelationOf(
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
      (isNamedTypeMockedValue: boolean) => {
        expect.hasAssertions();

        const type = new GraphQLScalarType({
          name: "String",
          description: "Lorem Ipsum",
        });

        jest
          .spyOn(GraphQL, "isNamedType")
          .mockReturnValueOnce(isNamedTypeMockedValue);
        jest.spyOn(GraphQL, "isOperation").mockReturnValueOnce(true);

        const relation = printRelationOf(
          type,
          "RelationOf",
          GraphQL.getRelationOfReturn,
          { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
        );

        expect(relation).toBe("");
      },
    );

    test("returns empty string if getRelation is not a function", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType<string, string>({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(type, "RelationOf", undefined, {
        ...DEFAULT_OPTIONS,
        schema: {} as GraphQLSchema,
      });

      expect(relation).toBe("");
    });

    test("returns empty string if schema is not defined", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(type, "RelationOf", jest.fn(), {
        ...DEFAULT_OPTIONS,
        schema: undefined,
      });

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns undefined", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(GraphQL, "isNamedType").mockReturnValueOnce(true);
      jest.spyOn(GraphQL, "isOperation").mockReturnValueOnce(false);

      const relation = printRelationOf(
        type,
        "RelationOf",
        (): ReturnType<IGetRelation<unknown>> => {
          return undefined as unknown as ReturnType<IGetRelation<unknown>>;
        },
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns empty map", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        () => {
          return { objects: [] };
        },
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toBe("");
    });

    test("prints type relations", () => {
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

      jest.spyOn(GraphQL, "isNamedType").mockReturnValue(true);

      const relation = printRelationOf(
        type,
        "RelationOf",
        getRelationOfReturn,
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="badge badge--secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="badge badge--secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="badge badge--secondary" text="query"/>

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

      jest.spyOn(GraphQL, "isNamedType").mockReturnValue(true);

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
