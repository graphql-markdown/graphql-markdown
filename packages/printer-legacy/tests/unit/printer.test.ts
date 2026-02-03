import { posix } from "node:path";

import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLSchema,
  GraphQLString,
} from "graphql/type";

import type { PrintTypeOptions } from "@graphql-markdown/types";

jest.mock("@graphql-markdown/utils", () => {
  return {
    ...jest.requireActual("@graphql-markdown/utils"),
    escapeMDX: jest.fn(),
    formatFrontMatterObject: jest.fn(),
    isEmpty: jest.fn(),
    pathUrl: { join: posix.join },
    slugify: jest.fn(),
  };
});
import * as Utils from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/graphql", () => {
  return {
    getConstDirectiveMap: jest.fn(),
    getTypeName: jest.fn(),
    hasDirective: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

jest.mock("../../src/graphql");
import * as GraphQLPrinter from "../../src/graphql";

jest.mock("../../src/example");
import * as ExamplePrinter from "../../src/example";

import * as Link from "../../src/link";

import { Printer } from "../../src/printer";
import { DEFAULT_OPTIONS, TypeHierarchy } from "../../src/const/options";

import mdxModule from "../../src/mdx";

describe("Printer", () => {
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
      type: new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      }),
      guard: TypeGuard.DIRECTIVE,
      printCode: "printCodeDirective",
      printMeta: "printDirectiveMetadata",
    },
    {
      name: "Enum",
      type: new GraphQLEnumType({
        name: "TestEnum",
        values: {},
      }),
      guard: TypeGuard.ENUM,
      printCode: "printCodeEnum",
      printMeta: "printEnumMetadata",
    },
    {
      name: "Input",
      type: new GraphQLInputObjectType({
        name: "TestInput",
        fields: {},
      }),
      guard: TypeGuard.INPUT,
      printCode: "printCodeInput",
      printMeta: "printInputMetadata",
    },
    {
      name: "Interface",
      type: new GraphQLInterfaceType({
        name: "TestInterface",
        fields: {},
      }),
      guard: TypeGuard.INTERFACE,
      printCode: "printCodeInterface",
      printMeta: "printInterfaceMetadata",
    },
    {
      name: "Object",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
      }),
      guard: TypeGuard.OBJECT,
      printCode: "printCodeObject",
      printMeta: "printObjectMetadata",
    },
    {
      name: "Scalar",
      type: new GraphQLScalarType({
        name: "TestScalar",
      }),
      guard: TypeGuard.SCALAR,
      printCode: "printCodeScalar",
      printMeta: "printScalarMetadata",
    },
    {
      name: "Union",
      type: new GraphQLUnionType({
        name: "TestUnion",
        types: [],
      }),
      guard: TypeGuard.UNION,
      printCode: "printCodeUnion",
      printMeta: "printUnionMetadata",
    },
    {
      name: "Operation",
      type: {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      },
      guard: TypeGuard.OPERATION,
      printCode: "printCodeOperation",
      printMeta: "printOperationMetadata",
    },
  ] as const;

  beforeEach(() => {
    Printer.options = undefined;
    jest.spyOn(GraphQL, "getTypeName").mockImplementation((value) => {
      return value as string;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("init()", () => {
    test("sets Printer instance with default options", async () => {
      expect.hasAssertions();

      expect(Printer.options).toBeUndefined();

      await Printer.init(undefined, undefined, undefined, undefined, undefined);

      expect(Printer.options).toMatchInlineSnapshot(`
{
  "basePath": "/schema",
  "codeSection": true,
  "collapsible": undefined,
  "customDirectives": undefined,
  "deprecated": "default",
  "exampleSection": false,
  "formatMDXAdmonition": [Function],
  "formatMDXBadge": [Function],
  "formatMDXBullet": [Function],
  "formatMDXDetails": [Function],
  "formatMDXFrontmatter": [Function],
  "formatMDXLink": [Function],
  "formatMDXNameEntity": [Function],
  "formatMDXSpecifiedByLink": [Function],
  "frontMatter": {},
  "groups": undefined,
  "hierarchy": {
    "api": {},
  },
  "level": undefined,
  "mdxDeclaration": "",
  "meta": undefined,
  "metatags": [],
  "onlyDocDirectives": [],
  "parentType": undefined,
  "parentTypePrefix": true,
  "relatedTypeSection": true,
  "schema": undefined,
  "skipDocDirectives": [],
  "typeBadges": true,
  "withAttributes": false,
}
`);
    });

    test("does nothing is options is defined", async () => {
      expect.hasAssertions();

      Printer.options = {} as PrintTypeOptions;

      await Printer.init(undefined);

      expect(Printer.options).toMatchInlineSnapshot(`{}`);
    });

    test("override values on init when options is undefined", async () => {
      expect.hasAssertions();

      const testDirective = new GraphQLDirective({
        name: "test",
        locations: [],
      });

      Printer.options = undefined;

      await Printer.init(new GraphQLSchema({}), "test", "/", {
        groups: {},
        printTypeOptions: {
          codeSection: false,
          exampleSection: true,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: false,
        },
        skipDocDirectives: [testDirective],
      });

      expect(Printer.options).toMatchInlineSnapshot(`
{
  "basePath": "/test",
  "codeSection": false,
  "collapsible": undefined,
  "customDirectives": undefined,
  "deprecated": "default",
  "exampleSection": true,
  "formatMDXAdmonition": [Function],
  "formatMDXBadge": [Function],
  "formatMDXBullet": [Function],
  "formatMDXDetails": [Function],
  "formatMDXFrontmatter": [Function],
  "formatMDXLink": [Function],
  "formatMDXNameEntity": [Function],
  "formatMDXSpecifiedByLink": [Function],
  "frontMatter": {},
  "groups": {},
  "hierarchy": {
    "entity": {},
  },
  "level": undefined,
  "mdxDeclaration": "",
  "meta": undefined,
  "metatags": [],
  "onlyDocDirectives": [],
  "parentType": undefined,
  "parentTypePrefix": false,
  "relatedTypeSection": false,
  "schema": GraphQLSchema {
    "__validationErrors": undefined,
    "_directives": [
      "@include",
      "@skip",
      "@deprecated",
      "@specifiedBy",
      "@oneOf",
    ],
    "_implementationsMap": {},
    "_mutationType": undefined,
    "_queryType": undefined,
    "_subTypeMap": {},
    "_subscriptionType": undefined,
    "_typeMap": {
      "Boolean": "Boolean",
      "String": "String",
      "__Directive": "__Directive",
      "__DirectiveLocation": "__DirectiveLocation",
      "__EnumValue": "__EnumValue",
      "__Field": "__Field",
      "__InputValue": "__InputValue",
      "__Schema": "__Schema",
      "__Type": "__Type",
      "__TypeKind": "__TypeKind",
    },
    "astNode": undefined,
    "description": undefined,
    "extensionASTNodes": [],
    "extensions": {},
  },
  "skipDocDirectives": [
    "@test",
  ],
  "typeBadges": false,
  "withAttributes": false,
}
`);
    });
  });

  describe("printHeader()", () => {
    test("returns a l1 title if no frontmatter support", () => {
      expect.hasAssertions();

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        { ...DEFAULT_OPTIONS, frontMatter: false },
      );

      expect(header).toBe(
        `# An Object Type Name

`,
      );
    });

    test("returns a MDX frontmatter document header", () => {
      expect.hasAssertions();

      jest
        .spyOn(Utils, "formatFrontMatterObject")
        .mockReturnValue([
          "id: an-object-type-name",
          "title: An Object Type Name",
        ]);

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        DEFAULT_OPTIONS,
      );

      expect(header).toMatchInlineSnapshot(`
            "---
            id: an-object-type-name
            title: An Object Type Name
            ---"
          `);
    });

    test("returns a MDX frontmatter document header with custom info", () => {
      expect.hasAssertions();

      jest
        .spyOn(Utils, "formatFrontMatterObject")
        .mockReturnValue([
          "draft: true",
          "hide_table_of_contents: null",
          "id: an-object-type-name",
          "title: An Object Type Name",
        ]);

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        {
          ...DEFAULT_OPTIONS,
          frontMatter: { draft: true, hide_table_of_contents: null },
        },
      );

      expect(header).toMatchInlineSnapshot(`
            "---
            draft: true
            hide_table_of_contents: null
            id: an-object-type-name
            title: An Object Type Name
            ---"
          `);
    });
  });

  describe("printCode()", () => {
    test.each(types)(
      "returns a Markdown graphql codeblock with type $name",
      ({ type, printCode, name, guard }) => {
        expect.hasAssertions();

        jest.spyOn(GraphQL, guard).mockReturnValue(true);
        jest.spyOn(GraphQLPrinter, printCode).mockReturnValue(name);

        const code = Printer.printCode(type, DEFAULT_OPTIONS);

        expect(code).toMatchSnapshot();
      },
    );

    test("returns a Markdown codeblock with non supported message for unsupported type", () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = Printer.printCode(type, DEFAULT_OPTIONS);

      expect(code).toMatchSnapshot();
    });

    test("returns an empty string if printTypeOptions.code is false", () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = Printer.printCode(type, {
        ...DEFAULT_OPTIONS,
        codeSection: false,
      });

      expect(code).toBe("");
    });
  });

  describe("printTypeMetadata()", () => {
    test.each(types)(
      "returns a Markdown graphql codeblock with type $name",
      ({ type, printMeta, name, guard }) => {
        expect.hasAssertions();

        jest.spyOn(GraphQL, guard).mockReturnValue(true);
        const spy = jest.spyOn(GraphQLPrinter, printMeta).mockReturnValue(name);

        Printer.printTypeMetadata(type, DEFAULT_OPTIONS);

        expect(spy).toHaveBeenCalledWith(type, DEFAULT_OPTIONS);
      },
    );

    test("returns empty string with non supported message for unsupported type", async () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = await Printer.printTypeMetadata(type, DEFAULT_OPTIONS);

      expect(code).toBe("");
    });
  });

  describe("printType()", () => {
    const methods = [
      "printCode",
      "printCustomDirectives",
      "printCustomTags",
      "printDescription",
      "printHeader",
      "printRelations",
      "printTypeMetadata",
    ] as const;

    test.each(types)(
      "returns a Markdown formatted content for type $name",
      async ({ name, type }) => {
        expect.hasAssertions();

        jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);

        const spies = methods.map((method) => {
          return jest.spyOn(Printer, method).mockReturnValue("");
        });

        await Printer.printType(name, type);

        spies.forEach((spy) => {
          expect(spy).toHaveBeenCalledTimes(1);
        });
      },
    );

    test("returns undefined if no type", async () => {
      expect.hasAssertions();

      const printedType = await Printer.printType("any", null);

      expect(printedType).toBeUndefined();
    });

    test("returns undefined if no name", async () => {
      expect.hasAssertions();

      const printedType = await Printer.printType(undefined, "any");

      expect(printedType).toBeUndefined();
    });

    test("returns undefined if type has no printable directive", async () => {
      expect.hasAssertions();
      jest.spyOn(Link, "hasPrintableDirective").mockReturnValueOnce(false);
      const printedType = await Printer.printType("any", null);

      expect(printedType).toBeUndefined();
    });
  });

  describe("printMetaTags", () => {
    test.each([
      { options: {} },
      { options: { metatags: undefined } },
      { options: { metatags: [] } },
    ])("return empty string if no metatags set", ({ options }) => {
      expect.assertions(1);

      expect(Printer.printMetaTags({}, options as PrintTypeOptions)).toBe("");
    });

    test("returns a formatted head tag with meta tags", () => {
      expect.assertions(1);

      const metatags = [
        { charSet: "utf-8" },
        { name: "robot", contents: "none" },
      ];

      expect(
        Printer.printMetaTags({}, { metatags } as unknown as PrintTypeOptions),
      ).toBe(`<head>
<meta charSet="utf-8" />
<meta name="robot" contents="none" />
</head>`);
    });
  });

  describe("printExample()", () => {
    test("returns a Markdown graphql codeblock with example", () => {
      expect.hasAssertions();

      const options = {
        ...DEFAULT_OPTIONS,
        exampleSection: true,
        schema: {
          getDirective: (name: string) => {
            return { name } as GraphQLDirective;
          },
        } as GraphQLSchema,
      } as PrintTypeOptions;

      const spy = jest
        .spyOn(ExamplePrinter, "printExample")
        .mockReturnValue("This is an example");

      const code = Printer.printExample(GraphQLString, options);

      expect(spy).toHaveBeenCalledWith(GraphQLString, options);
      expect(code).toMatchSnapshot();
    });

    test("returns an empty string if printTypeOptions.exampleSection is false", () => {
      expect.hasAssertions();

      const spy = jest
        .spyOn(ExamplePrinter, "printExample")
        .mockReturnValue("This is an example");

      const code = Printer.printExample(GraphQLString, {
        ...DEFAULT_OPTIONS,
        exampleSection: false,
      });

      expect(spy).not.toHaveBeenCalled();
      expect(code).toBe("");
    });

    test("returns an empty string if printExample returns undefined", () => {
      expect.hasAssertions();

      jest.spyOn(ExamplePrinter, "printExample").mockReturnValue(undefined);

      const code = Printer.printExample(GraphQLString, DEFAULT_OPTIONS);

      expect(code).toBe("");
    });

    test("returns an empty string if printTypeOptions.exampleSection directive is invalid", () => {
      expect.hasAssertions();

      const spy = jest
        .spyOn(ExamplePrinter, "printExample")
        .mockReturnValue("This is an example");

      const code = Printer.printExample(GraphQLString, {
        ...DEFAULT_OPTIONS,
        schema: {
          getDirective: () => {
            return undefined;
          },
        } as unknown as GraphQLSchema,
      });

      expect(spy).not.toHaveBeenCalled();
      expect(code).toBe("");
    });
  });

  describe("printCodeAsync()", () => {
    const mockEventEmitter = {
      emitAsync: jest
        .fn()
        .mockResolvedValue({ errors: [], defaultPrevented: false }),
    };

    beforeEach(() => {
      // Reset eventEmitter before each test
      (Printer as any).eventEmitter = null;
    });

    afterEach(() => {
      (Printer as any).eventEmitter = null;
    });

    test("returns printCode output when no event emitter is configured", async () => {
      expect.hasAssertions();

      jest.spyOn(GraphQL, "isEnumType").mockReturnValue(true);
      jest
        .spyOn(GraphQLPrinter, "printCodeEnum")
        .mockReturnValue("enum Test { }");

      const result = await Printer.printCodeAsync({ name: "Test" }, "test", {
        ...DEFAULT_OPTIONS,
        codeSection: true,
      });

      expect(result).toContain("enum Test { }");
    });

    test("emits BEFORE_PRINT_CODE and AFTER_PRINT_CODE events when emitter is configured", async () => {
      expect.hasAssertions();

      (Printer as any).eventEmitter = mockEventEmitter;
      jest.spyOn(GraphQL, "isEnumType").mockReturnValue(true);
      jest
        .spyOn(GraphQLPrinter, "printCodeEnum")
        .mockReturnValue("enum Test { }");

      await Printer.printCodeAsync({ name: "Test" }, "test", {
        ...DEFAULT_OPTIONS,
        codeSection: true,
      });

      expect(mockEventEmitter.emitAsync).toHaveBeenCalledTimes(2);
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        "print:beforePrintCode",
        expect.objectContaining({
          data: expect.objectContaining({
            typeName: "test",
          }),
        }),
      );
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        "print:afterPrintCode",
        expect.objectContaining({
          output: expect.any(String),
        }),
      );
    });

    test("returns modified output from event handler", async () => {
      expect.hasAssertions();

      const modifiedEmitter = {
        emitAsync: jest.fn().mockImplementation(async (_eventName, event) => {
          if (_eventName === "print:afterPrintCode") {
            event.output = "MODIFIED: " + event.output;
          }
          return { errors: [], defaultPrevented: false };
        }),
      };

      (Printer as any).eventEmitter = modifiedEmitter;
      jest.spyOn(GraphQL, "isEnumType").mockReturnValue(true);
      jest
        .spyOn(GraphQLPrinter, "printCodeEnum")
        .mockReturnValue("enum Test { }");

      const result = await Printer.printCodeAsync({ name: "Test" }, "test", {
        ...DEFAULT_OPTIONS,
        codeSection: true,
      });

      expect(result).toContain("MODIFIED:");
    });

    test("returns output from beforeEvent when default is prevented", async () => {
      expect.hasAssertions();

      const preventingEmitter = {
        emitAsync: jest.fn().mockImplementation(async (_eventName, event) => {
          if (_eventName === "print:beforePrintCode") {
            event.output = "CUSTOM OUTPUT";
            event.defaultPrevented = true;
          }
          return { errors: [], defaultPrevented: event.defaultPrevented };
        }),
      };

      (Printer as any).eventEmitter = preventingEmitter;
      jest.spyOn(GraphQL, "isEnumType").mockReturnValue(true);
      jest
        .spyOn(GraphQLPrinter, "printCodeEnum")
        .mockReturnValue("enum Test { }");

      const result = await Printer.printCodeAsync({ name: "Test" }, "test", {
        ...DEFAULT_OPTIONS,
        codeSection: true,
      });

      expect(result).toBe("CUSTOM OUTPUT");
    });
  });

  describe("printType() with events", () => {
    const mockEventEmitter = {
      emitAsync: jest
        .fn()
        .mockResolvedValue({ errors: [], defaultPrevented: false }),
    };

    beforeEach(() => {
      (Printer as any).eventEmitter = null;
      jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);
      // Mock printDescription since it's a static property pointing to external function
      (Printer as any).printDescription = jest.fn().mockReturnValue("");
      (Printer as any).printCustomDirectives = jest.fn().mockReturnValue("");
      (Printer as any).printCustomTags = jest.fn().mockReturnValue("");
    });

    afterEach(() => {
      (Printer as any).eventEmitter = null;
    });

    test("emits BEFORE_PRINT_TYPE and AFTER_PRINT_TYPE events when emitter is configured", async () => {
      expect.hasAssertions();

      (Printer as any).eventEmitter = mockEventEmitter;

      // Mock all the print methods to return empty strings
      jest.spyOn(Printer, "printHeader").mockReturnValue("");
      jest.spyOn(Printer, "printMetaTags").mockReturnValue("");
      jest.spyOn(Printer, "printCode").mockReturnValue("");
      jest.spyOn(Printer, "printTypeMetadata").mockReturnValue("");
      jest.spyOn(Printer, "printRelations").mockReturnValue("");
      jest.spyOn(Printer, "printExample").mockReturnValue("");

      await Printer.printType("test", { name: "Test" });

      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        "print:beforePrintType",
        expect.objectContaining({
          data: expect.objectContaining({
            name: "test",
          }),
        }),
      );
      expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
        "print:afterPrintType",
        expect.objectContaining({
          output: expect.any(String),
        }),
      );
    });

    test("returns modified output from AFTER_PRINT_TYPE event handler", async () => {
      expect.hasAssertions();

      const modifiedEmitter = {
        emitAsync: jest.fn().mockImplementation(async (_eventName, event) => {
          if (_eventName === "print:afterPrintType") {
            event.output = "COMPLETELY REPLACED OUTPUT";
          }
          return { errors: [], defaultPrevented: false };
        }),
      };

      (Printer as any).eventEmitter = modifiedEmitter;
      jest.spyOn(Printer, "printHeader").mockReturnValue("# Test");
      jest.spyOn(Printer, "printMetaTags").mockReturnValue("");
      jest.spyOn(Printer, "printCode").mockReturnValue("");
      jest.spyOn(Printer, "printTypeMetadata").mockReturnValue("");
      jest.spyOn(Printer, "printRelations").mockReturnValue("");
      jest.spyOn(Printer, "printExample").mockReturnValue("");

      const result = await Printer.printType("test", { name: "Test" });

      expect(result).toBe("COMPLETELY REPLACED OUTPUT");
    });

    test("returns output from BEFORE_PRINT_TYPE when default is prevented", async () => {
      expect.hasAssertions();

      const preventingEmitter = {
        emitAsync: jest.fn().mockImplementation(async (_eventName, event) => {
          if (_eventName === "print:beforePrintType") {
            event.output = "SKIPPED - Custom docs";
            event.defaultPrevented = true;
          }
          return { errors: [], defaultPrevented: event.defaultPrevented };
        }),
      };

      (Printer as any).eventEmitter = preventingEmitter;

      const result = await Printer.printType("test", { name: "Test" });

      expect(result).toBe("SKIPPED - Custom docs");
      // Should only have called beforePrintType, not afterPrintType
      expect(preventingEmitter.emitAsync).toHaveBeenCalledTimes(1);
    });

    test("does not emit events when no event emitter is configured", async () => {
      expect.hasAssertions();

      // Ensure no emitter
      (Printer as any).eventEmitter = null;

      jest.spyOn(Printer, "printHeader").mockReturnValue("# Test");
      jest.spyOn(Printer, "printMetaTags").mockReturnValue("");
      jest.spyOn(Printer, "printCode").mockReturnValue("");
      jest.spyOn(Printer, "printTypeMetadata").mockReturnValue("");
      jest.spyOn(Printer, "printRelations").mockReturnValue("");
      jest.spyOn(Printer, "printExample").mockReturnValue("");

      const result = await Printer.printType("test", { name: "Test" });

      // Should still produce output
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });
});
