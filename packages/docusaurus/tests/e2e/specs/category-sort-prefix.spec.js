/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
const { promises: fs } = require("node:fs");
const os = require("node:os");

const rootDir = global["__ROOT_DIR__"] || "/tmp";

describe("categorySortPrefix E2E feature (Earthly only)", () => {
  // This test suite only runs in Earthly where /docusaurus-gqlmd exists
  if (rootDir === "/tmp") {
    test.skip("E2E tests require Earthly environment", () => {});
    return;
  }

  const testBaseDir = path.resolve(rootDir, "docs-test-e2e");
  const testDocsDir = path.resolve(testBaseDir, "docs-category-sort-prefix");

  beforeAll(async () => {
    try {
      await fs.mkdir(testDocsDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create test directory: ${error.message}`);
    }
  });

  afterAll(async () => {
    try {
      await fs.rm(testBaseDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  test("generates documentation with categorySortPrefix without errors", async () => {
    // Note: This test verifies that the categorySortPrefix option
    // can be used in Docusaurus configuration without causing errors.
    // The build process generates docs in the 'docs' folder.

    const docsPath = path.resolve(rootDir, "docs");
    const stat = await fs.stat(docsPath);
    expect(stat.isDirectory()).toBe(true);

    // Verify that categorySortPrefix generated numbered folders
    const items = await fs.readdir(docsPath);
    console.log("Contents of docs directory:", items);

    // Check for numbered folders like "01-query", "02-mutation", etc.
    // or check for the schema folder with numbered content inside
    const hasNumberedFolders = items.some((item) => /^\d{2}-/.test(item));

    if (!hasNumberedFolders) {
      // If not at root level, check inside any schema folders
      for (const item of items) {
        const itemPath = path.resolve(docsPath, item);
        const itemStat = await fs.stat(itemPath);
        if (itemStat.isDirectory()) {
          const subItems = await fs.readdir(itemPath);
          console.log(`Contents of docs/${item}:`, subItems);
          if (subItems.some((sub) => /^\d{2}-/.test(sub))) {
            expect(true).toBe(true);
            return;
          }
        }
      }
    }

    expect(hasNumberedFolders).toBe(true);
  }, 120000);
});
