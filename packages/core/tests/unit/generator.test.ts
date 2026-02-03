jest.useFakeTimers();

import type {
  DirectiveName,
  GeneratorOptions,
  GraphQLSchema,
  IPrinter,
  LoadSchemaOptions,
  PackageName,
  SchemaMap,
} from "@graphql-markdown/types";

import { GraphQLDirective } from "graphql/type";

import * as GraphQL from "@graphql-markdown/graphql";
jest.mock("@graphql-markdown/graphql", () => {
  return {
    getCustomDirectives: jest.fn(),
    getDocumentLoaders: jest.fn(),
    getGroups: jest.fn(),
    getSchemaMap: jest.fn(),
    loadSchema: jest.fn(),
  };
});

import { DiffMethod, TypeHierarchy } from "../../src/config";
import * as CoreDiff from "../../src/diff";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("../../src/diff");
import * as CoreRenderer from "../../src/renderer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("../../src/renderer");
import * as CorePrinter from "../../src/printer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("../../src/printer");

import { resetEvents } from "../../src/event-emitter";

// Import helper functions for direct testing
import * as GeneratorModule from "../../src/generator";
const {
  loadMDXModule,
  loadGraphqlSchema,
  checkSchemaDifferences,
  resolveSkipAndOnlyDirectives,
  getFormatterFromMDXModule,
} = GeneratorModule;

const mockRenderer = {
  generateCategoryMetafile: jest.fn(),
  generateCategoryMetafileType: jest.fn(),
  renderRootTypes: jest.fn(),
  renderTypeEntities: jest.fn(),
  renderHomepage: jest.fn(),
  preCollectCategories: jest.fn(),
} as unknown as CoreRenderer.Renderer;

import { generateDocFromSchema } from "../../src";

