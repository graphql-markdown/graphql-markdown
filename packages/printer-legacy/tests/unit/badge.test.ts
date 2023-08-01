jest.mock("@graphql-markdown/utils", () => {
  return {
    toSlug: jest.fn(),
    escapeMDX: jest.fn((t) => t),
    pathUrl: jest.fn(),
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
import * as Utils from "@graphql-markdown/utils";

jest.mock("../../src/link", () => {
  return {
    getLinkCategory: jest.fn(),
  };
});
import { Link } from "../../src/link";

jest.mock("../../src/group", () => {
  return {
    getGroup: jest.fn(),
  };
});
import * as Group from "../../src/group";

import * as Badge from "../../src/badge";

import { DEFAULT_OPTIONS, Options } from "../../src/const/options";

describe("badge", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("printBadges", () => {
    test("returns a MDX string of Badge components", () => {
      expect.assertions(1);

      jest.spyOn(Utils, "isNonNullType").mockReturnValueOnce(true);
      jest.spyOn(Utils, "isEmpty").mockReturnValueOnce(true);

      const badges = Badge.printBadges(
        {},
        { ...DEFAULT_OPTIONS, typeBadges: true },
      );

      expect(badges).toMatchInlineSnapshot(
        `"<Badge class="badge badge--secondary" text="non-null"/>"`,
      );
    });

    test("returns an empty string if typeBadges is not enabled", () => {
      expect.assertions(1);

      const badges = Badge.printBadges(
        {},
        { ...DEFAULT_OPTIONS, typeBadges: false },
      );

      expect(badges).toBe("");
    });

    test("returns an empty string if no typeBadges option", () => {
      expect.assertions(1);

      const badges = Badge.printBadges({}, {} as unknown as Options);

      expect(badges).toBe("");
    });

    test("returns an empty string if getTypeBadges returns empty list", () => {
      expect.assertions(1);

      jest.spyOn(Badge, "getTypeBadges").mockReturnValueOnce([]);

      const badges = Badge.printBadges(
        {},
        { ...DEFAULT_OPTIONS, typeBadges: true },
      );

      expect(badges).toBe("");
    });
  });

  describe("getTypeBadges", () => {
    test("return non-null badge is type is non-null", () => {
      expect.assertions(1);

      jest.spyOn(Utils, "isNonNullType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "non-null", classname: "badge--secondary" },
      ]);
    });

    test("return list badge is type is list", () => {
      expect.assertions(1);

      jest.spyOn(Utils, "isListType").mockReturnValueOnce(true);

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
