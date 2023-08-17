import type { GraphQLSchema } from "graphql";
import { GraphQLScalarType } from "graphql";
jest.mock("graphql");

import type { IGetRelation } from "@graphql-markdown/types";

jest.mock("@graphql-markdown/utils", () => {
  return {
    getNamedType: jest.fn((t) => t),
    getRelationOfReturn: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(() => false),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
    escapeMDX: jest.fn((s) => s),
    slugify: jest.fn(),
    pathUrl: jest.fn(),
    isNamedType: jest.fn(() => true),
    hasDirective: jest.fn(),
  };
});
import * as Utils from "@graphql-markdown/utils";

import {
  printRelationOf,
  getRootTypeLocaleFromString,
} from "../../src/relation";
import { DEFAULT_OPTIONS } from "../../src/const/options";

describe("relation", () => {
  describe("printRelationOf()", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("returns empty string if type is undefined", () => {
      expect.hasAssertions();

      jest.spyOn(Utils, "isNamedType").mockReturnValueOnce(false);

      const relation = printRelationOf(
        undefined,
        "RelationOf",
        Utils.getRelationOfReturn,
        DEFAULT_OPTIONS,
      );

      expect(relation).toBe("");
    });

    test("returns empty string if type is operation", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(Utils, "isOperation").mockReturnValueOnce(true);

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.getRelationOfReturn,
        DEFAULT_OPTIONS,
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation is not a function", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType<string, string>({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        undefined,
        DEFAULT_OPTIONS,
      );

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

      jest.spyOn(Utils, "isNamedType").mockReturnValueOnce(true);

      const relation = printRelationOf(
        type,
        "RelationOf",
        () => undefined,
        DEFAULT_OPTIONS,
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
        () => ({ objects: [] }),
        DEFAULT_OPTIONS,
      );

      expect(relation).toBe("");
    });

    test("prints type relations", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const getRelationOfReturn: IGetRelation<
        Record<string, unknown[]>
      > = () => ({
        queries: [{ name: "Foo" }],
        interfaces: [{ name: "Bar" }],
        subscriptions: [{ name: "Baz" }],
      });

      jest.spyOn(Utils, "isNamedType").mockReturnValue(true);

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
});
