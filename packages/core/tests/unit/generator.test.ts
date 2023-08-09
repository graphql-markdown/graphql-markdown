jest.useFakeTimers();

import type {
  GeneratorOptions,
  GraphQLSchema,
  IPrinter,
  LoadSchemaOptions,
  SchemaMap,
} from "@graphql-markdown/types";

import * as Utils from "@graphql-markdown/utils";
jest.mock("@graphql-markdown/utils", () => {
  const utils = jest.requireActual("@graphql-markdown/utils");
  return {
    Logger: utils.Logger,
    getCustomDirectives: jest.fn(),
    getDocumentLoaders: jest.fn(),
    getGroups: jest.fn(),
    getSchemaMap: jest.fn(),
    loadSchema: jest.fn(),
  };
});

import { DiffMethod } from "../../src/config";
import * as CoreDiff from "../../src/diff";
jest.mock("../../src/diff");
import * as CoreRenderer from "../../src/renderer";
jest.mock("../../src/renderer");
import * as CorePrinter from "../../src/printer";
jest.mock("../../src/printer");

import { generateDocFromSchema } from "../../src";

describe("generator", () => {
  describe("generateDocFromSchema()", () => {
    beforeAll(() => {
      Object.assign(global, { logger: global.console });
    });

    beforeEach(() => {
      // silent console
      jest.spyOn(global.console, "info").mockImplementation(() => {});
      jest.spyOn(global.console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    afterAll(() => {
      delete global.logger;
    });

    test("passes options to Printer and Renderer", async () => {
      const options = {
        baseURL: "base URL",
        schemaLocation: "schema location",
        outputDir: "output dir",
        linkRoot: "link root",
        homepageLocation: "homepage location",
        tmpDir: "temp dir",
        diffMethod: "diff method",
        docOptions: {
          index: true,
          pagination: true,
          toc: true,
        },
        printTypeOptions: {
          codeSection: true,
          deprecated: "skip",
          parentTypePrefix: true,
          relatedTypeSection: true,
          typeBadges: true,
        },
        prettify: true,
        printer: "printer module",
        skipDocDirective: "doc directive",
      } as unknown as GeneratorOptions;

      jest
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(Utils, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);
      jest
        .spyOn(Utils, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest.spyOn(Utils, "getGroups").mockReturnValueOnce(undefined);
      jest.spyOn(Utils, "getCustomDirectives").mockReturnValueOnce(undefined);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);

      const getPrinterSpy = jest.spyOn(CorePrinter, "getPrinter");
      const rendererSpy = jest.spyOn(CoreRenderer, "Renderer");

      await generateDocFromSchema(options);

      expect(getPrinterSpy).toHaveBeenCalledWith(
        options.printer,
        {
          baseURL: options.baseURL,
          linkRoot: options.linkRoot,
          schema: {},
        },
        {
          customDirectives: undefined,
          groups: undefined,
          printTypeOptions: options.printTypeOptions,
          skipDocDirective: options.skipDocDirective,
        },
      );
      expect(rendererSpy).toHaveBeenCalledWith(
        {},
        options.outputDir,
        options.baseURL,
        undefined,
        options.prettify,
        {
          ...options.docOptions,
          deprecated: options.printTypeOptions.deprecated,
        },
      );
    });

    test("prints summary when completed", async () => {
      expect.assertions(1);

      const options = {
        baseURL: "base URL",
        schemaLocation: "schema location",
        outputDir: "output dir",
        linkRoot: "link root",
        homepageLocation: "homepage location",
        tmpDir: "temp dir",
        diffMethod: "diff method",
        docOptions: {
          index: true,
          pagination: true,
          toc: true,
        },
        printTypeOptions: {
          codeSection: true,
          deprecated: "skip",
          parentTypePrefix: true,
          relatedTypeSection: true,
          typeBadges: true,
        },
        prettify: true,
        printer: "printer module",
        skipDocDirective: "doc directive",
      } as unknown as GeneratorOptions;

      jest.spyOn(CoreDiff, "hasChanges").mockResolvedValueOnce(true);
      jest
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(Utils, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);
      jest
        .spyOn(Utils, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      jest.spyOn(Utils, "getGroups").mockReturnValueOnce(undefined);
      jest.spyOn(Utils, "getCustomDirectives").mockReturnValueOnce(undefined);
      jest
        .spyOn(CorePrinter, "getPrinter")
        .mockResolvedValueOnce({} as unknown as typeof IPrinter);

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
        [
          "Remember to update your Docusaurus site's sidebars with "undefined".",
        ],
      ]
      `);
    });

    test("calls getDocumentLoaders and returns an error if loaders cannot be fetched", async () => {
      expect.assertions(3);

      const getDocumentLoadersSpy = jest
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce(undefined);
      const loggerSpy = jest.spyOn(console, "error");
      const loadSchemaSpy = jest.spyOn(Utils, "loadSchema");

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
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(Utils, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);
      jest
        .spyOn(Utils, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const loggerSpy = jest.spyOn(console, "info");
      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(true);

      await generateDocFromSchema({
        diffMethod: "diffMethod",
        tmpDir: "tmpDir",
        printTypeOptions: { deprecated: "skip" },
      } as unknown as GeneratorOptions);

      expect(hasChangesSpy).toHaveBeenCalledWith({}, "tmpDir", "diffMethod");
      expect(loggerSpy).not.toHaveBeenCalledWith(
        `No changes detected in schema "schemaLocation".`,
      );
    });

    test("skips hasChanges if DiffMethod is NONE", async () => {
      expect.assertions(1);

      jest
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(Utils, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);
      jest
        .spyOn(Utils, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const hasChangesSpy = jest.spyOn(CoreDiff, "hasChanges");

      await generateDocFromSchema({
        diffMethod: DiffMethod.NONE,
        tmpDir: "tmpDir",
        printTypeOptions: { deprecated: "skip" },
      } as unknown as GeneratorOptions);

      expect(hasChangesSpy).not.toHaveBeenCalled();
    });

    test("print info log is hasChanges is false", async () => {
      expect.assertions(2);

      jest
        .spyOn(Utils, "getDocumentLoaders")
        .mockResolvedValueOnce({} as LoadSchemaOptions);
      jest
        .spyOn(Utils, "loadSchema")
        .mockResolvedValueOnce({} as GraphQLSchema);
      jest
        .spyOn(Utils, "getSchemaMap")
        .mockReturnValueOnce({ objects: {} } as SchemaMap);
      const loggerSpy = jest.spyOn(console, "info");
      const hasChangesSpy = jest
        .spyOn(CoreDiff, "hasChanges")
        .mockResolvedValueOnce(false);

      await generateDocFromSchema({
        schemaLocation: "schemaLocation",
        diffMethod: "diffMethod",
        tmpDir: "tmpDir",
        printTypeOptions: { deprecated: "skip" },
      } as unknown as GeneratorOptions);

      expect(hasChangesSpy).toHaveBeenCalledWith({}, "tmpDir", "diffMethod");
      expect(loggerSpy).toHaveBeenCalledWith(
        `No changes detected in schema "schemaLocation".`,
      );
    });
  });
});
