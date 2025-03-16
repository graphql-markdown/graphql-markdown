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
jest.mock("@graphql-markdown/utils", () => {
  return {
    slugify: jest.fn(),
    pathUrl: jest.requireActual("path").posix,
  };
});
const mockUtils = jest.mocked(Utils, { shallow: true });

import * as GraphQL from "@graphql-markdown/graphql";
jest.mock("@graphql-markdown/graphql", () => {
  return {
    executableDirectiveLocation: jest.fn(),
    getNamedType: jest.fn(),
    getTypeName: jest.fn(),
    hasDirective: jest.fn(),
    isApiType: jest.fn(),
    isDeprecated: jest.fn(),
    isDirective: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isLeafType: jest.fn(),
    isListType: jest.fn(),
    isNonNullType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
  };
});
const mockGraphQL = jest.mocked(GraphQL, { shallow: true });

import { DEFAULT_OPTIONS, TypeHierarchy } from "../../src/const/options";

import * as Group from "../../src/group";
jest.mock("../../src/group", () => {
  return {
    getGroup: jest.fn(() => {
      return "";
    }),
  };
});
const mockGroup = jest.mocked(Group, { shallow: true });

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
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("getLinkCategoryFolder()", () => {
    test.each(types)(
      "returns a category object matching the graphLQLNamedType $name",
      ({ guard }) => {
        expect.assertions(1);

        jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);

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
      jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);
    });

    test.each(types)(
      "returns markdown link for GraphQL $name",
      ({ name, guard, operation }) => {
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
        mockUtils.slugify.mockReturnValueOnce(slug);

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
      mockUtils.slugify.mockReturnValueOnce(slug);

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

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "fooBar",
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

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL[TypeGuard.DIRECTIVE].mockReturnValue(true);
      jest.spyOn(Link, "hasPrintableDirective").mockReturnValueOnce(false);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
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
      mockUtils.slugify.mockReturnValueOnce(slug);
      mockGroup.getGroup.mockReturnValueOnce("group");

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
        groups: {},
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/operations/group/directives/test-directive",
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
      mockUtils.slugify.mockReturnValueOnce(slug);
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
      mockUtils.slugify.mockReturnValueOnce(slug);

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
      mockUtils.slugify.mockReturnValueOnce(slug);

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
    test("returns formatted markdown link", () => {
      expect.hasAssertions();

      jest.spyOn(Link, "toLink").mockReturnValue({ text: "foo", url: "/bar" });
      jest.spyOn(Link, "hasOptionWithAttributes").mockReturnValue(false);
      jest.spyOn(Link, "hasOptionParentType").mockReturnValue(false);

      const result = Link.printLink({}, DEFAULT_OPTIONS);

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">foo</code></span>](/bar)',
      );
    });

    test("returns formatted markdown link parentType", () => {
      expect.hasAssertions();

      jest.spyOn(Link, "toLink").mockReturnValue({ text: "foo", url: "/bar" });
      jest.spyOn(Link, "hasOptionWithAttributes").mockReturnValue(false);
      jest.spyOn(Link, "hasOptionParentType").mockReturnValue(true);

      const result = Link.printLink(
        {},
        { ...DEFAULT_OPTIONS, parentTypePrefix: true, parentType: "baz" },
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">baz.</code><code class="gqlmd-mdx-entity-name">foo</code></span>](/bar)',
      );
    });

    test("returns formatted markdown link withAttributes", () => {
      expect.hasAssertions();

      jest.spyOn(Link, "toLink").mockReturnValue({ text: "foo", url: "/bar" });
      jest.spyOn(Link, "hasOptionWithAttributes").mockReturnValue(true);
      jest.spyOn(Link, "printLinkAttributes").mockReturnValue("barfoo");

      const result = Link.printLink(
        {},
        { ...DEFAULT_OPTIONS, withAttributes: true },
      );

      expect(result).toBe(
        '[<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">barfoo</code></span>](/bar)',
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

      jest.spyOn(Link, "printLink").mockReturnValueOnce("[`foo`](/bar)");

      expect(
        Link.printParentLink({ type: "foo" }, DEFAULT_OPTIONS),
      ).toMatchInlineSnapshot(
        `"<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>[\`foo\`](/bar)"`,
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

      jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);

      mockGraphQL.getNamedType.mockReturnValue(
        entityName as unknown as GraphQLNamedType,
      );
      mockGraphQL.isScalarType.mockReturnValue(true);
      mockGraphQL.isApiType.mockReturnValueOnce(false);
      mockUtils.slugify.mockReturnValueOnce(slug);

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
      mockUtils.slugify.mockReturnValueOnce(slug);

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

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
        expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
          Link.API_GROUPS.operations,
        );

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
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

      jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
      expect(Link.getLinkApiGroupFolder({}, apiGroupOption)).toBe(
        apiGroupOption.operations,
      );

      jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
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
      mockGraphQL.hasDirective.mockImplementation(
        jest.requireActual("@graphql-markdown/graphql").hasDirective,
      );

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return false if type has not only directive and type is a valid location", () => {
      expect.assertions(1);

      const options = {
        onlyDocDirectives: [noDocDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockImplementation(
        jest.requireActual("@graphql-markdown/graphql").hasDirective,
      );

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });

    test("return true if type has not only directive and type is not a valid location", () => {
      expect.assertions(1);

      const options = {
        onlyDocDirectives: [docDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(false);
      mockGraphQL.hasDirective.mockImplementation(
        jest.requireActual("@graphql-markdown/graphql").hasDirective,
      );

      expect(Link.hasPrintableDirective(enumType, options)).toBeTruthy();
    });

    test("return false if type has only directive and skip deprecated", () => {
      expect.assertions(1);

      const options = {
        deprecated: "skip",
        onlyDocDirectives: [publicDirective],
      } as unknown as PrintTypeOptions;
      mockGraphQL.isDeprecated.mockReturnValue(true);
      mockGraphQL.hasDirective.mockImplementation(
        jest.requireActual("@graphql-markdown/graphql").hasDirective,
      );

      expect(Link.hasPrintableDirective(enumType, options)).toBeFalsy();
    });
  });
});
