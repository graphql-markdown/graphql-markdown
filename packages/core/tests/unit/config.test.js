const { join } = require("path");

const { COMPARE_METHOD } = require("@graphql-markdown/diff");
const { buildConfig, DEFAULT_OPTIONS } = require("../../src/config");

jest.mock("../../src/lib/group-info");
const groupInfo = require("../../src/lib/group-info");

describe("config", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("buildConfig()", () => {
    test("returns default options is no config set", () => {
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
        }),
      );
    });

    test("override default options is config set in docusaurus", () => {
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
        },
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
      });
    });

    test("override config set in docusaurus if cli options set", () => {
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
        printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
      });
    });

    test("schema option from CLI overrides that of config file", () => {
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
      });
    });

    test("force flag from CLI switches diff method to FORCE", () => {
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
      });
    });
  });
});
