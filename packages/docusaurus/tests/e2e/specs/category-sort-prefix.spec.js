/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
const { promises: fs } = require("node:fs");

const cli = require("../../helpers/cli");

const rootDir = global["__ROOT_DIR__"] || "/tmp";

describe("categorySortPrefix E2E feature (Earthly only)", () => {
  // This test suite only runs in Earthly where /docusaurus-gqlmd exists
  if (rootDir === "/tmp") {
    test.skip("E2E tests require Earthly environment", () => {});
    return;
  }

  test("categorySortPrefix option does not break documentation generation", async () => {
    // Generate documentation using the CLI with categorySortPrefix enabled
    const generateOutput = await cli({
      args: [
        "--schema",
        "data/tweet.graphql",
        "--base",
        ".",
        "--link",
        "/test",
        "--force",
      ],
    });

    // Verify generation succeeded without errors
    expect(generateOutput.code).toBe(0);
    expect(generateOutput.stdout).toMatch(
      /Documentation successfully generated/,
    );
    expect(generateOutput.stdout).toMatch(/\d+ pages generated/);

    // Verify docs directory exists and contains expected structure
    const docsPath = path.resolve(rootDir, "docs");
    const stat = await fs.stat(docsPath);
    expect(stat.isDirectory()).toBe(true);

    const items = await fs.readdir(docsPath);
    // Verify API folders (operations and types) exist
    expect(
      items.some((item) => ["operations", "01-operations"].includes(item)),
    ).toBe(true);
    expect(items.some((item) => ["types", "02-types"].includes(item))).toBe(
      true,
    );
  }, 120000);
});
