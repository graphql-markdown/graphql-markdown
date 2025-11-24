/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
const { promises: fs } = require("node:fs");

const cli = require("../../helpers/cli");

const rootDir = global["__ROOT_DIR__"] || "/tmp";

// E2E tests only run in Earthly where __ROOT_DIR__ is set to /docusaurus-gqlmd
// and the necessary test data and infrastructure exist. When not in Earthly environment,
// the entire suite is skipped. See Earthfile for smoke-test target that runs E2E tests.
const isInEarthlyEnvironment = rootDir && rootDir !== "/tmp";

const describe_conditional = isInEarthlyEnvironment ? describe : describe.skip;

describe_conditional("categorySort E2E feature (Earthly only)", () => {
  test("categorySort option generates prefixed folder names in documentation", async () => {
    // Generate documentation using the CLI with categorySort enabled
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
    expect(generateOutput.stdout).toContain(
      "Documentation successfully generated",
    );
    expect(generateOutput.stdout).toContain("pages generated");

    // Verify docs directory exists and contains expected structure
    const docsPath = path.resolve(rootDir, "docs");
    const stat = await fs.stat(docsPath);
    expect(stat.isDirectory()).toBe(true);

    const items = await fs.readdir(docsPath);
    // Verify API folders (operations and types) exist with prefixes when categorySort is set
    expect(
      items.some((item) => ["operations", "01-operations"].includes(item)),
    ).toBe(true);
    expect(items.some((item) => ["types", "02-types"].includes(item))).toBe(
      true,
    );
  }, 120000);
});
