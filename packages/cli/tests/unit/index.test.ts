/* eslint-disable @typescript-eslint/no-require-imports */
// packages/cli/test/index.test.ts
import type { Options } from "@graphql-markdown/types";
import { getGraphQLMarkdownCli, runGraphQLMarkdown } from "../../src/index";

// Mock dependencies
jest.mock(
  "@graphql-markdown/core",
  () => {
    return {
      buildConfig: jest
        .fn()
        .mockImplementation(async (config: Options): Promise<Options> => {
          return config;
        }),
      generateDocFromSchema: jest.fn().mockResolvedValue(undefined),
    };
  },
  { virtual: true },
);

jest.mock("@graphql-markdown/logger", () => {
  return jest.fn().mockResolvedValue({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  });
});

jest.mock("graphql-config", () => {
  return {
    loadConfig: jest.fn().mockResolvedValue({
      getDefault: jest.fn().mockReturnValue({
        schema: "./schema.graphql",
        documents: "./src/**/*.graphql",
        extensions: {
          "graphql-markdown": {
            rootPath: "./docs",
            baseURL: "api",
          },
        },
      }),
    }),
  };
});

describe("CLI Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGraphQLMarkdownCli", () => {
    test("returns a configured commander command", () => {
      expect.assertions(3);

      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const loggerModule = "@docusaurus/logger";
      const mdxPackage = "@graphql-markdown/docusaurus/mdx";

      const command = getGraphQLMarkdownCli(options, loggerModule, mdxPackage);

      expect(command).toBeDefined();
      expect(command.description()).toBe(
        "Generate GraphQL Schema Documentation",
      );
      expect(command.options).toMatchInlineSnapshot(`
        [
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Schema location",
            "envVar": undefined,
            "flags": "-s, --schema <schema>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--schema",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-s",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Root folder for doc generation",
            "envVar": undefined,
            "flags": "-r, --root <rootPath>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--root",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-r",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Base URL to be used by static generator",
            "envVar": undefined,
            "flags": "-b, --base <baseURL>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--base",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-b",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Root for links in documentation",
            "envVar": undefined,
            "flags": "-l, --link <linkRoot>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--link",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-l",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "File location for doc landing page",
            "envVar": undefined,
            "flags": "-h, --homepage <homepage>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--homepage",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-h",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Schema entity hierarchy: \`api\`, \`entity\`, \`flat\`",
            "envVar": undefined,
            "flags": "--hierarchy <hierarchy>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--hierarchy",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Disable parent type name as field prefix",
            "envVar": undefined,
            "flags": "--noParentType",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--noParentType",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Disable badges for types",
            "envVar": undefined,
            "flags": "--noTypeBadges",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--noTypeBadges",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Disable custom section header IDs for permalinks",
            "envVar": undefined,
            "flags": "--noSectionId",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--noSectionId",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Enable generated index for categories",
            "envVar": undefined,
            "flags": "--index",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--index",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Force document generation",
            "envVar": undefined,
            "flags": "-f, --force",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--force",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": "-f",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Set diff method",
            "envVar": undefined,
            "flags": "-d, --diff <diffMethod>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--diff",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-d",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Set temp dir for schema diff",
            "envVar": undefined,
            "flags": "-t, --tmp <tmpDir>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--tmp",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": "-t",
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Group documentation by directive",
            "envVar": undefined,
            "flags": "--groupByDirective <@directive(field|=fallback)>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--groupByDirective",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Only print types with matching directive",
            "envVar": undefined,
            "flags": "--only <@directive...>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--only",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": true,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Skip types with matching directive",
            "envVar": undefined,
            "flags": "--skip <@directive...>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--skip",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": true,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Option for printing deprecated entities: \`default\`, \`group\` or \`skip\`",
            "envVar": undefined,
            "flags": "--deprecated <option>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--deprecated",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Prettify generated files",
            "envVar": undefined,
            "flags": "--pretty",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--pretty",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "Print configuration (for debugging)",
            "envVar": undefined,
            "flags": "--config",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--config",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": false,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": "@graphql-markdown/docusaurus/mdx",
            "defaultValueDescription": undefined,
            "description": "Set formatter package",
            "envVar": undefined,
            "flags": "--formatter <formatter>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--formatter",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": false,
          },
          Option {
            "argChoices": undefined,
            "conflictsWith": [],
            "defaultValue": undefined,
            "defaultValueDescription": undefined,
            "description": "[deprecated] Use --formatter instead",
            "envVar": undefined,
            "flags": "--mdxParser <mdxParser>",
            "helpGroupHeading": undefined,
            "hidden": false,
            "implied": undefined,
            "long": "--mdxParser",
            "mandatory": false,
            "negate": false,
            "optional": false,
            "parseArg": undefined,
            "presetArg": undefined,
            "required": true,
            "short": undefined,
            "variadic": false,
          },
        ]
      `);
    });
  });

  test("returns a configured commander command with ID", () => {
    expect.assertions(2);

    const options = {
      id: "test",
      schema: "./schema.graphql",
      rootPath: "./docs",
    };
    const loggerModule = "@docusaurus/logger";
    const mdxPackage = "@graphql-markdown/docusaurus/mdx";

    const command = getGraphQLMarkdownCli(options, loggerModule, mdxPackage);

    expect(command).toBeDefined();
    expect(command.description()).toBe(
      "Generate GraphQL Schema Documentation for configuration with id test",
    );
  });

  test("returns a configured commander command without customMdxParser", () => {
    expect.assertions(2);

    const options = {
      schema: "./schema.graphql",
      rootPath: "./docs",
    };

    const command = getGraphQLMarkdownCli(options);

    expect(command).toBeDefined();
    expect(command.options).toMatchInlineSnapshot(`
      [
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Schema location",
          "envVar": undefined,
          "flags": "-s, --schema <schema>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--schema",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-s",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Root folder for doc generation",
          "envVar": undefined,
          "flags": "-r, --root <rootPath>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--root",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-r",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Base URL to be used by static generator",
          "envVar": undefined,
          "flags": "-b, --base <baseURL>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--base",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-b",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Root for links in documentation",
          "envVar": undefined,
          "flags": "-l, --link <linkRoot>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--link",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-l",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "File location for doc landing page",
          "envVar": undefined,
          "flags": "-h, --homepage <homepage>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--homepage",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-h",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Schema entity hierarchy: \`api\`, \`entity\`, \`flat\`",
          "envVar": undefined,
          "flags": "--hierarchy <hierarchy>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--hierarchy",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Disable parent type name as field prefix",
          "envVar": undefined,
          "flags": "--noParentType",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--noParentType",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Disable badges for types",
          "envVar": undefined,
          "flags": "--noTypeBadges",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--noTypeBadges",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Disable custom section header IDs for permalinks",
          "envVar": undefined,
          "flags": "--noSectionId",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--noSectionId",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Enable generated index for categories",
          "envVar": undefined,
          "flags": "--index",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--index",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Force document generation",
          "envVar": undefined,
          "flags": "-f, --force",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--force",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": "-f",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Set diff method",
          "envVar": undefined,
          "flags": "-d, --diff <diffMethod>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--diff",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-d",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Set temp dir for schema diff",
          "envVar": undefined,
          "flags": "-t, --tmp <tmpDir>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--tmp",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": "-t",
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Group documentation by directive",
          "envVar": undefined,
          "flags": "--groupByDirective <@directive(field|=fallback)>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--groupByDirective",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Only print types with matching directive",
          "envVar": undefined,
          "flags": "--only <@directive...>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--only",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": undefined,
          "variadic": true,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Skip types with matching directive",
          "envVar": undefined,
          "flags": "--skip <@directive...>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--skip",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": undefined,
          "variadic": true,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Option for printing deprecated entities: \`default\`, \`group\` or \`skip\`",
          "envVar": undefined,
          "flags": "--deprecated <option>",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--deprecated",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": true,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Prettify generated files",
          "envVar": undefined,
          "flags": "--pretty",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--pretty",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
        Option {
          "argChoices": undefined,
          "conflictsWith": [],
          "defaultValue": undefined,
          "defaultValueDescription": undefined,
          "description": "Print configuration (for debugging)",
          "envVar": undefined,
          "flags": "--config",
          "helpGroupHeading": undefined,
          "hidden": false,
          "implied": undefined,
          "long": "--config",
          "mandatory": false,
          "negate": false,
          "optional": false,
          "parseArg": undefined,
          "presetArg": undefined,
          "required": false,
          "short": undefined,
          "variadic": false,
        },
      ]
    `);
  });

  test("executes the configured command action", async () => {
    expect.assertions(1);

    const options = {
      schema: "./schema.graphql",
      rootPath: "./docs",
    };
    const command = getGraphQLMarkdownCli(options);

    await command.parseAsync(["node", "graphql-to-doc", "--config"]);

    expect(require("@graphql-markdown/core").buildConfig).toHaveBeenCalledWith(
      options,
      expect.objectContaining({ config: true }),
      undefined,
    );
  });

  describe("runGraphQLMarkdown", () => {
    test("runs documentation generation with provided options", async () => {
      expect.assertions(1);

      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const cliOptions = {};
      const loggerModule = "@docusaurus/logger";

      await runGraphQLMarkdown(options, cliOptions, loggerModule);

      expect(
        require("@graphql-markdown/core").generateDocFromSchema,
      ).toHaveBeenCalled();
    });

    test("initializes logger before buildConfig", async () => {
      expect.assertions(2);

      const callOrder: string[] = [];
      require("@graphql-markdown/logger").mockImplementationOnce(async () => {
        callOrder.push("Logger");
      });
      require("@graphql-markdown/core").buildConfig.mockImplementationOnce(
        async (config: Options) => {
          callOrder.push("buildConfig");
          return config;
        },
      );

      await runGraphQLMarkdown({ schema: "./schema.graphql" }, {});

      expect(callOrder[0]).toBe("Logger");
      expect(callOrder[1]).toBe("buildConfig");
    });

    test("handles errors during documentation generation", async () => {
      expect.assertions(1);

      const error = new Error("Generation failed");
      require("@graphql-markdown/core").generateDocFromSchema.mockRejectedValueOnce(
        error,
      );

      const options = {
        schema: "./schema.graphql",
      };

      await expect(runGraphQLMarkdown(options, {})).rejects.toThrow(
        "Generation failed",
      );
    });

    test("prints JSON configuration if --config flag is set", async () => {
      expect.assertions(2);

      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const cliOptions = { config: true };

      const spy = jest
        .spyOn(globalThis.console, "dir")
        .mockImplementation(() => {});

      await runGraphQLMarkdown(options, cliOptions);

      expect(spy).toHaveBeenCalledWith(options, { depth: null });
      expect(
        require("@graphql-markdown/core").generateDocFromSchema,
      ).not.toHaveBeenCalled();
    });

    test("forwards noSectionId CLI option to buildConfig", async () => {
      expect.assertions(1);

      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const cliOptions = {
        noSectionId: true,
      };

      await runGraphQLMarkdown(options, cliOptions);

      expect(
        require("@graphql-markdown/core").buildConfig,
      ).toHaveBeenCalledWith(options, cliOptions, undefined);
    });
  });
});
