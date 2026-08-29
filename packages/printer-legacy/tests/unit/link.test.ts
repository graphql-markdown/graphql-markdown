import {
  GraphQLList,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLScalarType,
} from "graphql/type";

import type { ConstDirectiveNode } from "graphql/language";
import { DirectiveLocation, Kind } from "graphql/language";

import type {
  PrintLinkOptions,
  PrintTypeOptions,
  TypeLocale,
  GraphQLNamedType,
  ApiGroupOverrideType,
} from "@graphql-markdown/types";

import * as Utils from "@graphql-markdown/utils";
vi.mock("@graphql-markdown/utils", async (importOriginal) => {
  return {
    ...(await importOriginal<Record<string, unknown>>()),
    slugify: vi.fn(),
    pathUrl: (await import("node:path")).posix,
  };
});
const mockUtils = vi.mocked(Utils);

import * as GraphQL from "@graphql-markdown/graphql";
vi.mock("@graphql-markdown/graphql", () => {
  return {
    executableDirectiveLocation: vi.fn(),
    getNamedType: vi.fn(),
    getTypeName: vi.fn(),
    hasDirective: vi.fn(),
    isApiType: vi.fn(),
    isDeprecated: vi.fn(),
    isDirective: vi.fn(),
    isDirectiveType: vi.fn(),
    isEnumType: vi.fn(),
    isInputType: vi.fn(),
    isInterfaceType: vi.fn(),
    isLeafType: vi.fn(),
    isListType: vi.fn(),
    isNonNullType: vi.fn(),
    isObjectType: vi.fn(),
    isOperation: vi.fn(),
    isScalarType: vi.fn(),
    isUnionType: vi.fn(),
  };
});
const mockGraphQL = vi.mocked(GraphQL);

const { hasDirective: actualHasDirective } = await vi.importActual<
  typeof GraphQL
>("@graphql-markdown/graphql");

import { DEFAULT_OPTIONS, TypeHierarchy } from "../../src/const/options";

import * as Group from "../../src/group";
vi.mock("../../src/group", () => {
  return {
    getGroup: vi.fn(() => {
      return "";
    }),
  };
});
const mockGroup = vi.mocked(Group);

import * as Link from "../../src/link";

