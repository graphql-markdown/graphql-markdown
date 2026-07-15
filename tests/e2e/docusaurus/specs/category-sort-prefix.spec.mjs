// @ts-check

import path from "node:path";
import { promises as fs } from "node:fs";

import cli from "../../helpers/cli.mjs";

const rootDir = global["__ROOT_DIR__"] || "/tmp";

// E2E tests only run under the e2e jest config (tests/e2e/docusaurus/jest.config.mjs),
// which sets __ROOT_DIR__ to the scaffolded Docusaurus project's absolute path and
// provides the necessary test data and infrastructure. When run under any other jest
// config, the entire suite is skipped. See .github/workflows/smoke.yml for the CI job
// that scaffolds the project and runs these specs.
const isInE2eEnvironment = rootDir && rootDir !== "/tmp";

// Skip E2E tests when not in the e2e environment due to missing test infrastructure
const describe_conditional = isInE2eEnvironment ? describe : describe.skip;

describe_conditional("categorySort E2E feature", () => {
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

    expect(generateOutput).toMatchObject({
      code: 0,
      error: null,
      stdout: expect.any(String),
      stderr: "",
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
