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
        .mockImplementation(async (config): Promise<Options> => {
          return Promise.resolve(config);
        }),
      generateDocFromSchema: jest.fn().mockResolvedValue(undefined),
    };
  },
  { virtual: true },
);

jest.mock("@graphql-markdown/logger", () => {
  return jest.fn().mockImplementation(() => {
    return {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
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
    "defaultValue": undefined,
    "description": "Schema location",
    "flags": "-s, --schema <schema>",
    "long": "--schema",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-s",
  },
  Option {
    "defaultValue": undefined,
    "description": "Root folder for doc generation",
    "flags": "-r, --root <rootPath>",
    "long": "--root",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-r",
  },
  Option {
    "defaultValue": undefined,
    "description": "Base URL to be used by static generator",
    "flags": "-b, --base <baseURL>",
    "long": "--base",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-b",
  },
  Option {
    "defaultValue": undefined,
    "description": "Root for links in documentation",
    "flags": "-l, --link <linkRoot>",
    "long": "--link",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-l",
  },
  Option {
    "defaultValue": undefined,
    "description": "File location for doc landing page",
    "flags": "-h, --homepage <homepage>",
    "long": "--homepage",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-h",
  },
  Option {
    "defaultValue": undefined,
    "description": "Schema entity hierarchy: \`api\`, \`entity\`, \`flat\`",
    "flags": "--hierarchy <hierarchy>",
    "long": "--hierarchy",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable code section for types",
    "flags": "--noCode",
    "long": "--noCode",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable example section for types",
    "flags": "--noExample",
    "long": "--noExample",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable parent type name as field prefix",
    "flags": "--noParentType",
    "long": "--noParentType",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable related types sections",
    "flags": "--noRelatedType",
    "long": "--noRelatedType",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable badges for types",
    "flags": "--noTypeBadges",
    "long": "--noTypeBadges",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Enable generated index for categories",
    "flags": "--index",
    "long": "--index",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Force document generation",
    "flags": "-f, --force",
    "long": "--force",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
    "short": "-f",
  },
  Option {
    "defaultValue": undefined,
    "description": "Set diff method",
    "flags": "-d, --diff <diffMethod>",
    "long": "--diff",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-d",
  },
  Option {
    "defaultValue": undefined,
    "description": "Set temp dir for schema diff",
    "flags": "-t, --tmp <tmpDir>",
    "long": "--tmp",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-t",
  },
  Option {
    "defaultValue": undefined,
    "description": "Group documentation by directive",
    "flags": "--groupByDirective <@directive(field|=fallback)>",
    "long": "--groupByDirective",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Only print types with matching directive",
    "flags": "--only <@directive...>",
    "long": "--only",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Skip types with matching directive",
    "flags": "--skip <@directive...>",
    "long": "--skip",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Option for printing deprecated entities: \`default\`, \`group\` or \`skip\`",
    "flags": "--deprecated <option>",
    "long": "--deprecated",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Prettify generated files",
    "flags": "--pretty",
    "long": "--pretty",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Print configuration (for debugging)",
    "flags": "--config",
    "long": "--config",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": "@graphql-markdown/docusaurus/mdx",
    "description": "Set MDX package processor",
    "flags": "--mdxParser <mdxParser>",
    "long": "--mdxParser",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
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
    "defaultValue": undefined,
    "description": "Schema location",
    "flags": "-s, --schema <schema>",
    "long": "--schema",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-s",
  },
  Option {
    "defaultValue": undefined,
    "description": "Root folder for doc generation",
    "flags": "-r, --root <rootPath>",
    "long": "--root",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-r",
  },
  Option {
    "defaultValue": undefined,
    "description": "Base URL to be used by static generator",
    "flags": "-b, --base <baseURL>",
    "long": "--base",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-b",
  },
  Option {
    "defaultValue": undefined,
    "description": "Root for links in documentation",
    "flags": "-l, --link <linkRoot>",
    "long": "--link",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-l",
  },
  Option {
    "defaultValue": undefined,
    "description": "File location for doc landing page",
    "flags": "-h, --homepage <homepage>",
    "long": "--homepage",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-h",
  },
  Option {
    "defaultValue": undefined,
    "description": "Schema entity hierarchy: \`api\`, \`entity\`, \`flat\`",
    "flags": "--hierarchy <hierarchy>",
    "long": "--hierarchy",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable code section for types",
    "flags": "--noCode",
    "long": "--noCode",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable example section for types",
    "flags": "--noExample",
    "long": "--noExample",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable parent type name as field prefix",
    "flags": "--noParentType",
    "long": "--noParentType",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable related types sections",
    "flags": "--noRelatedType",
    "long": "--noRelatedType",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Disable badges for types",
    "flags": "--noTypeBadges",
    "long": "--noTypeBadges",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Enable generated index for categories",
    "flags": "--index",
    "long": "--index",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Force document generation",
    "flags": "-f, --force",
    "long": "--force",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
    "short": "-f",
  },
  Option {
    "defaultValue": undefined,
    "description": "Set diff method",
    "flags": "-d, --diff <diffMethod>",
    "long": "--diff",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-d",
  },
  Option {
    "defaultValue": undefined,
    "description": "Set temp dir for schema diff",
    "flags": "-t, --tmp <tmpDir>",
    "long": "--tmp",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
    "short": "-t",
  },
  Option {
    "defaultValue": undefined,
    "description": "Group documentation by directive",
    "flags": "--groupByDirective <@directive(field|=fallback)>",
    "long": "--groupByDirective",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Only print types with matching directive",
    "flags": "--only <@directive...>",
    "long": "--only",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Skip types with matching directive",
    "flags": "--skip <@directive...>",
    "long": "--skip",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Option for printing deprecated entities: \`default\`, \`group\` or \`skip\`",
    "flags": "--deprecated <option>",
    "long": "--deprecated",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": true,
  },
  Option {
    "defaultValue": undefined,
    "description": "Prettify generated files",
    "flags": "--pretty",
    "long": "--pretty",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
  Option {
    "defaultValue": undefined,
    "description": "Print configuration (for debugging)",
    "flags": "--config",
    "long": "--config",
    "mandatory": false,
    "negate": false,
    "optional": false,
    "required": false,
  },
]
`);
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
        .spyOn(global.console, "dir")
        .mockImplementation(() => {});

      await runGraphQLMarkdown(options, cliOptions);

      expect(spy).toHaveBeenCalledWith(options, { depth: null });
      expect(
        require("@graphql-markdown/core").generateDocFromSchema,
      ).not.toHaveBeenCalled();
    });
  });
});