describe("link", () => {
  const basePath: string = "docs/graphql";

  enum TypeGuard {
    DIRECTIVE = "isDirectiveType",
    ENUM = "isEnumType",
    INPUT = "isInputType",
    INTERFACE = "isInterfaceType",
    OBJECT = "isObjectType",
    SCALAR = "isScalarType",
    UNION = "isUnionType",
    OPERATION = "isOperation",
  }

  const types = [
    {
      name: "Directive",
      guard: TypeGuard.DIRECTIVE,
    },
    {
      name: "Enum",
      guard: TypeGuard.ENUM,
    },
    {
      name: "Input",
      guard: TypeGuard.INPUT,
    },
    {
      name: "Interface",
      guard: TypeGuard.INTERFACE,
    },
    {
      name: "Object",
      guard: TypeGuard.OBJECT,
    },
    {
      name: "Scalar",
      guard: TypeGuard.SCALAR,
    },
    {
      name: "Union",
      guard: TypeGuard.UNION,
    },
    {
      name: "Operation",
      guard: TypeGuard.OPERATION,
      operation: { singular: "query", plural: "queries" } as TypeLocale,
    },
  ];

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  /**
   * `hasPrintableDirective()` is called from within `link.ts` through its local
   * binding, so a spy on the module namespace cannot intercept it. Drive its
   * outcome through its only external dependency instead: `skipDocDirectives`
   * and `onlyDocDirectives` both default to `[]`, and only the "only" lookup is
   * called with `all === true`.
   */
  const mockPrintableDirective = (printable: boolean): void => {
    mockGraphQL.hasDirective.mockImplementation(
      (...args: unknown[]): boolean => {
        return printable && args[2] === true;
      },
    );
  };

  describe("getLinkCategoryFolder()", () => {
    test.each(types)(
      "returns a category object matching the graphLQLNamedType $name",
      ({ guard }: { guard: TypeGuard }) => {
        expect.assertions(1);

        mockGraphQL[guard].mockReturnValueOnce(true);

        const category = Link.getLinkCategoryFolder(
          {} as unknown as GraphQLNamedType,
        );

        expect(category).toMatchSnapshot();
      },
    );

    test("returns undefined if unknown", () => {
      expect.assertions(1);

      const category = Link.getLinkCategoryFolder(
        {} as unknown as GraphQLNamedType,
      );

      expect(category).toBeUndefined();
    });
  });

  describe("toLink()", () => {
    beforeEach(() => {
      mockGroup.getGroup.mockReturnValue("");
      mockPrintableDirective(true);
    });

    test.each(types)(
      "returns markdown link for GraphQL $name",
      ({
        name,
        guard,
        operation,
      }: {
        name: string;
        guard: TypeGuard;
        operation?: TypeLocale;
      }) => {
        expect.hasAssertions();

        const entityName = `Test${name}`;
        const slug = `test-${name.toLowerCase()}`;
        const type = new GraphQLDirective({
          name: entityName,
          locations: [],
        });

        mockGraphQL.getNamedType.mockReturnValue(
          entityName as unknown as GraphQLNamedType,
        );
        mockGraphQL[guard].mockReturnValueOnce(true);
        mockGraphQL.isApiType.mockReturnValue(true);
        mockUtils.slugify.mockReturnValue(slug);

        const link = Link.toLink(type, entityName, operation, {
          ...DEFAULT_OPTIONS,
          basePath,
        });

        expect(link).toMatchSnapshot();
      },
    );

    test("returns markdown link surrounded by [] for GraphQL list/array", () => {
      expect.hasAssertions();

      const entityName = "TestObjectList";
      const slug = "test-object-list";
      const type = new GraphQLList(
        new GraphQLObjectType({
          name: entityName,
          fields: {},
        }),
      );

      mockGraphQL.getNamedType.mockReturnValueOnce(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isObjectType.mockReturnValueOnce(true);
      mockGraphQL.isApiType.mockReturnValueOnce(false);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestObjectList",
          "url": "docs/graphql/types/objects/test-object-list",
        }
      `);
    });

    test("returns plain text for unknown entities", () => {
      expect.hasAssertions();

      const type = "any";
      const entityName = "fooBar";
      const slug = "foobar";

      mockUtils.slugify.mockReturnValueOnce(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "id": "foobar",
          "text": "fooBar",
          "url": "#",
        }
      `);
    });

    test("returns parent-qualified id for unknown entities when parentType is provided", () => {
      expect.hasAssertions();

      const type = "any";
      const entityName = "id";

      mockUtils.slugify.mockReturnValueOnce("query-user-id");

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
        parentType: "Query.user",
      });

      expect(mockUtils.slugify).toHaveBeenCalledWith("Query.user.id");
      expect(link).toMatchInlineSnapshot(`
        {
          "id": "query-user-id",
          "text": "id",
          "url": "#",
        }
      `);
    });

    test("returns plain text for type without printable directive", () => {
      expect.hasAssertions();

      const entityName = `Test`;
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });
      const slug = `test`;

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL[TypeGuard.DIRECTIVE].mockReturnValue(true);
      mockPrintableDirective(false);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "id": "test",
          "text": "Test",
          "url": "#",
        }
      `);
    });

    test("returns markdown link with group in path", () => {
      expect.hasAssertions();

      const entityName = `TestDirective`;
      const slug = `test-directive`;
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isDirectiveType.mockReturnValueOnce(true);
      mockGraphQL.isApiType.mockReturnValueOnce(true);
      mockUtils.slugify.mockReturnValue(slug);
      mockGroup.getGroup.mockReturnValueOnce("group");

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
        groups: {},
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/group/operations/directives/test-directive",
        }
      `);
    });

    test("returns markdown link with nested operation namespace path", () => {
      expect.hasAssertions();

      const entityName = "analytics.aggregateTournaments";
      const type = {
        name: "aggregateTournaments",
        type: {
          name: "AggregateGroup",
        },
      };

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isOperation.mockReturnValue(true);
      mockGraphQL.isApiType.mockReturnValue(true);
      mockUtils.slugify.mockImplementation((value: unknown) => {
        return value === "aggregateTournaments"
          ? "aggregate-tournaments"
          : String(value);
      });

      const link = Link.toLink(
        type,
        entityName,
        { singular: "query", plural: "queries" },
        {
          ...DEFAULT_OPTIONS,
          basePath,
        },
      );

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "analytics.aggregateTournaments",
          "url": "docs/graphql/operations/queries/analytics/aggregate-tournaments",
        }
      `);
    });

    test("keeps operation namespace folders independent from category formatter", () => {
      expect.hasAssertions();

      const entityName = "analytics.aggregateTournaments";
      const type = {
        name: "aggregateTournaments",
        type: {
          name: "AggregateGroup",
        },
      };

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isOperation.mockReturnValue(true);
      mockGraphQL.isApiType.mockReturnValue(true);
      mockUtils.slugify.mockImplementation((value: unknown) => {
        if (value === "aggregateTournaments") {
          return "aggregate-tournaments";
        }
        if (value === "analytics") {
          return "analytics";
        }
        return String(value);
      });

      const link = Link.toLink(
        type,
        entityName,
        { singular: "query", plural: "queries" },
        {
          ...DEFAULT_OPTIONS,
          basePath,
          formatCategoryFolderName: (folder: string) => {
            return folder === "analytics" ? "99-analytics" : folder;
          },
        },
      );

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "analytics.aggregateTournaments",
          "url": "docs/graphql/operations/queries/analytics/aggregate-tournaments",
        }
      `);
    });

    test("returns markdown link with deprecated in path", () => {
      expect.hasAssertions();

      const entityName = `TestDirective`;
      const slug = `test-directive`;
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isDirectiveType.mockReturnValueOnce(true);
      mockGraphQL.isApiType.mockReturnValueOnce(true);
      mockUtils.slugify.mockReturnValue(slug);
      mockGraphQL.isDeprecated.mockReturnValue(true);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        deprecated: "group",
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/deprecated/operations/directives/test-directive",
        }
      `);
    });

    test("returns markdown link without api group when disabled", () => {
      expect.hasAssertions();

      const entityName = `TestDirective`;
      const slug = `test-directive`;
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isDirectiveType.mockReturnValueOnce(true);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
        hierarchy: { [TypeHierarchy.ENTITY]: {} },
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/directives/test-directive",
        }
      `);
    });

    test("returns markdown link without folder when hierarchy is flat", () => {
      expect.hasAssertions();

      const entityName = `TestDirective`;
      const slug = `test-directive`;
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isDirectiveType.mockReturnValueOnce(true);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
        hierarchy: { [TypeHierarchy.FLAT]: {} },
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/test-directive",
        }
      `);
    });
  });

  describe("printLinkAttributes()", () => {
    test.each([[null], [undefined]])(
      "returns default text when set if type is %p",
      (value) => {
        expect.hasAssertions();

        const text = "foobar";

        expect(Link.printLinkAttributes(value, text)).toBe(text);
      },
    );

    test.each([[null], [undefined]])(
      "returns empty text if type is %p",
      (value) => {
        expect.hasAssertions();

        expect(Link.printLinkAttributes(value)).toBe("");
      },
    );

    test("calls recursively if not a leaf node", () => {
      expect.hasAssertions();

      mockGraphQL.isLeafType.mockReturnValueOnce(false);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(text);
    });

    test("returns a format [text] if type is list", () => {
      expect.hasAssertions();

      mockGraphQL.isListType.mockReturnValueOnce(true);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(`[${text}]`);
    });

    test("returns a format text! if type is non-null", () => {
      expect.hasAssertions();

      mockGraphQL.isNonNullType.mockReturnValueOnce(true);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(`${text}!`);
    });
  });

  describe("printLink()", () => {
    /**
     * `toLink()`, `hasOptionWithAttributes()` and `printLinkAttributes()` are
     * called from within `link.ts` through their local bindings, so a spy on
     * the module namespace cannot intercept them. `printLink()` accepts an
     * already resolved `TypeLink` as its first argument (see `isLinkType()`),
     * so the link `toLink()` used to be stubbed to return is passed in
     * directly, and the attributes/parent-type branches are driven through the
     * `withAttributes` / `parentTypePrefix` options instead.
     */
    test("returns formatted markdown link", () => {
      expect.hasAssertions();

      const result = Link.printLink(
        { text: "foo", url: "/bar" },
        DEFAULT_OPTIONS,
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">foo</code></span>](/bar)',
      );
    });

    test("returns formatted markdown link parentType", () => {
      expect.hasAssertions();

      const result = Link.printLink(
        { text: "foo", url: "/bar" },
        { ...DEFAULT_OPTIONS, parentTypePrefix: true, parentType: "baz" },
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">baz</code>.<code class="gqlmd-mdx-entity-name">foo</code></span>](/bar)',
      );
    });

    test("returns formatted markdown link withAttributes", () => {
      expect.hasAssertions();

      // The attributes decoration is produced by `printLinkAttributes()`, which
      // is driven here through the mocked `isListType()` type guard.
      mockGraphQL.isListType.mockReturnValueOnce(true);

      const result = Link.printLink(
        { text: "foo", url: "/bar" },
        { ...DEFAULT_OPTIONS, withAttributes: true },
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[foo]</code></span>](/bar)',
      );
    });

    test("does not include section header id in hash link when disabled", () => {
      expect.hasAssertions();

      const result = Link.printLink(
        {
          id: "foo-id",
          text: "foo",
          url: "#",
        },
        { ...DEFAULT_OPTIONS, sectionHeaderId: false },
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">foo</code></span>](#)',
      );
    });
  });

  describe("hasOptionWithAttributes()", () => {
    test("returns false when options has no prop withAttributes", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionWithAttributes({} as unknown as PrintLinkOptions),
      ).toBeFalsy();
    });

    test("returns false when options withAttributes is false", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionWithAttributes({
          ...DEFAULT_OPTIONS,
          withAttributes: false,
        }),
      ).toBeFalsy();
    });

    test("returns true when options withAttributes is true", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionWithAttributes({
          ...DEFAULT_OPTIONS,
          withAttributes: true,
        }),
      ).toBeTruthy();
    });
  });

  describe("hasOptionParentType()", () => {
    test("returns false when options has no prop parentTypePrefix", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionParentType({} as unknown as PrintLinkOptions),
      ).toBeFalsy();
    });

    test("returns false when options parentTypePrefix is false", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionParentType({
          ...DEFAULT_OPTIONS,
          parentTypePrefix: false,
          parentType: "not null",
        }),
      ).toBeFalsy();
    });

    test("returns false when options has no prop parentType", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionParentType({
          parentTypePrefix: true,
        } as unknown as PrintLinkOptions),
      ).toBeFalsy();
    });

    test("returns false when options parentType is %p", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionParentType({
          ...DEFAULT_OPTIONS,
          parentTypePrefix: true,
          parentType: undefined,
        }),
      ).toBeFalsy();
    });

    test("returns true when options parentTypePrefix is true with parentType defined", () => {
      expect.hasAssertions();

      expect(
        Link.hasOptionParentType({
          ...DEFAULT_OPTIONS,
          parentTypePrefix: true,
          parentType: "not null",
        }),
      ).toBeTruthy();
    });
  });

  describe("printParentLink()", () => {
    test("returns a MDX Bullet component with parent link if type defined", () => {
      expect.hasAssertions();

      // `printLink()` is called from within `link.ts` through its local
      // binding, so a namespace spy cannot intercept it. Feed the parent type
      // an already resolved `TypeLink` instead, so the real `printLink()`
      // renders it and the bullet wrapper stays observable.
      expect(
        Link.printParentLink(
          { type: { text: "foo", url: "/bar" } },
          DEFAULT_OPTIONS,
        ),
      ).toMatchInlineSnapshot(
        `"<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">foo</code></span>](/bar)"`,
      );
    });

    test("returns an empty string if parent link undefined", () => {
      expect.hasAssertions();

      expect(Link.printParentLink({}, DEFAULT_OPTIONS)).toBe("");
    });
  });

  describe("getRelationLink()", () => {
    test("returns a link object from a relation type", () => {
      expect.hasAssertions();

      const entityName = "TestScalar";
      const slug = "test-scalar";
      const type = new GraphQLScalarType({
        name: entityName,
      });

      mockPrintableDirective(true);

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isScalarType.mockReturnValue(true);
      mockGraphQL.isApiType.mockReturnValueOnce(false);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.getRelationLink("foo", type, {
        ...DEFAULT_OPTIONS,
        basePath: "docs/graphql",
      });

      expect(link).toStrictEqual({
        text: "TestScalar",
        url: "docs/graphql/types/scalars/test-scalar",
      });
    });

    test("returns undefined if category not defined", () => {
      expect.hasAssertions();

      const entityName = "TestScalar";
      const slug = "test-scalar";
      const type = new GraphQLScalarType({
        name: entityName,
      });

      mockGraphQL.getNamedType.mockReturnValueOnce(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isScalarType.mockReturnValueOnce(true);
      mockUtils.slugify.mockReturnValue(slug);

      const link = Link.getRelationLink(undefined, type, {
        ...DEFAULT_OPTIONS,
        basePath: "docs/graphql",
      });

      expect(link).toBeUndefined();
    });
  });

  describe("getLinkApiGroupFolder()", () => {
    test.each([[null], [undefined], [false], [{}], [true]])(
      "returns default folders if %s",
      (apiGroupOption) => {
        expect.hasAssertions();

        vi.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
        expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
          Link.API_GROUPS.operations,
        );

        vi.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
        expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
          Link.API_GROUPS.types,
        );
      },
    );
    test("overrides default names", () => {
      expect.hasAssertions();

      const apiGroupOption: ApiGroupOverrideType = {
        operations: "api",
        types: "entities",
      };

      vi.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
      expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
        apiGroupOption.operations,
      );

      vi.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
      expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
        apiGroupOption.types,
      );
    });
  });

  describe("hasPrintableDirective()", () => {
    const noDocDirective = new GraphQLDirective({
      name: "noDoc",
      locations: [DirectiveLocation.ENUM],
      astNode: {
        kind: Kind.DIRECTIVE_DEFINITION,
        name: { kind: Kind.NAME, value: "noDoc" },
        repeatable: false,
        locations: [],
      },
    });
    const publicDirective = new GraphQLDirective({
      name: "public",
      locations: [DirectiveLocation.ENUM],
      astNode: {
        kind: Kind.DIRECTIVE_DEFINITION,
        name: { kind: Kind.NAME, value: "public" },
        repeatable: false,
        locations: [],
      },
    });
    const docDirective = new GraphQLDirective({
      name: "doc",
      locations: [DirectiveLocation.OBJECT],
      astNode: {
        kind: Kind.DIRECTIVE_DEFINITION,
        name: { kind: Kind.NAME, value: "doc" },
        repeatable: false,
        locations: [],
      },
    });
    const enumType = new GraphQLEnumType({
      name: "test",
      values: {
        RED: { value: 0 },
        GREEN: { value: 1 },
        BLUE: { value: 2 },
      },
      astNode: {
        kind: Kind.ENUM_TYPE_DEFINITION,
        name: { kind: Kind.NAME, value: "test" },
        directives: [
          {
            ...publicDirective.astNode,
            kind: Kind.DIRECTIVE,
          } as ConstDirectiveNode,
        ],
      },
    });

    test.each([
      { options: undefined },
      {
        options: {
          skipDocDirectives: undefined,
          onlyDocDirectives: undefined,
          deprecated: undefined,
        },
      },
      {
        options: {},
      },
    ])("return true if no option set", ({ options }) => {
      expect.assertions(1);

      expect(
        Link.hasPrintableDirective({}, options as unknown as PrintTypeOptions),
      ).toBeTruthy();
    });

    test("return false if type undefined", () => {
      expect.assertions(1);

      expect(Link.hasPrintableDirective(undefined, {})).toBeFalsy();
    });

    test("return false if type has skip directive", () => {
      expect.assertions(1);

      const options = {
        skipDocDirectives: [noDocDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockReturnValue(true);

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });

    test("return true if type has not skip directive", () => {
      expect.assertions(1);

      const options = {
        skipDocDirectives: [noDocDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockReturnValue(false);

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return false if type has skip deprecated", () => {
      expect.assertions(1);

      const options = {
        deprecated: "skip",
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(true);
      mockGraphQL.hasDirective.mockReturnValue(true);

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });

    test("return true if type has not skip deprecated", () => {
      expect.assertions(1);

      const options = {
        deprecated: "default",
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(true);
      mockGraphQL.hasDirective.mockReturnValue(true);

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return true if type has only directive", () => {
      expect.assertions(1);

      const options = {
        onlyDocDirectives: [publicDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockImplementation(actualHasDirective);

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return false if type has not only directive and type is a valid location", () => {
      expect.assertions(1);

      const options = {
        onlyDocDirectives: [noDocDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockImplementation(actualHasDirective);

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });

    test("return true if type has not only directive and type is not a valid location", () => {
      expect.assertions(1);

      const options = {
        onlyDocDirectives: [docDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockImplementation(actualHasDirective);

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return false if type has only directive and skip deprecated", () => {
      expect.assertions(1);

      const options = {
        deprecated: "skip",
        onlyDocDirectives: [publicDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(true);
      mockGraphQL.hasDirective.mockImplementation(actualHasDirective);

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });
  });
});
