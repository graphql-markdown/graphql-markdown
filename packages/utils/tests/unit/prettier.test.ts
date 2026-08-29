// packages/utils/tests/unit/prettier.test.ts

describe("prettier", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("prettier");
  });

  describe("prettify()", () => {
    test("formats content using the specified parser", async () => {
      expect.assertions(1);

      // `vi.doMock` is not hoisted, so it can be scoped to this test; combined
      // with `vi.resetModules()` the module under test is imported fresh below
      // and its dynamic `import("prettier")` resolves to the manual mock.
      vi.doMock("prettier", async () => {
        return import("../__mocks__/prettier");
      });

      const { prettify } = await import("../../src/prettier");

      const result = await prettify("test content", "mdx");
      expect(result).toBe("prettified:test content");
    });

    test("logs error and returns undefined when prettier is not available", async () => {
      expect.assertions(2);

      vi.doMock("prettier", () => {
        throw new Error(
          'Prettier is not found or not configured. Please install it or disable the "pretty" option.',
        );
      });

      const consoleSpy = vi
        .spyOn(globalThis.console, "log")
        .mockImplementation(() => {});

      const { prettify } = await import("../../src/prettier");

      const result = await prettify("test content", "mdx");

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Prettier is not found or not configured. Please install it or disable the "pretty" option.',
      );
    });
  });

  describe("prettifyMarkdown()", () => {
    // `prettifyMarkdown` calls `prettify` through the module-local binding, so
    // spying on the module namespace export cannot intercept it under Vitest's
    // ESM transform (it only worked with Jest because ts-jest's CommonJS emit
    // rewrote the internal call to `exports.prettify`). The delegation is
    // asserted through its observable effect instead: `prettier.format` is
    // called with the `mdx` parser and its output is returned.
    test("calls prettify with markdown parser", async () => {
      expect.assertions(2);

      vi.doMock("prettier", async () => {
        return import("../__mocks__/prettier");
      });

      const { format } = await import("../__mocks__/prettier");
      const { prettifyMarkdown } = await import("../../src/prettier");

      const result = await prettifyMarkdown("# Markdown content");

      expect(format).toHaveBeenCalledWith("# Markdown content", {
        parser: "mdx",
      });
      expect(result).toBe("prettified:# Markdown content");
    });
  });
});
