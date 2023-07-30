jest.mock("@graphql-markdown/utils", () => {
  return {
    toSlug: jest.fn(),
    escapeMDX: jest.fn((t) => t),
    pathUrl: jest.fn(),
    hasProperty: jest.fn(),
    isEmpty: jest.fn(() => false),
    isNonNullType: jest.fn(),
    isListType: jest.fn(),
    isOperation: jest.fn(),
    isEnumType: jest.fn(),
    isUnionType: jest.fn(),
    isInterfaceType: jest.fn(),
    isObjectType: jest.fn(),
    isInputType: jest.fn(),
    isScalarType: jest.fn(),
    isDirectiveType: jest.fn(),
    isDeprecated: jest.fn(),
    getNamedType: jest.fn(),
    getConstDirectiveMap: jest.fn(),
  };
});
const Utils = require("@graphql-markdown/utils");

jest.mock("../../src/link", () => {
  return {
    getLinkCategory: jest.fn(),
  };
});
const Link = require("../../src/link");

jest.mock("../../src/group", () => {
  return {
    getGroup: jest.fn(),
  };
});
const Group = require("../../src/group");

const Badge = require("../../src/badge");

describe("badge", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("printBadges", () => {
    test("returns a MDX string of Badge components", () => {
      expect.assertions(1);

      jest.spyOn(Utils.object, "hasProperty").mockReturnValueOnce(true);
      jest.spyOn(Utils.graphql, "isNonNullType").mockReturnValueOnce(true);
      jest.spyOn(Utils.object, "isEmpty").mockReturnValueOnce(true);

      const badges = Badge.printBadges({}, { typeBadges: true });

      expect(badges).toMatchInlineSnapshot(
        `"<Badge class="badge badge--secondary" text="non-null"/>"`,
      );
    });

    test("returns an empty string if typeBadges is not enabled", () => {
      expect.assertions(1);

      jest.spyOn(Utils.object, "hasProperty").mockReturnValueOnce(true);

      const badges = Badge.printBadges({}, { typeBadges: false });

      expect(badges).toBe("");
    });

    test("returns an empty string if no typeBadges option", () => {
      expect.assertions(1);

      jest.spyOn(Utils.object, "hasProperty").mockReturnValueOnce(false);

      const badges = Badge.printBadges({}, {});

      expect(badges).toBe("");
    });

    test("returns an empty string if getTypeBadges returns empty list", () => {
      expect.assertions(1);

      jest.spyOn(Badge, "getTypeBadges").mockReturnValueOnce([]);

      const badges = Badge.printBadges({}, { typeBadges: true });

      expect(badges).toBe("");
    });
  });

  describe("getTypeBadges", () => {
    test("return non-null badge is type is non-null", () => {
      expect.assertions(1);

      jest.spyOn(Utils.graphql, "isNonNullType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "non-null", classname: "badge--secondary" },
      ]);
    });

    test("return list badge is type is list", () => {
      expect.assertions(1);

      jest.spyOn(Utils.graphql, "isListType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "list", classname: "badge--secondary" },
      ]);
    });

    test("return category name as badge is type is subtype", () => {
      expect.assertions(1);

      jest.spyOn(Link, "getLinkCategory").mockReturnValueOnce("foobar");

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "foobar", classname: "badge--secondary" },
      ]);
    });

    test("return group name as badge is type has group", () => {
      expect.assertions(1);

      jest.spyOn(Group, "getGroup").mockReturnValueOnce("foobaz");

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "foobaz", classname: "badge--secondary" },
      ]);
    });
  });
});
