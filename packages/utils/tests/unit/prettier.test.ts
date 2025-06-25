/* eslint-disable @typescript-eslint/explicit-function-return-type */
// packages/utils/tests/unit/prettier.test.ts
import * as Prettier from "../../src/prettier";

describe("prettier", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("prettify()", () => {
    test("formats content using the specified parser", async () => {
      expect.assertions(1);

      jest.mock(
        "prettier",
        () => {
          return {
            resolveConfigFile: async () => {
              return null;
            },
            resolveConfig: async () => {
              return {};
            },
            format: async (content: string) => {
              return `prettified:${content}`;
            },
          };
        },
        { virtual: true },
      );

      const result = await Prettier.prettify("test content", "mdx");
      expect(result).toBe("prettified:test content");
    });

    test("logs error and returns undefined when prettier is not available", async () => {
      expect.assertions(2);

      jest.mock(
        "prettier",
        () => {
          throw new Error(
            'Prettier is not found or not configured. Please install it or disable the "pretty" option.',
          );
        },
        { virtual: true },
      );

      const consoleSpy = jest
        .spyOn(global.console, "log")
        .mockImplementation(() => {});

      const result = await Prettier.prettify("test content", "mdx");

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Prettier is not found or not configured. Please install it or disable the "pretty" option.',
      );
    });
  });

  describe("prettifyMarkdown()", () => {
    test("calls prettify with markdown parser", async () => {
      expect.assertions(1);

      const prettifySpy = jest.spyOn(Prettier, "prettify");

      await Prettier.prettifyMarkdown("# Markdown content");

      expect(prettifySpy).toHaveBeenCalledWith("# Markdown content", "mdx");
    });
  });
});
