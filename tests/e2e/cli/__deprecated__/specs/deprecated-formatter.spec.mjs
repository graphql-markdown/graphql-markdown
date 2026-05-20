import cli from "../../../helpers/cli.mjs";

describe("deprecated mdxParser config option", () => {
  test(
    "should succeed and emit deprecation warning when mdxParser is used",
    async () => {
      const output = await cli();

      expect(output.code).toBe(0);
      expect(output.stderr).toMatch(
        `"mdxParser" is deprecated and will be removed in a future version. Use "formatter" instead.`,
      );
    },
    60000,
  );
});
