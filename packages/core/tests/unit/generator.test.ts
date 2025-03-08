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

    test.each([
      [undefined, false],
      ["custom-mdx", true],
    ])(
      "passes options to Printer and Renderer with mdxParser set to %s",
      async (mdxParser, hasMDXSupport) => {
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

        await generateDocFromSchema(options, mdxParser as PackageName);

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
          mdxParser,
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
          hasMDXSupport,
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
  });
});
