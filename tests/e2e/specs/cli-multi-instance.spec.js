const path = require("path");
const { promises: fs } = require("fs");

const cli = require("../../helpers/cli");

const rootDir = "/docusaurus2";

const pluginConfigs = require(`${rootDir}/docusaurus2-graphql-doc-generator-multi-instance.config.js`);

const docsDirs = [];

pluginConfigs.map((pluginConfig) => {
  docsDirs.push(
    path.resolve(rootDir, pluginConfig.rootPath, pluginConfig.baseURL),
  );
});

const messagesGenerated = [];

pluginConfigs.map((pluginConfig) => {
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
});

describe("graphql-to-doc", () => {
  beforeAll(async () => {
    docsDirs.map((docsDir) => {
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

    messagesGenerated.map((messageGenerated) => {
      messageGenerated.forEach((message) => expect(stdout).toMatch(message));
    });
  }, 60000);
});
