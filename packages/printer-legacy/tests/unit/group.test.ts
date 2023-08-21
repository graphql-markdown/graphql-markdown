import type { GraphQLNamedType } from "graphql/type/definition";

jest.mock("@graphql-markdown/graphql", () => {
  return {
    ...jest.requireActual("@graphql-markdown/graphql"),
    getNamedType: jest.fn(),
  };
});

import * as GraphQL from "@graphql-markdown/graphql";

import { getGroup } from "../../src/group";

describe("group", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("getGroup()", () => {
    test("returns empty string if groups not defined", () => {
      const group = getGroup({ name: "FooBaz" }, undefined, "objects");

      expect(group).toBe("");
    });

    test.each([[undefined], [null]])(
      "returns empty string if type is %s",
      (value) => {
        const group = getGroup(
          value,
          { objects: { FooBaz: "Group Test" } },
          "objects",
        );

        expect(group).toBe("");
      },
    );

    test("returns empty string if typeCategory not defined", () => {
      const group = getGroup(
        { name: "FooBaz" },
        { objects: { FooBaz: "Group Test" } },
        undefined,
      );

      expect(group).toBe("");
    });

    test.each([[{ name: "FooBaz" }], [{ toString: (): string => "FooBaz" }]])(
      "returns group name string if type has group",
      (type) => {
        jest
          .spyOn(GraphQL, "getNamedType")
          .mockReturnValue({ name: "FooBaz" } as unknown as GraphQLNamedType);

        const group = getGroup(
          type,
          { objects: { FooBaz: "Group Test" } },
          "objects",
        );

        expect(group).toBe("group-test");
      },
    );

    test("returns empty string if type not in group", () => {
      jest
        .spyOn(GraphQL, "getNamedType")
        .mockReturnValue({ name: "FooBar" } as unknown as GraphQLNamedType);

      const group = getGroup(
        { name: "FooBar" },
        { objects: { FooBaz: "Group Test" } },
        "objects",
      );

      expect(group).toBe("");
    });
  });

  test("returns empty string if resolved named type is undefined", () => {
    jest.spyOn(GraphQL, "getNamedType").mockReturnValue(undefined);

    const group = getGroup(
      { name: "FooBar" },
      { objects: { FooBaz: "Group Test" } },
      "objects",
    );

    expect(group).toBe("");
  });
});
