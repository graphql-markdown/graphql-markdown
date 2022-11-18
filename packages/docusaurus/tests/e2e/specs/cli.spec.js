const path = require("node:path");
const fs = require("node:fs/promises");

const cli = require("../../helpers/cli");

const rootDir = "/docusaurus2";

const pluginConfigs = require(`${rootDir}/data/docusaurus2-graphql-doc-generator-multi-instance.config.js`);

const docsDirs = [];
const messagesGenerated = [];

for (const pluginConfig of pluginConfigs) {
  docsDirs.push(
    path.resolve(rootDir, pluginConfig.rootPath, pluginConfig.baseURL),
  );
  messagesGenerated.push([
    `Documentation successfully generated in "${path.join(
      pluginConfig.rootPath,
      pluginConfig.baseURL,
    )}" with base URL "${pluginConfig.baseURL}".`,
    `{Any<Number>} pages generated in {Any<Number>}s from schema "${pluginConfig.schema}".`,
    `Remember to update your Docusaurus site's sidebars with "${path.join(
      pluginConfig.rootPath,
      pluginConfig.baseURL,
      "sidebar-schema.js",
    )}".`,
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
      const generateOutput = await cli({
        commandID: pluginConfig.id,
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
});
