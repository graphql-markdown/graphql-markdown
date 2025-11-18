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

  test("generates documentation with categorySortPrefix without errors", async () => {
    // Generate documentation using the CLI
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

    console.log("Generate output code:", generateOutput.code);
    console.log("Generate output stdout:", generateOutput.stdout);
    if (generateOutput.stderr) {
      console.log("Generate output stderr:", generateOutput.stderr);
    }

    // Check that generation succeeded
    expect(generateOutput.code).toBe(0);
    expect(generateOutput.stdout).toMatch(
      /Documentation successfully generated/,
    );

    // Verify that categorySortPrefix generated numbered folders
    const docsPath = path.resolve(rootDir, "docs");
    const stat = await fs.stat(docsPath);
    expect(stat.isDirectory()).toBe(true);

    const items = await fs.readdir(docsPath);
    console.log("Contents of docs directory:", items);

    // Check for numbered folders like "01-query", "02-mutation", etc.
    const hasNumberedFolders = items.some((item) => /^\d{2}-/.test(item));

    if (!hasNumberedFolders) {
      // If not at root level, check inside any schema folders
      for (const item of items) {
        const itemPath = path.resolve(docsPath, item);
        try {
          const itemStat = await fs.stat(itemPath);
          if (itemStat.isDirectory()) {
            const subItems = await fs.readdir(itemPath);
            console.log(`Contents of docs/${item}:`, subItems);
            if (subItems.some((sub) => /^\d{2}-/.test(sub))) {
              // Found numbered folders in subdirectory
              return;
            }
          }
        } catch {
          // Skip items that can't be stat'd
        }
      }
    }

    expect(hasNumberedFolders).toBe(true);
  }, 120000);
});
