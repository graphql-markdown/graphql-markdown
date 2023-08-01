import { GraphQLNamedType } from "graphql/type/definition";

jest.mock("@graphql-markdown/utils", () => {
  return {
    toSlug: jest.fn(),
    getNamedType: jest.fn(),
  };
});

import * as Utils from "@graphql-markdown/utils";

import { getGroup } from "../../src/group";

describe("group", () => {
  beforeEach(() => {
    jest.spyOn(Utils, "toSlug").mockImplementationOnce((name) => name);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getGroup()", () => {
    test("returns empty string if groups not defined", () => {
      const group = getGroup({ name: "FooBaz" }, undefined, undefined);

      expect(group).toBe("");
    });

    test("returns group name string if type has group", () => {
      jest
        .spyOn(Utils, "getNamedType")
        .mockReturnValue("FooBaz" as unknown as GraphQLNamedType);

      const group = getGroup(
        { name: "FooBaz" },
        { objects: { FooBaz: "Group Test" } },
        "objects",
      );

      expect(group).toBe("Group Test");
    });

    test("returns empty string if type not in group", () => {
      jest
        .spyOn(Utils, "getNamedType")
        .mockReturnValue("FooBaz" as unknown as GraphQLNamedType);

      const group = getGroup(
        { name: "FooBar" },
        { objects: { FooBaz: "Group Test" } },
        "objects",
      );

      expect(group).toBe("");
    });
  });
});
