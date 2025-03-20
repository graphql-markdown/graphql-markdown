// packages/utils/tests/unit/prettier.test.ts
import { prettify, prettifyMarkdown } from "../../src/prettier";

describe("prettier", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("prettify()", () => {
    test("formats content using the specified parser", async () => {
      expect.assertions(1);

      const result = await prettify("test content", "markdown");
      expect(result).toBe("prettified:test content");
    });

    test.skip("logs error and returns undefined when prettier is not available", async () => {
      expect.assertions(2);

      jest.mock(
        "prettier",
        () => {
          throw new Error("Prettier is not found");
        },
        { virtual: true },
      );

      const consoleSpy = jest.spyOn(global.console, "log").mockImplementation();

      const result = await prettify("test content", "markdown");

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith("Prettier is not found");

      jest.unmock("prettier");
    });
  });

  describe("prettifyMarkdown()", () => {
    test("calls prettify with markdown parser", async () => {
      expect.assertions(1);

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const prettifySpy = jest.spyOn(require("../../src/prettier"), "prettify");

      await prettifyMarkdown("# Markdown content");

      expect(prettifySpy).toHaveBeenCalledWith(
        "# Markdown content",
        "markdown",
      );
    });
  });
});
