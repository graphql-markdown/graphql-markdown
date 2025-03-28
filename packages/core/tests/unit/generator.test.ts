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
jest.mock("../../src/diff");
import * as CoreRenderer from "../../src/renderer";
jest.mock("../../src/renderer");
import * as CorePrinter from "../../src/printer";
jest.mock("../../src/printer");

const mockRenderer = {
  generateCategoryMetafile: jest.fn(),
  generateCategoryMetafileType: jest.fn(),
  renderRootTypes: jest.fn(),
  renderTypeEntities: jest.fn(),
  renderHomepage: jest.fn(),
} as unknown as CoreRenderer.Renderer;

import { generateDocFromSchema } from "../../src";

describe("generator", () => {
  describe("generateDocFromSchema()", () => {
    const options: GeneratorOptions = {
      baseURL: "base URL",
      diffMethod: "diff method" as DiffMethod,
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
      Object.assign(global, { logger: global.console });
    });

    beforeEach(() => {
      // silent console
      jest.spyOn(global.console, "info").mockImplementation(() => {});
      jest.spyOn(global.console, "warn").mockImplementation(() => {});
      jest.spyOn(global.console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      delete global.logger;
    });

    const getDirective = (name: string): GraphQLDirective => {
      return new GraphQLDirective({ name, locations: [] });
    };

    test.each([[undefined], ["custom-mdx"]])(
      "passes options to Printer and Renderer with mdxParser set to %s",
      async (mdxParser) => {
        expect.assertions(2);

        jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
        jest
          .spyOn(GraphQL, "getDocumentLoaders")
          .mockResolvedValueOnce({} as LoadSchemaOptions);
        jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
          getDirective,
        } as unknown as GraphQLSchema);
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
            schema: { getDirective },
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
            skipDocDirectives: [
              expect.objectContaining({ name: "docDirective" }),
            ],
          },
          undefined,
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
          undefined,
        );
      },
    );

    test("prints summary when completed", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
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

      const loggerSpy = jest.spyOn(global.console, "info");

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

    test("calls getDocumentLoaders and returns an error if loaders cannot be fetched", async () => {
      expect.assertions(3);

      const getDocumentLoadersSpy = jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce(undefined);
      const loggerSpy = jest.spyOn(console, "error");
      const loadSchemaSpy = jest
        .spyOn(GraphQL, "loadSchema")
        .mockResolvedValueOnce({
          getDirective,
        } as unknown as GraphQLSchema);

      await generateDocFromSchema({} as unknown as GeneratorOptions);

      expect(getDocumentLoadersSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `An error occurred while loading GraphQL loader.\nCheck your dependencies and configuration.`,
      );
      expect(loadSchemaSpy).not.toHaveBeenCalled();
    });

    test("calls hasChanges if DiffMethod is not NONE", async () => {
      expect.assertions(2);

      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);
      const loggerSpy = jest.spyOn(console, "info");
      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(true);

      await generateDocFromSchema(options);

      expect(hasChangesSpy).toHaveBeenCalledWith(
        { getDirective },
        "temp dir",
        "diff method",
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        `No changes detected in schema "schema location".`,
      );
    });

    test("skips hasChanges if DiffMethod is NONE", async () => {
      expect.assertions(1);

      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);
      const hasChangesSpy = jest.spyOn(CoreDiff, "hasChanges");

      await generateDocFromSchema({
        ...options,
        diffMethod: DiffMethod.NONE,
      });

      expect(hasChangesSpy).not.toHaveBeenCalled();
    });

    test("print info log is hasChanges is false", async () => {
      expect.assertions(2);

      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);
      const loggerSpy = jest.spyOn(console, "info");
      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(false);

      await generateDocFromSchema(options);

      expect(hasChangesSpy).toHaveBeenCalledWith(
        { getDirective },
        "temp dir",
        "diff method",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `No changes detected in schema "schema location".`,
      );
    });

    test("correctly calculates execution time", async () => {
      expect.assertions(2);

      // Mock process.hrtime.bigint to return predictable values
      const originalHrtime = process.hrtime.bigint;
      const mockHrtime = jest
        .fn()
        .mockReturnValueOnce(1000000000n) // start time
        .mockReturnValueOnce(2000000000n); // end time

      process.hrtime.bigint = mockHrtime;

      // Prepare to execute generator with mocked dependencies
      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(global.console, "info");

      // Execute generator
      await generateDocFromSchema(options);

      // Verify the NS_PER_SEC calculation logic works correctly
      // The total time of 1000ns (2000n - 1000n) should be displayed as 0.000s
      expect(mockHrtime).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenCalledWith(
        '1 pages generated in 1.000s from schema "schema location".',
      );

      // Restore original function
      process.hrtime.bigint = originalHrtime;
    });

    test("handles template literals in output path", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);

      const schema = { getDirective } as unknown as GraphQLSchema;
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce(schema);

      jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(global.console, "info");

      await generateDocFromSchema({
        ...options,
        outputDir: `custom-output`,
      });

      // Verify template literal is expanded correctly in the output message
      expect(loggerSpy).toHaveBeenCalledWith(
        'Documentation successfully generated in "custom-output" with base URL "base URL".',
      );
    });

    test("properly executes block statements during schema processing", async () => {
      expect.assertions(3);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);

      const schema = { getDirective } as unknown as GraphQLSchema;
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce(schema);

      const schemaMapSpy = jest
        .spyOn(GraphQL, "getSchemaMap")
        .mockReturnValueOnce({
          objects: { TestType: {} },
          enums: { Status: {} },
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

      // Verify the block statement executed by checking method calls
      expect(schemaMapSpy).toHaveBeenCalled();
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("objects", {
        TestType: {},
      });
      expect(rendererMock.renderRootTypes).toHaveBeenCalledWith("enums", {
        Status: {},
      });
    });

    test("properly handles string literals in error messages", async () => {
      expect.assertions(1);

      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce(undefined);
      const loggerSpy = jest.spyOn(console, "error");

      await generateDocFromSchema({} as unknown as GeneratorOptions);

      // Verify that the error message is not empty (would catch mutations of string literals to empty strings)
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^An error occurred while loading GraphQL loader./,
        ),
      );
    });

    test("properly assigns configuration object properties", async () => {
      expect.assertions(3);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);
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

    test("executes all block statements in schema processing loop", async () => {
      expect.assertions(7);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);

      const schema = { getDirective } as unknown as GraphQLSchema;
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce(schema);

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

      // Verify all schema types are processed (would catch a block statement mutation)
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

      // Verify the overall number of calls
      expect(rendererMock.renderRootTypes).toHaveBeenCalledTimes(6);
    });

    test("handles empty schema map gracefully", async () => {
      expect.assertions(1);

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(GraphQL, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest.spyOn(GraphQL, "loadSchema").mockResolvedValueOnce({
        getDirective,
      } as unknown as GraphQLSchema);

      // Test with completely empty schema map
      jest.spyOn(GraphQL, "getSchemaMap").mockReturnValueOnce({} as SchemaMap);

      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);
      jest
        .spyOn(CoreRenderer, "getRenderer")
        .mockResolvedValueOnce(mockRenderer);

      const loggerSpy = jest.spyOn(global.console, "info");

      await generateDocFromSchema(options);

      // Verify execution completes and summary is printed even with empty schema
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining("Documentation successfully generated"),
      );
    });
  });
});
