/* eslint-disable @typescript-eslint/no-base-to-string */
import path, { join } from "node:path";

import { vol } from "memfs";
jest.mock("fs");
jest.mock("node:fs/promises");

import type {
  ClassName,
  ConfigPrintTypeOptions,
  DirectiveName,
  GeneratorOptions,
  MDXString,
  PackageName,
  TypeDiffMethod,
} from "@graphql-markdown/types";

jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

jest.mock("@graphql-markdown/diff");
import * as diff from "@graphql-markdown/diff";

jest.mock(
  "mdx-parser-mock",
  () => {
    return {
      generateIndexMetafile: (dirPath: string, category: string): string => {
        return path.join(dirPath, category).toLocaleLowerCase();
      },
    };
  },
  { virtual: true },
);

import { generateDocFromSchema } from "../../src/generator";
import {
  DEFAULT_OPTIONS,
  DeprecatedOption,
  DiffMethod,
  TypeHierarchy,
} from "../../src/config";

describe("renderer", () => {
  beforeEach(() => {
    // silent console
    jest.spyOn(global.console, "info").mockImplementation(() => {});
    jest.spyOn(global.console, "error").mockImplementation(() => {});

    jest.spyOn(Printer, "printType").mockImplementation((value) => {
      return value as MDXString;
    });

    vol.fromJSON({
      "/output": null,
      "/temp_test": null,
      "/assets/generated.md": "Dummy homepage for tweet.graphql",
    });
  });

  afterEach(() => {
    vol.reset();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("generateDocFromSchema()", () => {
    test("generates Markdown document structure from GraphQL schema", async () => {
      expect.assertions(1);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        metatags: [],
        mdxParser: "mdx-parser-mock" as PackageName,
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        },
        schemaLocation: join(__dirname, "../__data__/tweet.graphql"),
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
    });

    test('outputs "no schema changed" message when called twice', async () => {
      expect.assertions(1);

      const logSpy = jest.spyOn(console, "info");

      const config: GeneratorOptions = {
        baseURL: "graphql",
        customDirective: undefined,
        diffMethod: "SCHEMA-HASH" as TypeDiffMethod,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        } as Required<ConfigPrintTypeOptions>,
        schemaLocation: join(__dirname, "../__data__/tweet.graphql"),
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValue(false);
      await generateDocFromSchema(config);

      expect(logSpy).toHaveBeenCalledWith(
        `No changes detected in schema "${String(config.schemaLocation)}".`,
      );
    });

    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });

    test("Markdown document structure from GraphQL schema is correct when using api hierarchy", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: { [TypeHierarchy.API]: {} },
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });

    test("Markdown document structure from GraphQL schema is correct when using flat hierarchy", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: { [TypeHierarchy.FLAT]: {} },
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });
  });
});
