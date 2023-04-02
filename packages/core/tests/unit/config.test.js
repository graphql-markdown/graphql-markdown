const { join } = require("path");

const { COMPARE_METHOD } = require("@graphql-markdown/diff");

const {
  buildConfig,
  getSkipDocDirectives,
  getSkipDocDirective,
  DEFAULT_OPTIONS,
} = require("../../src/config");

jest.mock("../../src/group-info");
const groupInfo = require("../../src/group-info");

describe("config", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getSkipDocDirectives", () => {
    test("returns a list of directive names", () => {
      expect.hasAssertions();

      expect(getSkipDocDirectives(["@noDoc"], ["@deprecated"])).toStrictEqual([
        "noDoc",
        "deprecated",
      ]);
    });

    test("supports string as input", () => {
      expect.hasAssertions();

      expect(getSkipDocDirectives("@noDoc")).toStrictEqual(["noDoc"]);
    });
  });

  describe("getSkipDocDirective", () => {
    test("returns a directive name", () => {
      expect.hasAssertions();

      expect(getSkipDocDirective("@noDoc")).toBe("noDoc");
    });

    test("throws an error if not a string", () => {
      expect.hasAssertions();

      expect(() => getSkipDocDirective("+NotADirective@")).toThrow(Error);
    });

    test("throws an error if format is not a directive", () => {
      expect.hasAssertions();

      expect(() => getSkipDocDirective("+NotADirective@")).toThrow(Error);
    });
  });

  describe("buildConfig()", () => {
    test("returns default options is no config set", () => {
      expect.hasAssertions();

      jest.spyOn(groupInfo, "parseGroupByOption").mockReturnValue(undefined);

      const config = buildConfig();

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
        }),
      );
    });

    test("override default options is config set in docusaurus", () => {
      expect.hasAssertions();

      jest.spyOn(groupInfo, "parseGroupByOption").mockReturnValue(undefined);

      const configFileOpts = {
        baseURL: "docs/schema",
        schema: "assets/my-schema.graphql",
        rootPath: "output",
        linkRoot: "/docs",
        homepage: "assets/my-homepage.md",
        diffMethod: "NO-DIFF",
        tmpDir: "./tmp",
        loaders: {
          UrlLoader: "@graphql-tools/url-loader",
        },
        groupByDirective: {
          directive: "doc",
          field: "category",
          fallback: "Common",
        },
        pretty: true,
        docOptions: {
          pagination: false,
          toc: false,
          index: false,
        },
        printTypeOptions: {
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: false,
          deprecated: "group",
        },
        skipDocDirective: ["@noDoc"],
      };

      const config = buildConfig(configFileOpts);

      expect(config).toStrictEqual({
        baseURL: configFileOpts.baseURL,
        diffMethod: configFileOpts.diffMethod,
        groupByDirective: configFileOpts.groupByDirective,
        homepageLocation: configFileOpts.homepage,
        linkRoot: configFileOpts.linkRoot,
        loaders: configFileOpts.loaders,
        outputDir: join(configFileOpts.rootPath, configFileOpts.baseURL),
        prettify: configFileOpts.pretty,
        schemaLocation: configFileOpts.schema,
        tmpDir: configFileOpts.tmpDir,
        docOptions: configFileOpts.docOptions,
        printTypeOptions: configFileOpts.printTypeOptions,
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: ["noDoc"],
      });
    });

    test("override config set in docusaurus if cli options set", () => {
      expect.hasAssertions();

      const configFileOpts = {
        baseURL: "docs/schema",
        schema: "assets/my-schema.graphql",
        rootPath: "output",
        linkRoot: "/docs",
        homepage: "assets/my-homepage.md",
        diffMethod: "NO-DIFF",
        tmpDir: "./tmp",
        loaders: {
          UrlLoader: "@graphql-tools/url-loader",
        },
        groupByDirective: {
          directive: "doc",
          field: "category",
          fallback: "Common",
        },
        docOptions: {
          pagination: true,
          toc: true,
          index: true,
        },
      };

      const cliOpts = {
        base: "cli/schema",
        schema: "cli/my-schema.graphql",
        root: "cli",
        link: "/cli",
        homepage: "cli/my-homepage.md",
        diff: "CLI",
        tmp: "./cli",
        groupByDirective: "@group(name|=misc)",
        pretty: true,
        noToc: true,
        noPagination: true,
        index: true,
        skip: "@noDoc",
        deprecated: "group",
      };

      jest
        .spyOn(groupInfo, "parseGroupByOption")
        .mockReturnValue(cliOpts.groupByDirective);

      const config = buildConfig(configFileOpts, cliOpts);

      expect(config).toStrictEqual({
        baseURL: cliOpts.base,
        diffMethod: cliOpts.diff,
        groupByDirective: cliOpts.groupByDirective,
        homepageLocation: cliOpts.homepage,
        linkRoot: cliOpts.link,
        loaders: configFileOpts.loaders,
        outputDir: join(cliOpts.root, cliOpts.base),
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
          deprecated: "group",
        },
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: ["noDoc"],
      });
    });

    test("schema option from CLI overrides that of config file", () => {
      expect.hasAssertions();

      jest.spyOn(groupInfo, "parseGroupByOption").mockReturnValue(undefined);

      const configFileOpts = {
        baseURL: "base-from-config-file",
        schema: "schemaFromConfigFile.graphql",
      };
      const cliOpts = { pretty: true, schema: "schemaFromCLI.graphql" };

      const input = buildConfig(configFileOpts, cliOpts);

      expect(input).toStrictEqual({
        baseURL: configFileOpts.baseURL,
        schemaLocation: cliOpts.schema,
        outputDir: join(DEFAULT_OPTIONS.rootPath, configFileOpts.baseURL),
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
      });
    });

    test("force flag from CLI switches diff method to FORCE", () => {
      expect.hasAssertions();

      jest.spyOn(groupInfo, "parseGroupByOption").mockReturnValue(undefined);

      const cliOpts = { force: true };

      const input = buildConfig({}, cliOpts);

      expect(input).toStrictEqual({
        baseURL: DEFAULT_OPTIONS.baseURL,
        schemaLocation: DEFAULT_OPTIONS.schema,
        outputDir: join(DEFAULT_OPTIONS.rootPath, DEFAULT_OPTIONS.baseURL),
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        diffMethod: COMPARE_METHOD.FORCE,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
        loaders: DEFAULT_OPTIONS.loaders,
        groupByDirective: undefined,
        prettify: DEFAULT_OPTIONS.pretty,
        docOptions: DEFAULT_OPTIONS.docOptions,
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
        printer: DEFAULT_OPTIONS.printer,
        skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
      });
    });
  });
});
