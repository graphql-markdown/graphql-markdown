jest.mock("@graphql-markdown/utils", () => {
  return {
    string: { toSlug: jest.fn() },
    url: { pathUrl: require("path").posix },
    object: { hasProperty: jest.fn() },
    graphql: {
      hasDirective: jest.fn(),
      getTypeName: jest.fn(),
      getNamedType: jest.fn(),
      isOperation: jest.fn(),
      isEnumType: jest.fn(),
      isUnionType: jest.fn(),
      isInterfaceType: jest.fn(),
      isObjectType: jest.fn(),
      isInputType: jest.fn(),
      isScalarType: jest.fn(),
      isDirectiveType: jest.fn(),
      isLeafType: jest.fn(),
      isListType: jest.fn(),
      isNonNullType: jest.fn(),
    },
  };
});
const Utils = require("@graphql-markdown/utils");

jest.mock("../../src/group", () => {
  return { getGroup: jest.fn() };
});
const Group = require("../../src/group");

const { GraphQLList, GraphQLDirective, GraphQLObjectType } = require("graphql");

const { DEFAULT_OPTIONS } = require("../../src/printer");

const Link = require("../../src/link");

describe("link", () => {
  const basePath = "docs/graphql";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getLinkCategory()", () => {
    const types = [
      {
        name: "Directive",
        guard: "isDirectiveType",
      },
      {
        name: "Enum",
        guard: "isEnumType",
      },
      {
        name: "Input",
        guard: "isInputType",
      },
      {
        name: "Interface",
        guard: "isInterfaceType",
      },
      {
        name: "Object",
        guard: "isObjectType",
      },
      {
        name: "Scalar",
        guard: "isScalarType",
      },
      {
        name: "Union",
        guard: "isUnionType",
      },
      {
        name: "Operation",
        guard: "isOperation",
      },
    ];

    test.each(types)(
      "returns a category object matching the graphLQLNamedType $name",
      ({ guard }) => {
        jest.spyOn(Utils.graphql, guard).mockReturnValueOnce(true);

        const category = Link.getLinkCategory({});

        expect(category).toMatchSnapshot();
      },
    );

    test("returns undefined if unknown", () => {
      const category = Link.getLinkCategory({});

      expect(category).toBeUndefined();
    });
  });

  describe("toLink()", () => {
    beforeEach(() => {
      jest.spyOn(Group, "getGroup").mockReturnValue("");
    });

    test("returns markdown link for GraphQL directive", () => {
      expect.hasAssertions();

      const entityName = "TestDirective";
      const slug = "test-directive";
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      jest.spyOn(Utils.graphql, "getNamedType").mockReturnValue(entityName);
      jest.spyOn(Utils.graphql, "isDirectiveType").mockReturnValue(true);
      jest.spyOn(Utils.string, "toSlug").mockReturnValueOnce(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/directives/test-directive",
        }
      `);
    });

    test("returns markdown link surrounded by [] for GraphQL list/array", () => {
      expect.hasAssertions();

      const entityName = "TestObjectList";
      const slug = "test-object-list";
      const type = new GraphQLList(
        new GraphQLObjectType({
          name: entityName,
        }),
      );

      jest.spyOn(Utils.graphql, "getNamedType").mockReturnValue(entityName);
      jest.spyOn(Utils.graphql, "isObjectType").mockReturnValue(true);
      jest.spyOn(Utils.string, "toSlug").mockReturnValueOnce(slug);

      const link = Link.toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestObjectList",
          "url": "docs/graphql/objects/test-object-list",
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

      jest.spyOn(Utils.graphql, "isLeafType").mockReturnValueOnce(false);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(text);
    });

    test("returns a format [text] if type is list", () => {
      expect.hasAssertions();

      jest.spyOn(Utils.graphql, "isListType").mockReturnValueOnce(true);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(`[${text}]`);
    });

    test("returns a format text! if type is non-null", () => {
      expect.hasAssertions();

      jest.spyOn(Utils.graphql, "isNonNullType").mockReturnValueOnce(true);

      const type = { ofType: "test" };
      const text = "baz";

      const result = Link.printLinkAttributes(type, text);

      expect(result).toBe(`${text}!`);
    });
  });

  describe("printLink()", () => {});

  describe("printParentLink()", () => {});
});
