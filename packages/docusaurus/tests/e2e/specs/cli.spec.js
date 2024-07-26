/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
const { promises: fs } = require("node:fs");

const cli = require("../../helpers/cli");

const rootDir = global["__ROOT_DIR__"];

const pluginConfigs = require(
  `${rootDir}/data/docusaurus2-graphql-doc-generator-multi-instance.config.js`,
);

const docsDirs = [];
const messagesGenerated = [];

for (const pluginConfig of pluginConfigs) {
  if (!pluginConfig.schema) {
    // if schema not test then assume .graphqlrc
    continue;
  }
  docsDirs.push(
    path.resolve(rootDir, pluginConfig.rootPath, pluginConfig.baseURL),
  );
  messagesGenerated.push([
    `[SUCCESS] Documentation successfully generated in "${path.join(
      pluginConfig.rootPath,
      pluginConfig.baseURL,
    )}" with base URL "${pluginConfig.baseURL}".`,
    `[INFO] {Any<Number>} pages generated in {Any<Number>}s from schema "${pluginConfig.schema}".`,
  ]);
}

const messageNoUpdate = [
  `No changes detected in schema "${pluginConfigs[0].schema}".`,
];

describe("graphql-to-doc", () => {
  beforeAll(async () => {
    docsDirs.forEach((docsDir) => {
      fs.mkdir(docsDir, { recursive: true });
    });
  });

  test("should return 0 with generated message when completed as first run", async () => {
    const generateOutput = await cli();
    expect(generateOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = generateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    messagesGenerated[0].forEach((message) => expect(stdout).toMatch(message));
  }, 60000);

  test("should return 0 with no update message when schema unchanged", async () => {
    const generateOutput = await cli();
    expect(generateOutput).toHaveProperty("code", 0);

    const updateOutput = await cli();
    expect(updateOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = updateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    messageNoUpdate.forEach((message) => expect(stdout).toMatch(message));
  }, 60000);

  test("should return 0 with generated message when completed with force flag", async () => {
    const generateOutput = await cli();
    expect(generateOutput).toHaveProperty("code", 0);

    const updateOutput = await cli();
    expect(updateOutput).toHaveProperty("code", 0);

    const forceOutput = await cli({ args: ["--force"] });
    expect(forceOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = forceOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    messagesGenerated[0].forEach((message) => expect(stdout).toMatch(message));
  }, 60000);

  test("should return 0 with generated message when completed with force flag (multi-instance)", async () => {
    for (const [index, pluginConfig] of pluginConfigs.entries()) {
      if (!pluginConfig.schema) {
        // if schema not test then assume .graphqlrc
        continue;
      }

      const generateOutput = await cli({
        id: pluginConfig.id,
        args: ["--force"],
      });

      expect(generateOutput).toMatchObject({
        code: 0,
        error: null,
        stderr: "",
        stdout: expect.any(String),
      });

      const stdout = generateOutput.stdout.replace(
        /\d+\.?\d*/g,
        "{Any<Number>}",
      );

      messagesGenerated[index].forEach((message) =>
        expect(stdout).toMatch(message),
      );
    }
  }, 60000);

  test("should return 0 when using .graphqlrc config", async () => {
    const generateOutput = await cli({ id: "schema_tweets" });
    expect(generateOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = generateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    expect(stdout).toMatch(
      `[INFO] {Any<Number>} pages generated in {Any<Number>}s from schema "data/tweet.graphql".`,
    );
  }, 60000);
});

describe("loadContent", () => {
  beforeEach(async () => {
    const docsDir = `${rootDir}/docs`;
    await fs.rm(docsDir, { recursive: true, force: true });
    await fs.mkdir(docsDir, { recursive: true });
    await fs.writeFile(`${docsDir}/groups.md`, "");
  });

  test("should generate plugin files on build when runOnBuild is true", async () => {
    const generateOutput = await cli({
      cmd: "build",
      args: ["--config docusaurus2-graphql-doc-build.js"],
    });
    expect(generateOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = generateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    expect(stdout).toMatch(
      `[INFO] {Any<Number>} pages generated in {Any<Number>}s from schema "data/tweet.graphql".`,
    );
  }, 60000);

  test("should not generate plugin files on build when runOnBuild is false", async () => {
    const generateOutput = await cli({
      cmd: "build",
      args: ["--config docusaurus2-graphql-doc-nobuild.js"],
    });
    expect(generateOutput).toMatchObject({
      code: 0,
      error: null,
      stderr: "",
      stdout: expect.any(String),
    });
    const stdout = generateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    expect(stdout).not.toMatch(
      `[INFO] {Any<Number>} pages generated in {Any<Number>}s from schema "data/tweet.graphql".`,
    );
  }, 60000);
});
