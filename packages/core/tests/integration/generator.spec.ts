import { vol } from "memfs";
jest.mock("node:fs");

import { ClassName } from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/printer-legacy");
import Printer from "@graphql-markdown/printer-legacy";

jest.mock("@graphql-markdown/diff");
import * as diff from "@graphql-markdown/diff";

import { GeneratorOptions, generateDocFromSchema } from "../../src/generator";
import {
  DEFAULT_OPTIONS,
  DeprecatedOption,
  DiffMethod,
} from "../../src/config";

describe("renderer", () => {
  beforeEach(() => {
    jest.spyOn(Printer, "printType").mockImplementation((value) => value);

    vol.fromJSON({
      "/output": null,
      "/temp_test": null,
      "/assets/generated.md": "Dummy homepage for tweet.graphql",
    });
  });

  afterEach(() => {
    vol.reset();
    jest.restoreAllMocks();
  });

  describe("generateDocFromSchema()", () => {
    test("generates Markdown document structure from GraphQL schema", async () => {
      expect.assertions(1);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/tweet.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: DiffMethod.NONE,
        tmpDir: "/temp",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader",
        },
        printer: "@graphql-markdown/printer-legacy",
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
        },
      } as GeneratorOptions;

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
    });

    test('outputs "no schema changed" message when called twice', async () => {
      expect.assertions(1);

      const logSpy = jest.spyOn(console, "info");

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/tweet.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: "SCHEMA-HASH",
        tmpDir: "/temp",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader",
        },
        printer: "@graphql-markdown/printer-legacy",
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
        },
      } as GeneratorOptions;

      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValue(false);
      await generateDocFromSchema(config);

      expect(logSpy).toHaveBeenCalledWith(
        `No changes detected in schema "${config.schemaLocation}".`,
      );
    });

    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/schema_with_grouping.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: DiffMethod.NONE,
        tmpDir: "/temp",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader",
        },
        groupByDirective: {
          directive: "doc",
          field: "category",
          fallback: "misc",
        },
        printer: "@graphql-markdown/printer-legacy",
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
        },
      } as GeneratorOptions;

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });
  });
});
