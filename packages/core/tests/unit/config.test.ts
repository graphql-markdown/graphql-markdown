import { join } from "node:path";

import { GraphQLDirective } from "graphql";

import { COMPARE_METHOD } from "@graphql-markdown/diff";

import type {
  DirectiveName,
  ClassName,
  PackageName,
  CustomDirective,
} from "@graphql-markdown/utils";

import * as config from "../../src/config";
const {
  buildConfig,
  getSkipDocDirectives,
  getSkipDocDirective,
  parseGroupByOption,
  getCustomDirectives,
  DEFAULT_OPTIONS,
} = config;

import { type ConfigOptions, type CliOptions } from "../../src/config";

jest.mock("@graphql-markdown/utils");

describe("config", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getSkipDocDirectives", () => {
    test("returns a list of directive names", () => {
      expect.hasAssertions();

      expect(
        getSkipDocDirectives(
          { skip: ["@noDoc" as DirectiveName] },
          { skipDocDirective: ["@deprecated" as DirectiveName] },
        ),
      ).toStrictEqual(["noDoc", "deprecated"]);
    });

    test("supports string as input", () => {
      expect.hasAssertions();

      expect(
        getSkipDocDirectives({ skip: "@noDoc" as DirectiveName }),
      ).toStrictEqual(["noDoc"]);
    });

    test("supports deprecated skip option", () => {
      expect.hasAssertions();

      expect(
        getSkipDocDirectives(undefined, {
          printTypeOptions: { deprecated: "skip" },
        }),
      ).toStrictEqual(["deprecated"]);
    });
  });

  describe("getSkipDocDirective", () => {
    test("returns a directive name", () => {
      expect.hasAssertions();

      expect(getSkipDocDirective("@noDoc" as DirectiveName)).toBe("noDoc");
    });

    test("throws an error if not a string", () => {
      expect.hasAssertions();

      expect(() =>
        getSkipDocDirective("+NotADirective@" as DirectiveName),
      ).toThrow(Error);
    });

    test("throws an error if format is not a directive", () => {
      expect.hasAssertions();

      expect(() =>
        getSkipDocDirective("+NotADirective@" as DirectiveName),
      ).toThrow(Error);
    });
  });

  describe("buildConfig()", () => {
    test("returns default options is no config set", async () => {
      expect.hasAssertions();

      const config = await buildConfig();

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: DEFAULT_OPTIONS.baseURL,
          diffMethod: DEFAULT_OPTIONS.diffMethod,
          groupByDirective: DEFAULT_OPTIONS.groupByDirective,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          outputDir: join(DEFAULT_OPTIONS.rootPath, DEFAULT_OPTIONS.baseURL),
          prettify: DEFAULT_OPTIONS.pretty,
          schemaLocation: DEFAULT_OPTIONS.schema,
          tmpDir: expect.stringMatching(/.+@graphql-markdown\/docusaurus$/),
          docOptions: DEFAULT_OPTIONS.docOptions,
          printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
          printer: DEFAULT_OPTIONS.printer,
          skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
          customDirective: DEFAULT_OPTIONS.customDirective,
        }),
      );
    });

    test("override default options is config set in docusaurus", async () => {
      expect.hasAssertions();

      const configFileOpts: ConfigOptions = {
        baseURL: "docs/schema",
        schema: "assets/my-schema.graphql",
        rootPath: "output",
        linkRoot: "/docs",
        homepage: "assets/my-homepage.md",
        diffMethod: "NO-DIFF",
        tmpDir: "./tmp",
        loaders: {
          ["UrlLoader" as ClassName]:
            "@graphql-tools/url-loader" as PackageName,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          fallback: "Common",
          field: "category",
        },
        pretty: true,
        docOptions: {
          index: false,
          pagination: false,
          toc: false,
        },
        printTypeOptions: {
          codeSection: false,
          deprecated: "group",
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: false,
        },
        skipDocDirective: ["@noDoc" as DirectiveName],
        customDirective: {
          ["test" as DirectiveName]: {
            descriptor: (
              directiveType?: GraphQLDirective,
              node?: GraphQLDirective,
            ): string => `Test${node!.name}`,
          } as CustomDirective,
        },
      };

      const config = await buildConfig(configFileOpts);

      expect(config).toStrictEqual({
        baseURL: configFileOpts.baseURL,
        diffMethod: configFileOpts.diffMethod,
        groupByDirective: configFileOpts.groupByDirective,
        homepageLocation: configFileOpts.homepage,
        linkRoot: configFileOpts.linkRoot,
        loaders: configFileOpts.loaders,
        outputDir: join(configFileOpts.rootPath!, configFileOpts.baseURL!),
        prettify: configFileOpts.pretty,
        schemaLocation: configFileOpts.schema,
        tmpDir: configFileOpts.tmpDir,
        docOptions: configFileOpts.docOptions,
        printTypeOptions: configFileOpts.printTypeOptions,
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: ["noDoc"],
        customDirective: configFileOpts.customDirective,
      });
    });

    test("override config set in docusaurus if cli options set", async () => {
      expect.hasAssertions();

      const configFileOpts: ConfigOptions = {
        baseURL: "docs/schema",
        schema: "assets/my-schema.graphql",
        rootPath: "output",
        linkRoot: "/docs",
        homepage: "assets/my-homepage.md",
        diffMethod: "NO-DIFF",
        tmpDir: "./tmp",
        loaders: {
          ["UrlLoader" as ClassName]:
            "@graphql-tools/url-loader" as PackageName,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "Common",
        },
        docOptions: {
          pagination: true,
          toc: true,
          index: true,
        },
      };

      const cliOpts: CliOptions = {
        base: "cli/schema",
        deprecated: "group",
        diff: "CLI",
        groupByDirective: "@group(name|=misc)",
        homepage: "cli/my-homepage.md",
        index: true,
        link: "/cli",
        noCode: true,
        noPagination: true,
        noToc: true,
        pretty: true,
        root: "cli",
        schema: "cli/my-schema.graphql",
        skip: "@noDoc",
        tmp: "./cli",
      };

      const config = await buildConfig(configFileOpts, cliOpts);

      expect(config).toStrictEqual({
        baseURL: cliOpts.base,
        diffMethod: cliOpts.diff,
        groupByDirective: {
          directive: "group",
          fallback: "misc",
          field: "name",
        },
        homepageLocation: cliOpts.homepage,
        linkRoot: cliOpts.link,
        loaders: configFileOpts.loaders,
        outputDir: join(cliOpts.root!, cliOpts.base!),
        prettify: cliOpts.pretty,
        schemaLocation: cliOpts.schema,
        tmpDir: cliOpts.tmp,
        docOptions: {
          pagination: !cliOpts.noPagination,
          toc: !cliOpts.noToc,
          index: cliOpts.index,
        },
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          codeSection: false,
          deprecated: "group",
        },
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: ["noDoc"],
        customDirective: DEFAULT_OPTIONS.customDirective,
      });
    });

    test("schema option from CLI overrides that of config file", async () => {
      expect.hasAssertions();

      const configFileOpts: ConfigOptions = {
        baseURL: "base-from-config-file",
        schema: "schemaFromConfigFile.graphql",
        loaders: {},
      };
      const cliOpts: CliOptions = {
        pretty: true,
        schema: "schemaFromCLI.graphql",
      };

      const input = await buildConfig(configFileOpts, cliOpts);

      expect(input).toStrictEqual({
        baseURL: configFileOpts.baseURL,
        schemaLocation: cliOpts.schema,
        outputDir: join(DEFAULT_OPTIONS.rootPath, configFileOpts.baseURL!),
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        diffMethod: DEFAULT_OPTIONS.diffMethod,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
        loaders: DEFAULT_OPTIONS.loaders,
        groupByDirective: undefined,
        prettify: cliOpts.pretty,
        docOptions: DEFAULT_OPTIONS.docOptions,
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        customDirective: DEFAULT_OPTIONS.customDirective,
      });
    });

    test("force flag from CLI switches diff method to FORCE", async () => {
      expect.hasAssertions();

      const cliOpts: CliOptions = { force: true };

      const input = await buildConfig({ loaders: {} }, cliOpts);

      expect(input).toStrictEqual({
        baseURL: DEFAULT_OPTIONS.baseURL,
        schemaLocation: DEFAULT_OPTIONS.schema,
        outputDir: join(DEFAULT_OPTIONS.rootPath, DEFAULT_OPTIONS.baseURL),
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        diffMethod: COMPARE_METHOD.FORCE,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
        loaders: DEFAULT_OPTIONS.loaders,
        groupByDirective: DEFAULT_OPTIONS.groupByDirective,
        prettify: DEFAULT_OPTIONS.pretty,
        docOptions: DEFAULT_OPTIONS.docOptions,
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        customDirective: DEFAULT_OPTIONS.customDirective,
      });
    });
  });

  describe("parseGroupByOption()", () => {
    test("returns object with groupBy config", () => {
      expect.assertions(3);

      const groupOptionsFlag = "@doc(category|=common)";
      const { directive, field, fallback } =
        parseGroupByOption(groupOptionsFlag)!;

      expect(directive).toBe("doc");
      expect(field).toBe("category");
      expect(fallback).toBe("common");
    });

    test("returns object with default fallback if not set", () => {
      expect.assertions(3);

      const groupOptionsFlag = "@doc(category)";
      const { directive, field, fallback } =
        parseGroupByOption(groupOptionsFlag)!;

      expect(directive).toBe("doc");
      expect(field).toBe("category");
      expect(fallback).toBe("Miscellaneous");
    });

    test("throws an error if string format is invalid", () => {
      expect.assertions(1);

      const groupOptionsFlag = "@doc(category|=)";

      expect(() => {
        parseGroupByOption(groupOptionsFlag);
      }).toThrow(`Invalid "${groupOptionsFlag}"`);
    });

    test.each([
      [undefined],
      [null],
      [1],
      [["foobar"]],
      [{ groupOptions: "foobar" }],
    ])("returns undefined if groupOptions is not a string", (groupOptions) => {
      expect.hasAssertions();

      expect(parseGroupByOption(groupOptions)).toBeUndefined();
    });
  });

  describe("getCustomDirectives", () => {
    test("returns undefined if not configured", () => {
      expect.hasAssertions();

      expect(getCustomDirectives()).toBeUndefined();
    });

    test("returns undefined if specified directives are skipped", () => {
      expect.hasAssertions();

      const options = {
        test: {},
      };

      expect(
        getCustomDirectives(options, ["test" as DirectiveName]),
      ).toBeUndefined();
    });

    test("throws an error if descriptor format is invalid", () => {
      expect.assertions(1);

      const options = {
        test: {},
      };

      expect(() => {
        getCustomDirectives(options);
      }).toThrow(
        `Wrong format for plugin custom directive "test".\nPlease refer to https://graphql-markdown.github.io/docs/advanced/custom-directive`,
      );
    });

    test("returns custom directive maps", () => {
      expect.hasAssertions();

      const descriptor = (
        _: GraphQLDirective,
        constDirectiveType: GraphQLDirective,
      ) => `Test${constDirectiveType.name}`;
      const options = {
        testA: { descriptor },
        testB: { descriptor },
      };

      expect(getCustomDirectives(options, ["testB" as DirectiveName]))
        .toMatchInlineSnapshot(`
      {
        "testA": {
          "descriptor": [Function],
        },
      }
      `);
    });
  });
});
