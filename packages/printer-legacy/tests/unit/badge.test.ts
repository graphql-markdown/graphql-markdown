import type { PrintTypeOptions } from "@graphql-markdown/types";

jest.mock("@graphql-markdown/utils", () => {
  return {
    slugify: jest.fn(),
    escapeMDX: jest.fn(<T>(t: T): T => {
      return t;
    }),
    pathUrl: jest.fn(),
    isEmpty: jest.fn(() => {
      return false;
    }),
  };
});
import * as Utils from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/graphql", () => {
  return {
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
import * as GraphQL from "@graphql-markdown/graphql";

jest.mock("../../src/link", () => {
  return {
    getCategoryLocale: jest.fn(),
  };
});
import * as Link from "../../src/link";

jest.mock("../../src/group", () => {
  return {
    getGroup: jest.fn(),
  };
});
import * as Group from "../../src/group";

import * as Badge from "../../src/badge";

import { DEFAULT_OPTIONS } from "../../src/const/options";

describe("badge", () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("printBadges", () => {
    test("returns a MDX string of Badge components", () => {
      expect.assertions(1);

      jest.spyOn(GraphQL, "isNonNullType").mockReturnValueOnce(true);
      jest.spyOn(Utils, "isEmpty").mockReturnValueOnce(true);

      const badges = Badge.printBadges(
        {},
        { ...DEFAULT_OPTIONS, typeBadges: true },
      );

      expect(badges).toBe('<mark class="gqlmd-mdx-badge">non-null</mark>');
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

      const badges = Badge.printBadges({}, {} as unknown as PrintTypeOptions);

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

      jest.spyOn(GraphQL, "isNonNullType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "non-null", classname: "badge--secondary" },
      ]);
    });

    test("return list badge is type is list", () => {
      expect.assertions(1);

      jest.spyOn(GraphQL, "isListType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { text: "list", classname: "badge--secondary" },
      ]);
    });

    test("return category name as badge is type is subtype", () => {
      expect.assertions(1);

      jest.spyOn(Link, "getCategoryLocale").mockReturnValueOnce("foobar");

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

      const badges = Badge.getTypeBadges(type, { queries: {} });

      expect(badges).toStrictEqual([
        { text: "foobaz", classname: "badge--secondary" },
      ]);
    });
  });
});