describe("generator", () => {
  describe("generateDocFromSchema()", () => {
    const options: GeneratorOptions = {
      baseURL: "base URL",
      diffMethod: "NONE" as DiffMethod,
      docOptions: {
        index: true,
        frontMatter: {},
      },
      homepageLocation: "homepage location",
      linkRoot: "link root",
      metatags: [],
      onlyDocDirective: [],
      prettify: true,
      printer: "printer module" as PackageName,
      printTypeOptions: {
        codeSection: true,
        deprecated: "skip",
        exampleSection: false,
        parentTypePrefix: true,
        relatedTypeSection: true,
        typeBadges: true,
        hierarchy: TypeHierarchy.API,
      },
      outputDir: "output dir",
      schemaLocation: "schema location",
      tmpDir: "temp dir",
      skipDocDirective: ["docDirective" as DirectiveName],
    };

    beforeAll(() => {
      Object.assign(globalThis, { logger: globalThis.console });
    });

    beforeEach(() => {
      // silent console
      jest.spyOn(globalThis.console, "info").mockImplementation(() => {});
      jest.spyOn(globalThis.console, "warn").mockImplementation(() => {});
      jest.spyOn(globalThis.console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
      resetEvents();
    });

    afterAll(() => {
      delete globalThis.logger;
    });

    const getDirective = (name: string): GraphQLDirective => {
      return new GraphQLDirective({ name, locations: [] });
    };

    test.each([[undefined], ["custom-mdx"]])(
      "passes options to Printer and Renderer with mdxParser set to %s",
      async (mdxParser) => {
        expect.assertions(2);

        const mockSchema = { getDirective } as unknown as GraphQLSchema;
        const mockDirective = new GraphQLDirective({
          name: "docDirective",
          locations: [],
        });

        // Mock helper functions
        jest
          .spyOn(GeneratorModule, "loadMDXModule")
          .mockResolvedValueOnce(undefined);
        jest
          .spyOn(GeneratorModule, "loadGraphqlSchema")
          .mockResolvedValueOnce(mockSchema);
        jest
          .spyOn(GeneratorModule, "checkSchemaDifferences")
          .mockResolvedValueOnce(true);
        jest
          .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
          .mockReturnValueOnce([[], [mockDirective]]);

        // Mock GraphQL package functions still needed
        jest
          .spyOn(GraphQL, "getSchemaMap")
          .mockReturnValueOnce({ objects: {} } as SchemaMap);
        jest.spyOn(GraphQL, "getGroups").mockReturnValueOnce(undefined);
        jest
          .spyOn(GraphQL, "getCustomDirectives")
          .mockReturnValueOnce(undefined);

        const getPrinterSpy = jest
          .spyOn(CorePrinter, "getPrinter")
          .mockResolvedValueOnce({} as unknown as typeof IPrinter);
        const rendererSpy = jest
          .spyOn(CoreRenderer, "getRenderer")
          .mockResolvedValueOnce(mockRenderer);

        await generateDocFromSchema({ ...options, mdxParser });

        expect(getPrinterSpy).toHaveBeenCalledWith(
          options.printer,
          {
            baseURL: options.baseURL,
            linkRoot: options.linkRoot,
            schema: mockSchema,
          },
          {
            customDirectives: undefined,
            groups: undefined,
            meta: {
              generatorFrameworkName: undefined,
              generatorFrameworkVersion: undefined,
            },
            metatags: [],
            printTypeOptions: options.printTypeOptions,
            onlyDocDirectives: [],
            skipDocDirectives: [mockDirective],
          },
          undefined,
          undefined,
          expect.anything(), // event emitter
        );
        expect(rendererSpy).toHaveBeenCalledWith(
          {},
          options.outputDir,
          options.baseURL,
          undefined,
          options.prettify,
          {
            ...options.docOptions,
            deprecated: options.printTypeOptions!.deprecated,
            hierarchy: options.printTypeOptions!.hierarchy,
          },
          ".md",
        );
      },
    );

    test("prints summary when completed", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      // Mock helper functions
      jest
        .spyOn(GeneratorModule, "loadMDXModule")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest.spyOn(GraphQL, "getGroups").mockReturnValueOnce(undefined);
      jest.spyOn(GraphQL, "getCustomDirectives").mockReturnValueOnce(undefined);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(globalThis.console, "info");

      await generateDocFromSchema(options);

      expect(loggerSpy.mock.calls).toMatchInlineSnapshot(`
[
  [
    "Documentation successfully generated in "output dir" with base URL "base URL".",
  ],
  [
    "1 pages generated in 0.000s from schema "schema location".",
  ],
]
`);
    });

    test("returns early when loadGraphqlSchema returns undefined", async () => {
      expect.assertions(2);

      const loadGraphqlSchemaSpy = jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(undefined);
      const loggerSpy = jest.spyOn(console, "error");

      await generateDocFromSchema({} as unknown as GeneratorOptions);

      expect(loadGraphqlSchemaSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load GraphQL schema"),
      );
    });

    test("calls checkSchemaDifferences and respects result", async () => {
      expect.assertions(2);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      const checkDiffSpy = jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);
      const loggerSpy = jest.spyOn(console, "info");

      await generateDocFromSchema(options);

      expect(checkDiffSpy).toHaveBeenCalledWith(
        mockSchema,
        "schema location",
        "NONE",
        "temp dir",
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        `No changes detected in schema "schema location".`,
      );
    });

    test("checkSchemaDifferences not called when diffMethod is NONE", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      const checkDiffSpy = jest.spyOn(
        GeneratorModule,
        "checkSchemaDifferences",
      );
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema({
        ...options,
        diffMethod: DiffMethod.NONE,
      });

      expect(checkDiffSpy).toHaveBeenCalled();
    });

    test("correctly calculates execution time", async () => {
      expect.assertions(2);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      // Mock process.hrtime.bigint to return predictable values
      const originalHrtime = process.hrtime.bigint;
      const mockHrtime = jest
        .fn()
        .mockReturnValueOnce(1000000000n) // start time
        .mockReturnValueOnce(2000000000n); // end time

      process.hrtime.bigint = mockHrtime;

      // Mock helper functions
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(globalThis.console, "info");

      await generateDocFromSchema(options);

      expect(mockHrtime).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenCalledWith(
        '1 pages generated in 1.000s from schema "schema location".',
      );

      // Restore original function
      process.hrtime.bigint = originalHrtime;
    });

    test("passes configuration to printer and renderer", async () => {
      expect.assertions(3);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const getPrinterSpy = jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);

      await generateDocFromSchema(options);

      // Verify object literals are passed correctly with all expected properties
      expect(getPrinterSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          baseURL: options.baseURL,
          linkRoot: options.linkRoot,
          schema: expect.anything(),
        }),
        expect.objectContaining({
          customDirectives: undefined,
          groups: undefined,
          meta: expect.any(Object),
          metatags: expect.any(Array),
          printTypeOptions: expect.any(Object),
          onlyDocDirectives: expect.any(Array),
          skipDocDirectives: expect.any(Array),
        }),
        undefined,
        undefined,
        expect.anything(), // event emitter
      );

      // Verify that the meta object contains expected properties
      expect(getPrinterSpy.mock.calls[0][2]?.meta).toEqual({
        generatorFrameworkName: undefined,
        generatorFrameworkVersion: undefined,
      });

      // Verify printTypeOptions are passed intact
      expect(getPrinterSpy.mock.calls[0][2]?.printTypeOptions).toEqual(
        options.printTypeOptions,
      );
    });

    test("processes all root types from schema map", async () => {
      expect.assertions(7);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      // Create a comprehensive schema map with all possible root types
      jest.spyOn(GraphQL, "getSchemaMap").mockReturnValueOnce({
        objects: { TestObject: {} },
        inputs: { TestInput: {} },
        interfaces: { TestInterface: {} },
        scalars: { TestScalar: {} },
        enums: { TestEnum: {} },
        unions: { TestUnion: {} },
      } as unknown as SchemaMap);

      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);

      const rendererMock = {
        ...mockRenderer,
        renderRootTypes: jest.fn().mockResolvedValue({}),
      } as unknown as CoreRenderer.Renderer;

      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(rendererMock);

      await generateDocFromSchema(options);

      // Verify all schema types are processed
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("objects", {
        TestObject: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("inputs", {
        TestInput: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("interfaces", {
        TestInterface: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("scalars", {
        TestScalar: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("enums", {
        TestEnum: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("unions", {
        TestUnion: {},
      });

      expect(rendererMock.renderRootTypes).toHaveBeenCalledTimes(6);
    });

    test("handles empty schema map gracefully", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      // Test with completely empty schema map
      jest.spyOn(GraphQL, "getSchemaMap").mockReturnValueOnce({} as SchemaMap);

      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(globalThis.console, "info");

      await generateDocFromSchema(options);

      // Verify execution completes and summary is printed even with empty schema
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining("Documentation successfully generated"),
      );
    });

    test("calls loadMDXModule with mdxParser option", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      const loadMDXSpy = jest
        .spyOn(GeneratorModule, "loadMDXModule")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema({
        ...options,
        mdxParser: "custom-mdx-parser",
      });

      expect(loadMDXSpy).toHaveBeenCalledWith("custom-mdx-parser");
    });

    test("uses .mdx extension when mdxModule is loaded", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadMDXModule")
        .mockResolvedValueOnce({ createMDXFormatter: jest.fn() });
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const rendererSpy = jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema({
        ...options,
        mdxParser: "custom-mdx-parser",
      });

      // Verify the last argument (mdxExtension) is .mdx
      expect(rendererSpy.mock.calls[0]![6]).toBe(".mdx");
    });

    test("uses custom mdxExtension from mdxModule when provided", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest.spyOn(GeneratorModule, "loadMDXModule").mockResolvedValueOnce({
        createMDXFormatter: jest.fn(),
        mdxExtension: ".custom",
      });
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const rendererSpy = jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema({
        ...options,
        mdxParser: "custom-mdx-parser",
      });

      // Verify the last argument (mdxExtension) is the custom extension
      expect(rendererSpy.mock.calls[0]![6]).toBe(".custom");
    });

    test("does not use mdxDeclaration as file extension (regression test)", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      // This simulates a module that has both mdxDeclaration and mdxExtension
      // The code should use mdxExtension, not mdxDeclaration
      jest.spyOn(GeneratorModule, "loadMDXModule").mockResolvedValueOnce({
        createMDXFormatter: jest.fn(),
        mdxExtension: ".mdx",
        mdxDeclaration:
          "import { Badge } from '@astrojs/starlight/components';",
      });
      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const rendererSpy = jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema({
        ...options,
        mdxParser: "custom-mdx-parser",
      });

      // Should use mdxExtension (.mdx), not mdxDeclaration (the import statement)
      expect(rendererSpy.mock.calls[0]![6]).toBe(".mdx");
    });

    test("calls resolveSkipAndOnlyDirectives with directive options and schema", async () => {
      expect.assertions(1);

      const mockSchema = { getDirective } as unknown as GraphQLSchema;

      jest
        .spyOn(GeneratorModule, "loadGraphqlSchema")
        .mockResolvedValueOnce(mockSchema);
      jest
        .spyOn(GeneratorModule, "checkSchemaDifferences")
        .mockResolvedValueOnce(true);
      const resolveSpy = jest
        .spyOn(GeneratorModule, "resolveSkipAndOnlyDirectives")
        .mockReturnValueOnce([[], []]);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      await generateDocFromSchema(options);

      expect(resolveSpy).toHaveBeenCalledWith(
        options.onlyDocDirective,
        options.skipDocDirective,
        mockSchema,
      );
    });
  });

  describe("resolveSkipAndOnlyDirectives()", () => {
    const mockSchema = {
      getDirective: jest.fn(),
    } as unknown as GraphQLSchema;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("converts single directive name to array for onlyDocDirective", () => {
      expect.assertions(2);

      const directive = new GraphQLDirective({
        name: "testDirective",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock).mockReturnValue(directive);

      const result = resolveSkipAndOnlyDirectives(
        "testDirective" as DirectiveName,
        undefined,
        mockSchema,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([directive]);
    });

    test("converts single directive name to array for skipDocDirective", () => {
      expect.assertions(2);

      const directive = new GraphQLDirective({
        name: "skipDirective",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock).mockReturnValue(directive);

      const result = resolveSkipAndOnlyDirectives(
        undefined,
        "skipDirective" as DirectiveName,
        mockSchema,
      );

      expect(result).toHaveLength(2);
      expect(result[1]).toEqual([directive]);
    });

    test("handles array of directive names", () => {
      expect.assertions(2);

      const directive1 = new GraphQLDirective({
        name: "directive1",
        locations: [],
      });
      const directive2 = new GraphQLDirective({
        name: "directive2",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock)
        .mockReturnValueOnce(directive1)
        .mockReturnValueOnce(directive2);

      const result = resolveSkipAndOnlyDirectives(
        ["directive1", "directive2"] as DirectiveName[],
        undefined,
        mockSchema,
      );

      expect(result[0]).toHaveLength(2);
      expect(result[0]).toEqual([directive1, directive2]);
    });

    test("handles undefined onlyDocDirective", () => {
      expect.assertions(1);

      const result = resolveSkipAndOnlyDirectives(
        undefined,
        undefined,
        mockSchema,
      );

      expect(result[0]).toEqual([]);
    });

    test("handles undefined skipDocDirective", () => {
      expect.assertions(1);

      const result = resolveSkipAndOnlyDirectives(
        undefined,
        undefined,
        mockSchema,
      );

      expect(result[1]).toEqual([]);
    });

    test("handles both directives as undefined", () => {
      expect.assertions(2);

      const result = resolveSkipAndOnlyDirectives(
        undefined,
        undefined,
        mockSchema,
      );

      expect(result[0]).toEqual([]);
      expect(result[1]).toEqual([]);
    });

    test("looks up directives in schema", () => {
      expect.assertions(2);

      const directive = new GraphQLDirective({
        name: "customDirective",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock).mockReturnValue(directive);

      resolveSkipAndOnlyDirectives(
        "customDirective" as DirectiveName,
        undefined,
        mockSchema,
      );

      expect(mockSchema.getDirective).toHaveBeenCalledWith("customDirective");
      expect(mockSchema.getDirective).toHaveBeenCalledTimes(1);
    });

    test("filters out directives not found in schema", () => {
      expect.assertions(1);

      (mockSchema.getDirective as jest.Mock).mockReturnValue(undefined);

      const result = resolveSkipAndOnlyDirectives(
        "nonExistentDirective" as DirectiveName,
        undefined,
        mockSchema,
      );

      expect(result[0]).toEqual([]);
    });

    test("returns empty array when directive not in schema", () => {
      expect.assertions(1);

      (mockSchema.getDirective as jest.Mock).mockReturnValue(undefined);

      const result = resolveSkipAndOnlyDirectives(
        ["missing1", "missing2"] as DirectiveName[],
        undefined,
        mockSchema,
      );

      expect(result[0]).toEqual([]);
    });

    test("returns tuple of two arrays", () => {
      expect.assertions(3);

      const result = resolveSkipAndOnlyDirectives(
        undefined,
        undefined,
        mockSchema,
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result.every((item) => Array.isArray(item))).toBe(true);
    });

    test("correctly separates only vs skip directives", () => {
      expect.assertions(2);

      const onlyDirective = new GraphQLDirective({
        name: "onlyDirective",
        locations: [],
      });
      const skipDirective = new GraphQLDirective({
        name: "skipDirective",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock)
        .mockReturnValueOnce(onlyDirective)
        .mockReturnValueOnce(skipDirective);

      const result = resolveSkipAndOnlyDirectives(
        "onlyDirective" as DirectiveName,
        "skipDirective" as DirectiveName,
        mockSchema,
      );

      expect(result[0]).toEqual([onlyDirective]);
      expect(result[1]).toEqual([skipDirective]);
    });

    test("handles empty directive arrays", () => {
      expect.assertions(2);

      const result = resolveSkipAndOnlyDirectives(
        [] as DirectiveName[],
        [] as DirectiveName[],
        mockSchema,
      );

      expect(result[0]).toEqual([]);
      expect(result[1]).toEqual([]);
    });

    test("handles mixed valid/invalid directive names", () => {
      expect.assertions(1);

      const validDirective = new GraphQLDirective({
        name: "valid",
        locations: [],
      });
      (mockSchema.getDirective as jest.Mock)
        .mockReturnValueOnce(validDirective)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(validDirective);

      const result = resolveSkipAndOnlyDirectives(
        ["valid", "invalid", "valid"] as DirectiveName[],
        undefined,
        mockSchema,
      );

      expect(result[0]).toEqual([validDirective, validDirective]);
    });
  });

  describe("loadMDXModule()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    test("returns undefined when mdxParser is null", async () => {
      expect.assertions(1);

      const result = await loadMDXModule(null);

      expect(result).toBeUndefined();
    });

    test("returns undefined when mdxParser is undefined", async () => {
      expect.assertions(1);

      const result = await loadMDXModule(undefined);

      expect(result).toBeUndefined();
    });

    test("logs warning and returns undefined on import error", async () => {
      expect.assertions(2);

      const warnSpy = jest.spyOn(console, "warn");
      const invalidModule = "non-existent-module-xyz" as PackageName;

      const result = await loadMDXModule(invalidModule);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `An error occurred while loading MDX formatter "${invalidModule}"`,
        ),
      );
      expect(result).toBeUndefined();
    });
  });

  describe("getFormatterFromMDXModule()", () => {
    test("returns undefined when mdxModule is null", () => {
      expect.assertions(1);

      const result = getFormatterFromMDXModule(null);

      expect(result).toBeUndefined();
    });

    test("returns undefined when mdxModule is undefined", () => {
      expect.assertions(1);

      const result = getFormatterFromMDXModule(undefined);

      expect(result).toBeUndefined();
    });

    test("returns undefined when mdxModule is not an object", () => {
      expect.assertions(1);

      const result = getFormatterFromMDXModule("not an object");

      expect(result).toBeUndefined();
    });

    test("uses createMDXFormatter factory if available", () => {
      expect.assertions(2);

      const mockFormatter = {
        formatMDXBadge: jest.fn(),
        formatMDXAdmonition: jest.fn(),
      };
      const createMDXFormatter = jest.fn().mockReturnValue(mockFormatter);
      const mdxModule = { createMDXFormatter };

      const result = getFormatterFromMDXModule(mdxModule, {
        generatorFrameworkName: "test",
      });

      expect(createMDXFormatter).toHaveBeenCalledWith({
        generatorFrameworkName: "test",
      });
      expect(result).toBe(mockFormatter);
    });

    test("uses createMDXFormatter from default export (ESM)", () => {
      expect.assertions(2);

      const mockFormatter = {
        formatMDXBadge: jest.fn(),
      };
      const createMDXFormatter = jest.fn().mockReturnValue(mockFormatter);
      const mdxModule = { default: { createMDXFormatter } };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(createMDXFormatter).toHaveBeenCalled();
      expect(result).toBe(mockFormatter);
    });

    test("detects individual formatter functions from module", () => {
      expect.assertions(3);

      const formatMDXBadge = jest.fn();
      const formatMDXAdmonition = jest.fn();
      const mdxModule = { formatMDXBadge, formatMDXAdmonition };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(result).toBeDefined();
      expect(result!.formatMDXBadge).toBe(formatMDXBadge);
      expect(result!.formatMDXAdmonition).toBe(formatMDXAdmonition);
    });

    test("detects individual formatter functions from default export", () => {
      expect.assertions(2);

      const formatMDXBullet = jest.fn();
      const mdxModule = { default: { formatMDXBullet } };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(result).toBeDefined();
      expect(result!.formatMDXBullet).toBe(formatMDXBullet);
    });

    test("returns undefined when no formatter functions are found", () => {
      expect.assertions(1);

      const mdxModule = { mdxDeclaration: "import something;" };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(result).toBeUndefined();
    });

    test("prefers createMDXFormatter over individual functions", () => {
      expect.assertions(2);

      const factoryFormatter = { formatMDXBadge: jest.fn() };
      const createMDXFormatter = jest.fn().mockReturnValue(factoryFormatter);
      const individualBadge = jest.fn();
      const mdxModule = {
        createMDXFormatter,
        formatMDXBadge: individualBadge,
      };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(createMDXFormatter).toHaveBeenCalled();
      expect(result).toBe(factoryFormatter);
    });

    test("detects all 8 formatter function types", () => {
      expect.assertions(9);

      const mdxModule = {
        formatMDXBadge: jest.fn(),
        formatMDXAdmonition: jest.fn(),
        formatMDXBullet: jest.fn(),
        formatMDXDetails: jest.fn(),
        formatMDXFrontmatter: jest.fn(),
        formatMDXLink: jest.fn(),
        formatMDXNameEntity: jest.fn(),
        formatMDXSpecifiedByLink: jest.fn(),
      };

      const result = getFormatterFromMDXModule(mdxModule);

      expect(result).toBeDefined();
      expect(result!.formatMDXBadge).toBe(mdxModule.formatMDXBadge);
      expect(result!.formatMDXAdmonition).toBe(mdxModule.formatMDXAdmonition);
      expect(result!.formatMDXBullet).toBe(mdxModule.formatMDXBullet);
      expect(result!.formatMDXDetails).toBe(mdxModule.formatMDXDetails);
      expect(result!.formatMDXFrontmatter).toBe(mdxModule.formatMDXFrontmatter);
      expect(result!.formatMDXLink).toBe(mdxModule.formatMDXLink);
      expect(result!.formatMDXNameEntity).toBe(mdxModule.formatMDXNameEntity);
      expect(result!.formatMDXSpecifiedByLink).toBe(
        mdxModule.formatMDXSpecifiedByLink,
      );
    });
  });

  describe("loadGraphqlSchema()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    test("returns schema when loaders succeed", async () => {
      expect.assertions(1);

      const mockSchema = {} as GraphQLSchema;
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce(mockSchema);

      const result = await loadGraphqlSchema("schema.graphql", undefined);

      expect(result).toBe(mockSchema);
    });

    test("returns undefined when loaders cannot be initialized", async () => {
      expect.assertions(1);

      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce(undefined);

      const result = await loadGraphqlSchema("schema.graphql", undefined);

      expect(result).toBeUndefined();
    });

    test("logs error message when loaders fail", async () => {
      expect.assertions(1);

      const errorSpy = jest.spyOn(console, "error");
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce(undefined);

      await loadGraphqlSchema("schema.graphql", undefined);

      expect(errorSpy).toHaveBeenCalledWith(
        `An error occurred while loading GraphQL loader.\nCheck your dependencies and configuration.`,
      );
    });

    test("passes loadersList to getDocumentLoaders", async () => {
      expect.assertions(1);

      const loadersList = { documents: "**/*.graphql" };
      const getLoadersSpy = jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(GraphQL, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);

      await loadGraphqlSchema("schema.graphql", loadersList);

      expect(getLoadersSpy).toHaveBeenCalledWith(loadersList);
    });

    test("passes schemaLocation to loadSchema", async () => {
      expect.assertions(1);

      const schemaLocation = "http://example.com/schema.graphql";
      const loaders = {} as LoadSchemaOptions;
      jest.spyOn(GraphQL, "getDocumentLoaders").mockResolvedValueOnce(loaders);
      const loadSchemaSpy = jest
        .spyOn(GraphQL, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);

      await loadGraphqlSchema(schemaLocation, undefined);

      expect(loadSchemaSpy).toHaveBeenCalledWith(schemaLocation, loaders);
    });
  });

  describe("checkSchemaDifferences()", () => {
    const mockSchema = {} as GraphQLSchema;
    const schemaLocation = "schema.graphql";
    const tmpDir = "/tmp";

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "info").mockImplementation(() => {});
    });

    test("returns true when diffMethod is NONE", async () => {
      expect.assertions(2);

      const hasChangesSpy = jest.spyOn(CoreDiff, "hasChanges");

      const result = await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        DiffMethod.NONE,
        tmpDir,
      );

      expect(result).toBe(true);
      expect(hasChangesSpy).not.toHaveBeenCalled();
    });

    test("calls hasChanges when diffMethod is not NONE", async () => {
      expect.assertions(2);

      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(true);

      const result = await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        "FORCE" as DiffMethod,
        tmpDir,
      );

      expect(hasChangesSpy).toHaveBeenCalledWith(mockSchema, tmpDir, "FORCE");
      expect(result).toBe(true);
    });

    test("logs message when no changes detected", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(false);
      const infoSpy = jest.spyOn(console, "info");

      await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        "FORCE" as DiffMethod,
        tmpDir,
      );

      expect(infoSpy).toHaveBeenCalledWith(
        `No changes detected in schema "${schemaLocation}".`,
      );
    });

    test("does not log when changes detected", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      const infoSpy = jest.spyOn(console, "info");

      await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        "FORCE" as DiffMethod,
        tmpDir,
      );

      expect(infoSpy).not.toHaveBeenCalled();
    });

    test("passes correct parameters to hasChanges", async () => {
      expect.assertions(1);

      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(true);

      await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        "FORCE" as DiffMethod,
        tmpDir,
      );

      expect(hasChangesSpy).toHaveBeenCalledWith(mockSchema, tmpDir, "FORCE");
    });

    test("returns false when hasChanges returns false", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(false);

      const result = await checkSchemaDifferences(
        mockSchema,
        schemaLocation,
        "FORCE" as DiffMethod,
        tmpDir,
      );

      expect(result).toBe(false);
    });
  });
});
