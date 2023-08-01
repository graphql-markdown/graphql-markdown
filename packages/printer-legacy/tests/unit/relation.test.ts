import { GraphQLScalarType } from "graphql/type/definition";

jest.mock("@graphql-markdown/utils", () => {
  return {
    getNamedType: jest.fn(),
    getRelationOfReturn: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
    escapeMDX: jest.fn((s) => s),
    toSlug: jest.fn(),
    pathUrl: jest.fn(),
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

      jest
        .spyOn(Utils, "getRelationOfReturn")
        .mockImplementation(() => ({
          queries: [{ name: "Foo" }],
          interfaces: [{ name: "Bar" }],
          subscriptions: [{ name: "Baz" }],
        }));

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.getRelationOfReturn,
        DEFAULT_OPTIONS,
      );

      expect(relation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="badge badge--secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="badge badge--secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="badge badge--secondary" text="query"/>

            "
          `);
    });

    test("returns empty string if type is undefined", () => {
      expect.hasAssertions();

      const relation = printRelationOf(
        undefined,
        "RelationOf",
        Utils.getRelationOfReturn,
        DEFAULT_OPTIONS
      );

      expect(relation).toBe("");
    });

    test("returns empty string if type is operation", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(Utils, "isOperation").mockImplementation(() => true);

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.getRelationOfReturn,
        DEFAULT_OPTIONS
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation is not a function", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(type, "RelationOf", undefined, DEFAULT_OPTIONS);

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns undefined", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        jest.fn().mockReturnValue(undefined),
        DEFAULT_OPTIONS
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns empty list", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        jest.fn().mockReturnValue([]),
        DEFAULT_OPTIONS
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
