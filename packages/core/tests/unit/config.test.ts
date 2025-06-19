import type {
  ClassName,
  CliOptions,
  ConfigOptions,
  CustomDirective,
  DirectiveName,
  GraphQLDirective,
  Maybe,
  PackageName,
  TypeDeprecatedOption,
  TypeDiffMethod,
  TypeHierarchyType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";

import { join } from "node:path";

import {
  buildConfig,
  DEFAULT_HIERARCHY,
  DEFAULT_OPTIONS,
  DiffMethod,
  getCustomDirectives,
  getDocDirective,
  getDocOptions,
  getOnlyDocDirectives,
  getSkipDocDirectives,
  getTypeHierarchyOption,
  getVisibilityDirectives,
  parseDeprecatedDocOptions,
  parseDeprecatedPrintTypeOptions,
  parseGroupByOption,
  parseHomepageOption,
  TypeHierarchy,
} from "../../src/config";

jest.mock("@graphql-markdown/utils");

describe("config", () => {
  beforeAll(() => {
    Object.assign(global, { logger: global.console });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    delete global.logger;
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
            printTypeOptions: { deprecated: "skip" as TypeDeprecatedOption },
          },
        },
      },
      {
        location: "configFileOpts",
        options: {
          cliOpt: { deprecated: "skip" },
          configFileOpts: {
            printTypeOptions: { deprecated: "group" as TypeDeprecatedOption },
          },
        },
      },
    ])("supports deprecated skip option in $location", ({ options }) => {
      expect.hasAssertions();

      expect(
        getSkipDocDirectives(
          options.cliOpt as CliOptions,
          options.configFileOpts as Maybe<
            Pick<ConfigOptions, "printTypeOptions" | "skipDocDirective">
          >,
        ),
      ).toStrictEqual(["deprecated"]);
    });

    // Test for StringLiteral mutations (line 346, 403, etc.)
    test("handles empty string directive correctly", () => {
      expect.hasAssertions();

      // Should reject empty string directives
      expect(() => {
        getSkipDocDirectives({ skip: "" as DirectiveName }, undefined);
      }).toThrow();
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

    test.each([
      ["example"],
      ["@example!"],
      [" @example"],
      ["@example "],
      ["prefix@example"],
      ["@test()"],
      ["@test(param|=)"],
      ["@test(|=default)"],
      ["@test(param|default)"],
    ])(
      "correctly handles regex patterns for directive parsing",
      (directive) => {
        expect.hasAssertions();

        expect(() => {
          return getDocDirective(directive as DirectiveName);
        }).toThrow(`Invalid "${directive}"`);
      },
    );

    // Test for StringLiteral mutations (various lines)
    test("handles empty string directive correctly", () => {
      expect.hasAssertions();

      // Should reject empty string directives
      expect(() => {
        getDocDirective("" as DirectiveName);
      }).toThrow();
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
          force: DEFAULT_OPTIONS.force,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          id: DEFAULT_OPTIONS.id,
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          metatags: DEFAULT_OPTIONS.metatags,
          outputDir: join(DEFAULT_OPTIONS.rootPath!, DEFAULT_OPTIONS.baseURL!),
          onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
          prettify: DEFAULT_OPTIONS.pretty,
          printer: DEFAULT_OPTIONS.printer,
          printTypeOptions: {
            ...DEFAULT_OPTIONS.printTypeOptions,
            hierarchy: DEFAULT_HIERARCHY,
          },
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
        },
        printTypeOptions: {
          codeSection: false,
          deprecated: "group",
          exampleSection: true,
          hierarchy: TypeHierarchy.ENTITY,
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
        docOptions: { ...configFileOpts.docOptions, frontMatter: {} },
        groupByDirective: configFileOpts.groupByDirective,
        force: DEFAULT_OPTIONS.force,
        homepageLocation: configFileOpts.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: configFileOpts.linkRoot,
        loaders: configFileOpts.loaders,
        mdxParser: undefined,
        metatags: DEFAULT_OPTIONS.metatags,
        outputDir: join(configFileOpts.rootPath!, configFileOpts.baseURL!),
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        prettify: configFileOpts.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: {
          ...configFileOpts.printTypeOptions,
          hierarchy: { entity: {} },
        },
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
          index: true,
        },
        printTypeOptions: {
          exampleSection: true,
          hierarchy: TypeHierarchy.ENTITY,
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
        noExample: true,
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
        force: DEFAULT_OPTIONS.force,
        groupByDirective: {
          directive: "group",
          fallback: "misc",
          field: "name",
        },
        homepageLocation: cliOpts.homepage,
        linkRoot: cliOpts.link,
        loaders: configFileOpts.loaders,
        mdxParser: undefined,
        metatags: DEFAULT_OPTIONS.metatags,
        outputDir: join(cliOpts.root!, cliOpts.base!),
        prettify: cliOpts.pretty,
        schemaLocation: cliOpts.schema,
        tmpDir: cliOpts.tmp,
        docOptions: {
          frontMatter: {},
          index: true,
        },
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          codeSection: false,
          deprecated: "group",
          hierarchy: { entity: {} },
          exampleSection: false,
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
        force: DEFAULT_OPTIONS.force,
        groupByDirective: undefined,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        loaders: configFileOpts.loaders,
        mdxParser: undefined,
        metatags: DEFAULT_OPTIONS.metatags,
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        outputDir: join(DEFAULT_OPTIONS.rootPath!, configFileOpts.baseURL!),
        prettify: cliOpts.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: DEFAULT_HIERARCHY,
        },
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
        force: cliOpts.force,
        groupByDirective: DEFAULT_OPTIONS.groupByDirective,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        loaders: {},
        mdxParser: undefined,
        metatags: DEFAULT_OPTIONS.metatags,
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        outputDir: join(DEFAULT_OPTIONS.rootPath!, DEFAULT_OPTIONS.baseURL!),
        prettify: DEFAULT_OPTIONS.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: DEFAULT_HIERARCHY,
        },
        schemaLocation: DEFAULT_OPTIONS.schema,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
      });
    });

    test("force overrides diffMethod to FORCE", async () => {
      expect.hasAssertions();

      const configFileOpts: ConfigOptions = {
        diffMethod: DiffMethod.NONE,
        force: true,
        loaders: {},
      };

      const input = await buildConfig(configFileOpts);

      expect(input).toStrictEqual({
        baseURL: DEFAULT_OPTIONS.baseURL,
        customDirective: DEFAULT_OPTIONS.customDirective,
        diffMethod: DiffMethod.FORCE as TypeDiffMethod,
        docOptions: DEFAULT_OPTIONS.docOptions,
        force: configFileOpts.force,
        groupByDirective: DEFAULT_OPTIONS.groupByDirective,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        id: DEFAULT_OPTIONS.id,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        loaders: {},
        mdxParser: undefined,
        metatags: DEFAULT_OPTIONS.metatags,
        onlyDocDirective: DEFAULT_OPTIONS.onlyDocDirective,
        outputDir: join(DEFAULT_OPTIONS.rootPath!, DEFAULT_OPTIONS.baseURL!),
        prettify: DEFAULT_OPTIONS.pretty,
        printer: DEFAULT_OPTIONS.printer,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: DEFAULT_HIERARCHY,
        },
        schemaLocation: DEFAULT_OPTIONS.schema,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
      });
    });

    test("correctly handles conditional expressions for homepage option", async () => {
      expect.hasAssertions();

      // Test with homepage defined
      const configWithHomepage = await buildConfig({
        homepage: "custom-homepage.md",
        loaders: {},
      });

      expect(configWithHomepage.homepageLocation).toBe("custom-homepage.md");

      // Test with homepage undefined (should use default)
      const configWithoutHomepage = await buildConfig({
        loaders: {},
      });

      expect(configWithoutHomepage.homepageLocation).toEqual(
        expect.stringMatching(/assets\/generated.md$/),
      );
    });

    test("correctly handles string literals in configuration", async () => {
      expect.hasAssertions();

      // Test with empty string values
      const config = await buildConfig({
        baseURL: "",
        schema: "",
        loaders: {},
      });

      expect(config.baseURL).toBe("");
      expect(config.schemaLocation).toBe("");

      // Test with non-empty values
      const configWithValues = await buildConfig({
        baseURL: "docs",
        schema: "schema.graphql",
        loaders: {},
      });

      expect(configWithValues.baseURL).toBe("docs");
      expect(configWithValues.schemaLocation).toBe("schema.graphql");
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

    // Test for Regex mutation (line 682)
    test("handles complex directive patterns correctly", () => {
      expect.hasAssertions();

      // Test normal case
      expect(parseGroupByOption("@doc(field|=fallback)")).toStrictEqual({
        directive: "doc",
        field: "field",
        fallback: "fallback",
      });

      // Test non-standard but valid format cases
      expect(
        parseGroupByOption("@directive123(field_name|=fallback_value)"),
      ).toStrictEqual({
        directive: "directive123",
        field: "field_name",
        fallback: "fallback_value",
      });

      // Should reject malformed directives
      expect(() => {
        return parseGroupByOption("@(field|=fallback)");
      }).toThrow();
      expect(() => {
        return parseGroupByOption("@doc(|=fallback)");
      }).toThrow();
    });

    test.each([[null], [undefined], [42], [{}]])(
      "returns undefined if %s not a string",
      (value: unknown) => {
        expect.hasAssertions();

        expect(parseGroupByOption(value)).toBeUndefined();
      },
    );
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
        `Wrong format for plugin custom directive "test".\nPlease refer to https://graphql-markdown.dev/docs/advanced/custom-directive`,
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

  describe("getDocOptions()", () => {
    test("returns object with default index and default frontMatter", () => {
      expect.assertions(2);

      const { index, frontMatter } = getDocOptions();

      expect(index).toBeFalsy();
      expect(frontMatter).toStrictEqual({});
    });

    test("returns object with parsed index from cli", () => {
      expect.assertions(2);

      const { index, frontMatter } = getDocOptions({ index: true });

      expect(index).toBeTruthy();
      expect(frontMatter).toStrictEqual({});
    });

    test("returns object with parsed index from config", () => {
      expect.assertions(2);

      const { index, frontMatter } = getDocOptions(undefined, {
        index: true,
        frontMatter: undefined,
      });

      expect(index).toBeTruthy();
      expect(frontMatter).toStrictEqual({});
    });

    test("returns object with parsed frontMatter from config", () => {
      expect.assertions(2);

      const { index, frontMatter } = getDocOptions(undefined, {
        frontMatter: { draft: true },
      });

      expect(index).toBeFalsy();
      expect(frontMatter).toStrictEqual({ draft: true });
    });
  });

  describe("parseDeprecatedPrintTypeOptions", () => {
    test("returns empty object if no deprecated option", () => {
      expect.hasAssertions();

      const cliOpt = {},
        configOptions = undefined;

      const spyConsole = jest.spyOn(global.console, "warn");

      expect(
        parseDeprecatedPrintTypeOptions(cliOpt, configOptions),
      ).toStrictEqual({});
      expect(spyConsole).not.toHaveBeenCalled();
    });
  });

  describe("parseDeprecatedDocOptions", () => {
    test("returns empty object if no deprecated option", () => {
      expect.hasAssertions();

      const cliOpt = {},
        configOptions = undefined;

      const spyConsole = jest.spyOn(global.console, "warn");

      expect(parseDeprecatedDocOptions(cliOpt, configOptions)).toStrictEqual(
        {},
      );
      expect(spyConsole).not.toHaveBeenCalled();
    });
  });

  describe("getTypeHierarchyOption()", () => {
    test("returns default if not set", () => {
      expect.assertions(1);

      const hierarchy = getTypeHierarchyOption();

      expect(hierarchy).toStrictEqual(DEFAULT_HIERARCHY);
    });

    test("throws an error if cli and config are different", () => {
      expect.assertions(1);

      expect(() => {
        return getTypeHierarchyOption(TypeHierarchy.ENTITY, TypeHierarchy.FLAT);
      }).toThrow(
        `Hierarchy option mismatch in CLI flag '${TypeHierarchy.ENTITY}' and config '${TypeHierarchy.FLAT}'`,
      );
    });

    test("returns advanced config if set", () => {
      expect.assertions(1);

      const option = {
        [TypeHierarchy.API]: { operations: "api" },
      };
      const hierarchy = getTypeHierarchyOption(undefined, option);

      expect(hierarchy).toStrictEqual(option);
    });

    test.each([
      { config: TypeHierarchy.ENTITY, cli: undefined },
      { config: TypeHierarchy.API, cli: undefined },
      { config: TypeHierarchy.FLAT, cli: undefined },
    ])(
      "returns config hierarchy if set",
      ({
        config,
        cli,
      }: {
        config: Maybe<TypeHierarchyType>;
        cli: Maybe<TypeHierarchyValueType>;
      }) => {
        expect.assertions(1);

        const hierarchy = getTypeHierarchyOption(cli, config);

        expect(hierarchy).toStrictEqual({ [config as string]: {} });
      },
    );

    test.each([
      { cli: TypeHierarchy.ENTITY, config: undefined },
      { cli: TypeHierarchy.API, config: undefined },
      { cli: TypeHierarchy.FLAT, config: undefined },
    ])(
      "returns cli hierarchy if set",
      ({
        config,
        cli,
      }: {
        config: Maybe<TypeHierarchyType>;
        cli: Maybe<TypeHierarchyValueType>;
      }) => {
        expect.assertions(1);

        const hierarchy = getTypeHierarchyOption(cli, config);

        expect(hierarchy).toStrictEqual({ [cli as string]: {} });
      },
    );

    test("handles string literals in hierarchy configuration", () => {
      expect.assertions(3);

      // Test with empty string (should use default)
      const emptyHierarchy = getTypeHierarchyOption(
        "" as TypeHierarchyValueType,
      );
      expect(emptyHierarchy).toStrictEqual(DEFAULT_HIERARCHY);

      // Test with specific hierarchy type
      const apiHierarchy = getTypeHierarchyOption(TypeHierarchy.API);
      expect(apiHierarchy).toStrictEqual({ [TypeHierarchy.API]: {} });

      // Test with different type
      const flatHierarchy = getTypeHierarchyOption(TypeHierarchy.FLAT);
      expect(flatHierarchy).toStrictEqual({ [TypeHierarchy.FLAT]: {} });
    });

    test("handles conditional expressions in config detection", () => {
      expect.assertions(2);

      // Test with truthy conditional
      const configHierarchy = {
        [TypeHierarchy.API]: {
          operations: "Operations",
          types: "Types",
        },
      };

      const result1 = getTypeHierarchyOption(undefined, configHierarchy);
      expect(result1).toStrictEqual(configHierarchy);

      // Test with both CLI and config set to same value (should not throw)
      const result2 = getTypeHierarchyOption(
        TypeHierarchy.API,
        TypeHierarchy.API,
      );
      expect(result2).toStrictEqual({ [TypeHierarchy.API]: {} });
    });

    test.each([
      [undefined, undefined],
      [null, undefined],
    ])("handles type hierarchy edge cases", (cliOption, configOption) => {
      expect.hasAssertions();

      // Test with undefined/null values
      expect(getTypeHierarchyOption(cliOption, configOption)).toStrictEqual(
        DEFAULT_HIERARCHY,
      );
    });
  });

  describe("parseHomepageOption", () => {
    test("returns default homepage no option passed", () => {
      expect.hasAssertions();

      expect(parseHomepageOption(undefined, undefined)).toStrictEqual(
        DEFAULT_OPTIONS.homepage,
      );
    });

    test("returns cli homepage if set", () => {
      expect.hasAssertions();

      expect(parseHomepageOption("homepage.md", undefined)).toBe("homepage.md");
    });

    test("returns config homepage if set", () => {
      expect.hasAssertions();

      expect(parseHomepageOption(undefined, "config.md")).toBe("config.md");
    });

    test("returns undefined if config homepage is false", () => {
      expect.hasAssertions();

      expect(parseHomepageOption(undefined, false)).toBeUndefined();
    });

    test("returns cli homepage override config homepage", () => {
      expect.hasAssertions();

      expect(parseHomepageOption("homepage.md", "config.md")).toBe(
        "homepage.md",
      );
    });
  });
});
