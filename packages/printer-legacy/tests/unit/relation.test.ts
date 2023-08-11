import type { GraphQLSchema } from "graphql";
import { GraphQLScalarType } from "graphql";

jest.mock("@graphql-markdown/utils", () => {
  return {
    getNamedType: jest.fn(),
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
    toSlug: jest.fn(),
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
    beforeEach(() => {
      jest.mock("graphql");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("prints type relations", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(Utils, "isNamedType").mockReturnValueOnce(true);
      jest.spyOn(Utils, "getRelationOfReturn").mockImplementation(() => ({
        queries: [{ name: "Foo" }],
        interfaces: [{ name: "Bar" }],
        subscriptions: [{ name: "Baz" }],
      }));

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.getRelationOfReturn,
        { ...DEFAULT_OPTIONS, schema: {} as GraphQLSchema },
      );

      expect(relation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="badge badge--secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="badge badge--secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="badge badge--secondary" text="query"/>

            "
          `);
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
        jest.fn().mockReturnValue(undefined),
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
        jest.fn().mockReturnValue({ objects: [] }),
        DEFAULT_OPTIONS,
      );

      expect(relation).toBe("");
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
