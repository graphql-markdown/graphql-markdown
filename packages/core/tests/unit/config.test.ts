import type {
  ClassName,
  CliOptions,
  ConfigOptions,
  CustomDirective,
  DirectiveName,
  GraphQLDirective,
  Maybe,
  PackageName,
  TypeDiffMethod,
} from "@graphql-markdown/types";

import { join } from "node:path";

import {
  buildConfig,
  DEFAULT_OPTIONS,
  DiffMethod,
  getCustomDirectives,
  getDocDirective,
  getOnlyDocDirectives,
  getSkipDocDirectives,
  getVisibilityDirectives,
  parseGroupByOption,
} from "../../src/config";

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
        getSkipDocDirectives({ skip: "@noDoc" as DirectiveName }, undefined),
      ).toStrictEqual(["noDoc"]);
    });

    test.each([
      {
        location: "configFileOpts",
        options: {
          cliOpt: undefined,
          configFileOpts: {
            printTypeOptions: { deprecated: "skip" },
          },
        },
      },
      {
        location: "configFileOpts",
        options: {
          cliOpt: { deprecated: "skip" },
          configFileOpts: {
            printTypeOptions: { deprecated: "group" },
          },
        },
      },
    ])("supports deprecated skip option in $location", ({ options }) => {
      expect.hasAssertions();

      expect(
        getSkipDocDirectives(
          options.cliOpt as CliOptions,
          options.configFileOpts,
        ),
      ).toStrictEqual(["deprecated"]);
    });
  });

  describe("getOnlyDocDirectives", () => {
    test("returns a list of directive names", () => {
      expect.hasAssertions();

      expect(
        getOnlyDocDirectives(
          { only: ["@public" as DirectiveName] },
          { onlyDocDirective: ["@admin" as DirectiveName] },
        ),
      ).toStrictEqual(["public", "admin"]);
    });

    test("supports string as input", () => {
      expect.hasAssertions();

      expect(
        getOnlyDocDirectives({ only: "@public" as DirectiveName }, undefined),
      ).toStrictEqual(["public"]);
    });
  });

  describe("getVisibilityDirectives", () => {
    test("returns a list of skip and only directive names", () => {
      expect.hasAssertions();

      expect(
        getVisibilityDirectives(
          {
            only: ["@public" as DirectiveName],
            skip: ["@noDoc" as DirectiveName],
          },
          {
            onlyDocDirective: ["@admin" as DirectiveName],
            skipDocDirective: ["@deprecated" as DirectiveName],
          },
        ),
      ).toStrictEqual({
        onlyDocDirective: ["public", "admin"],
        skipDocDirective: ["noDoc", "deprecated"],
      });
    });

    test("throws an errors if a directive is declared both as only and skip", () => {
      expect.hasAssertions();

      expect(() => {
        return getVisibilityDirectives(
          {
            only: ["@admin" as DirectiveName],
          },
          {
            skipDocDirective: ["@admin" as DirectiveName],
          },
        );
      }).toThrow(Error);
    });
  });

  describe("getDocDirective", () => {
    test("returns a directive name", () => {
      expect.hasAssertions();

      expect(getDocDirective("@noDoc" as DirectiveName)).toBe("noDoc");
    });

    test("throws an error if not a string", () => {
      expect.hasAssertions();

      expect(() => {
        return getDocDirective({} as unknown as DirectiveName);
      }).toThrow(Error);
    });

    test("throws an error if format is not a directive", () => {
      expect.hasAssertions();

      expect(() => {
        return getDocDirective("+NotADirective@" as DirectiveName);
      }).toThrow(`Invalid "+NotADirective@"`);
    });
  });

  describe("buildConfig()", () => {
    test("returns default options is no config set", async () => {
      expect.hasAssertions();

      const config = await buildConfig(undefined, undefined);

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: DEFAULT_OPTIONS.baseURL,
          customDirective: DEFAULT_OPTIONS.customDirective,
          diffMethod: DEFAULT_OPTIONS.diffMethod,
          docOptions: DEFAULT_OPTIONS.docOptions,
          groupByDirective: DEFAULT_OPTIONS.groupByDirective,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          id: DEFAULT_OPTIONS.id,
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          outputDir: join(DEFAULT_OPTIONS.rootPath, DEFAULT_OPTIONS.baseURL),
          onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
          prettify: DEFAULT_OPTIONS.pretty,
          printer: DEFAULT_OPTIONS.printer,
          printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
          schemaLocation: DEFAULT_OPTIONS.schema,
          skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
          tmpDir: expect.stringMatching(/.+@graphql-markdown\/docusaurus$/),
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
        diffMethod: "NO-DIFF" as TypeDiffMethod,
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
            ): string => {
              return `Test${node!.name}`;
            },
          } as CustomDirective,
        },
      };

      const config = await buildConfig(configFileOpts, undefined);

      expect(config).toStrictEqual({
        baseURL: configFileOpts.baseURL,
        customDirective: configFileOpts.customDirective,
        diffMethod: configFileOpts.diffMethod,
        docOptions: configFileOpts.docOptions,
        groupByDirective: configFileOpts.groupByDirective,
        homepageLocation: configFileOpts.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: configFileOpts.linkRoot,
        loaders: configFileOpts.loaders,
        outputDir: join(configFileOpts.rootPath!, configFileOpts.baseURL!),
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        prettify: configFileOpts.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: configFileOpts.printTypeOptions,
        schemaLocation: configFileOpts.schema,
        skipDocDirective: ["noDoc"],
        tmpDir: configFileOpts.tmpDir,
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
        diffMethod: "NO-DIFF" as TypeDiffMethod,
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
        diff: "CLI" as TypeDiffMethod,
        groupByDirective: "@group(name|=misc)",
        homepage: "cli/my-homepage.md",
        index: true,
        link: "/cli",
        noCode: true,
        noPagination: true,
        noToc: true,
        only: "@public",
        pretty: true,
        root: "cli",
        schema: "cli/my-schema.graphql",
        skip: "@noDoc",
        tmp: "./cli",
      };

      const config = await buildConfig(configFileOpts, cliOpts);

      expect(config).toStrictEqual({
        id: DEFAULT_OPTIONS.id,
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
        onlyDocDirective: ["public"],
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
        customDirective: DEFAULT_OPTIONS.customDirective,
        diffMethod: DEFAULT_OPTIONS.diffMethod,
        docOptions: DEFAULT_OPTIONS.docOptions,
        groupByDirective: undefined,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        loaders: configFileOpts.loaders,
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        outputDir: join(DEFAULT_OPTIONS.rootPath, configFileOpts.baseURL!),
        prettify: cliOpts.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
        schemaLocation: cliOpts.schema,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
      });
    });

    test("force flag from CLI switches diff method to FORCE", async () => {
      expect.hasAssertions();

      const cliOpts: CliOptions = { force: true };

      const input = await buildConfig({ loaders: {} }, cliOpts);

      expect(input).toStrictEqual({
        baseURL: DEFAULT_OPTIONS.baseURL,
        customDirective: DEFAULT_OPTIONS.customDirective,
        diffMethod: DiffMethod.FORCE as TypeDiffMethod,
        docOptions: DEFAULT_OPTIONS.docOptions,
        groupByDirective: DEFAULT_OPTIONS.groupByDirective,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        loaders: {},
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        outputDir: join(DEFAULT_OPTIONS.rootPath, DEFAULT_OPTIONS.baseURL),
        prettify: DEFAULT_OPTIONS.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
        schemaLocation: DEFAULT_OPTIONS.schema,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
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

      expect(getCustomDirectives(undefined, undefined)).toBeUndefined();
    });

    test("returns undefined if empty", () => {
      expect.hasAssertions();

      expect(getCustomDirectives({}, undefined)).toBeUndefined();
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

    test.each([
      {
        case: "undefined",
        options: {
          test: {},
        },
      },

      {
        case: "descriptor is not a function",
        options: {
          test: {
            descriptor: {},
          },
        },
      },

      {
        case: "tag is is not a function",
        options: {
          test: {
            descriptor: (): void => {},
            tag: {},
          },
        },
      },
    ])("throws an error if format is $case", ({ options }) => {
      expect.assertions(1);

      expect(() => {
        getCustomDirectives(options as Maybe<CustomDirective>);
      }).toThrow(
        `Wrong format for plugin custom directive "test".\nPlease refer to https://graphql-markdown.github.io/docs/advanced/custom-directive`,
      );
    });

    test("returns custom directive maps", () => {
      expect.hasAssertions();

      const descriptor = (
        _: GraphQLDirective,
        constDirectiveType: GraphQLDirective,
      ): string => {
        return `Test${constDirectiveType.name}`;
      };
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
