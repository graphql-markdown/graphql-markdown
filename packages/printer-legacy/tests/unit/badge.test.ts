import type { PrintTypeOptions } from "@graphql-markdown/types";

vi.mock("@graphql-markdown/utils", async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    slugify: vi.fn(),
    escapeMDX: vi.fn(<T>(t: T): T => {
      return t;
    }),
    pathUrl: vi.fn(),
    isEmpty: vi.fn(() => {
      return false;
    }),
  };
});
import * as Utils from "@graphql-markdown/utils";

vi.mock("@graphql-markdown/graphql", () => {
  return {
    isNonNullType: vi.fn(),
    isListType: vi.fn(),
    isOperation: vi.fn(),
    isEnumType: vi.fn(),
    isUnionType: vi.fn(),
    isInterfaceType: vi.fn(),
    isObjectType: vi.fn(),
    isInputType: vi.fn(),
    isScalarType: vi.fn(),
    isDirectiveType: vi.fn(),
    isDeprecated: vi.fn(),
    getNamedType: vi.fn(),
    getConstDirectiveMap: vi.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

vi.mock("../../src/link", () => {
  return {
    getCategoryLocale: vi.fn(),
  };
});
import * as Link from "../../src/link";

vi.mock("../../src/group", () => {
  return {
    getGroup: vi.fn(),
  };
});
import * as Group from "../../src/group";

import * as Badge from "../../src/badge";

/**
 * Helper to create PrintTypeOptions with a mock formatMDXBadge function
 */
const createOptionsWithFormatter = (
  options: Partial<PrintTypeOptions> = {},
): PrintTypeOptions => {
  return {
    typeBadges: true,
    groups: undefined,
    formatMDXBadge: (badge) => {
      const classAttr = badge.classname
        ? ` class="gqlmd-mdx-badge ${[badge.classname]
            .flat()
            .map((c) => {
              return `gqlmd-mdx-badge--${c.toLowerCase()}`;
            })
            .join(" ")}"`
        : ' class="gqlmd-mdx-badge"';
      return `<mark${classAttr}>${badge.text as string}</mark>` as any;
    },
    ...options,
  } as PrintTypeOptions;
};

describe("badge", () => {
  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  describe("printBadges", () => {
    test("returns a MDX string of Badge components", () => {
      expect.assertions(1);

      vi.spyOn(GraphQL, "isNonNullType").mockReturnValueOnce(true);
      vi.spyOn(Utils, "isEmpty").mockReturnValueOnce(true);

      const badges = Badge.printBadges({}, createOptionsWithFormatter());

      expect(badges).toBe(
        '<mark class="gqlmd-mdx-badge gqlmd-mdx-badge--non_null">non-null</mark>',
      );
    });

    test("returns an empty string if typeBadges is not enabled", () => {
      expect.assertions(1);

      const badges = Badge.printBadges(
        {},
        createOptionsWithFormatter({
          typeBadges: false,
        }),
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

      // `getTypeBadges()` is called from within `badge.ts` through its local
      // binding, so a spy on the module namespace cannot intercept it (and a
      // stale spy would leak into the following tests). Drive it to return an
      // empty list through its inputs instead: no type guard matches, so no
      // badge is collected.
      vi.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(false);
      vi.spyOn(GraphQL, "isNonNullType").mockReturnValueOnce(false);
      vi.spyOn(GraphQL, "isListType").mockReturnValueOnce(false);
      vi.spyOn(Link, "getCategoryLocale").mockReturnValueOnce(undefined);

      const badges = Badge.printBadges({}, createOptionsWithFormatter());

      expect(badges).toBe("");
    });
  });

  describe("getTypeBadges", () => {
    test("return non-null badge is type is non-null", () => {
      expect.assertions(1);

      vi.spyOn(GraphQL, "isNonNullType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([
        { classname: "NON_NULL", text: "non-null" },
      ]);
    });

    test("return list badge is type is list", () => {
      expect.assertions(1);

      vi.spyOn(GraphQL, "isListType").mockReturnValueOnce(true);

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([{ text: "list" }]);
    });

    test("return category name as badge is type is subtype", () => {
      expect.assertions(1);

      vi.spyOn(Link, "getCategoryLocale").mockReturnValueOnce("foobar");

      const type = {};

      const badges = Badge.getTypeBadges(type);

      expect(badges).toStrictEqual([{ text: "foobar" }]);
    });

    test("return group name as badge is type has group", () => {
      expect.assertions(1);

      vi.spyOn(Group, "getGroup").mockReturnValueOnce("foobaz");

      const type = {};

      const badges = Badge.getTypeBadges(type, { queries: {} });

      expect(badges).toStrictEqual([{ text: "foobaz" }]);
    });
  });
});
