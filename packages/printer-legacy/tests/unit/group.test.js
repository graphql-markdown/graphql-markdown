jest.mock("@graphql-markdown/utils", () => {
  return {
    string: { toSlug: jest.fn((name) => name) },
    object: { hasProperty: jest.fn() },
    graphql: { getNamedType: jest.fn() },
  };
});

const Utils = require("@graphql-markdown/utils");

const { getGroup } = require("../../src/group");

describe("group", () => {
  afterEach(()=> {
    jest.restoreAllMocks();
})

  describe("getGroup()", () => {
    test("returns empty string if groups not defined", () => {
      const group = getGroup({ name: "FooBaz"}, undefined);
      expect(group).toBe("");
    });

    test("returns empty string if groups is null", () => {
      const group = getGroup({ name: "FooBaz"}, null);
      expect(group).toBe("");
    });

    test("returns group name string if type has group ", () => {
      jest.spyOn(Utils.graphql, "getNamedType").mockReturnValue("FooBaz");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);
      const group = getGroup({ name: "FooBaz"}, { "FooBaz": "Group Test" });
      expect(group).toBe("Group Test");
    });

    test("returns empty string if type not in group ", () => {
      jest.spyOn(Utils.graphql, "getNamedType").mockReturnValue("FooBaz");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(false);
      const group = getGroup({ name: "FooBar"}, { "FooBaz": "Group Test" });
      expect(group).toBe("");
    });
  });
});
