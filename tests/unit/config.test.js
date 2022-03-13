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
          baseURL: "schema",
          diffMethod: "SCHEMA-DIFF",
          groupByDirective: undefined,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          linkRoot: "/",
          loaders: {},
          outputDir: "docs/schema",
          prettify: false,
          schemaLocation: "./schema.graphql",
          tmpDir: expect.stringMatching(
            /.+@edno\/docusaurus2-graphql-doc-generator$/,
          ),
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
      };

      const config = buildConfig(configFileOpts);

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: "docs/schema",
          diffMethod: "NO-DIFF",
          groupByDirective: {
            directive: "doc",
            field: "category",
            fallback: "Common",
          },
          homepageLocation: "assets/my-homepage.md",
          linkRoot: "/docs",
          loaders: {
            UrlLoader: "@graphql-tools/url-loader",
          },
          outputDir: "output/docs/schema",
          prettify: true,
          schemaLocation: "assets/my-schema.graphql",
          tmpDir: "./tmp",
        }),
      );
    });

    test("override config set in docusaurus if cli options set", () => {
      jest.spyOn(groupInfo, "parseGroupByOption").mockReturnValue({
        directive: "group",
        field: "name",
        fallback: "misc",
      });

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
      };

      const cliOpts = {
        base: "cli/schema",
        schema: "cli/my-schema.graphql",
        root: "cli",
        link: "/cli",
        homepage: "cli/my-homepage.md",
        force: true,
        tmp: "./cli",
        groupByDirective: "@group(name|=misc)",
        pretty: true,
      };

      const config = buildConfig(configFileOpts, cliOpts);

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: "cli/schema",
          diffMethod: "FORCE",
          groupByDirective: {
            directive: "group",
            field: "name",
            fallback: "misc",
          },
          homepageLocation: "cli/my-homepage.md",
          linkRoot: "/cli",
          loaders: {
            UrlLoader: "@graphql-tools/url-loader",
          },
          outputDir: "cli/cli/schema",
          prettify: true,
          schemaLocation: "cli/my-schema.graphql",
          tmpDir: "./cli",
        }),
      );
    });

    test("schema option from CLI overrides that of config file", () => {
      const configFileOpts = {
        baseURL: "base-from-config-file",
        schema: "schemaFromConfigFile.graphql",
      };
      const cliOpts = { pretty: true, schema: "schemaFromCLI.graphql" };
      const input = buildConfig(configFileOpts, cliOpts);
      const expected = {
        baseURL: configFileOpts.baseURL,
        schemaLocation: cliOpts.schema,
        outputDir: `${DEFAULT_OPTIONS.rootPath.slice(2)}/${
          configFileOpts.baseURL
        }`,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        diffMethod: DEFAULT_OPTIONS.diffMethod,
        tmpDir: DEFAULT_OPTIONS.tmpDir,
        loaders: DEFAULT_OPTIONS.loaders,
        groupByDirective: undefined,
        prettify: cliOpts.pretty,
      };
      expect(input).toStrictEqual(expected);
    });

    test("force flag from CLI switches diff method to FORCE", () => {
      const cliOpts = { force: true };
      const input = buildConfig({}, cliOpts);
      const expected = {
        baseURL: DEFAULT_OPTIONS.baseURL,
        schemaLocation: DEFAULT_OPTIONS.schema,
        outputDir: `${DEFAULT_OPTIONS.rootPath.slice(2)}/${
          DEFAULT_OPTIONS.baseURL
        }`,
        linkRoot: DEFAULT_OPTIONS.linkRoot,
        homepageLocation: DEFAULT_OPTIONS.homepage,
        diffMethod: "FORCE",
        tmpDir: DEFAULT_OPTIONS.tmpDir,
        loaders: DEFAULT_OPTIONS.loaders,
        groupByDirective: undefined,
        prettify: DEFAULT_OPTIONS.pretty,
      };
      expect(input).toStrictEqual(expected);
    });
  });
});
