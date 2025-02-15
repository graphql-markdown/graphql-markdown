/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
const { promises: fs } = require("node:fs");

const cli = require("../../helpers/cli");

const rootDir = global["__ROOT_DIR__"];

const { projects: pluginConfigs } = require(`${rootDir}/graphql.config.js`);

const docsDirs = {};
const messagesGenerated = {};

for (const [
  project,
  {
    schema,
    extensions: { ["graphql-markdown"]: config },
  },
] of Object.entries(pluginConfigs)) {
  const projectPath = path.join(config.rootPath, config.baseURL);
  docsDirs[project] = path.resolve(rootDir, projectPath);
  messagesGenerated[project] = [
    `Documentation successfully generated in "${projectPath}" with base URL "${config.baseURL}".`,
    `{Any<Number>} pages generated in {Any<Number>}s from schema "${schema}".`,
  ];
}

const messageNoUpdate = [
  `No changes detected in schema "${pluginConfigs["default"].schema}".`,
];

describe("graphql-to-doc", () => {
  beforeAll(async () => {
    for (const docsDir of Object.values(docsDirs)) {
      fs.mkdir(docsDir, { recursive: true });
    }
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
    messagesGenerated["default"].forEach((message) =>
      expect(stdout).toMatch(message),
    );
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
    messagesGenerated["default"].forEach((message) =>
      expect(stdout).toMatch(message),
    );
  }, 60000);

  test("should return 0 with generated message when completed with force flag (multi-instance)", async () => {
    for (const project of Object.keys(pluginConfigs)) {
      const generateOutput = await cli({
        id: project,
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

      messagesGenerated[project].forEach((message) =>
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
      `{Any<Number>} pages generated in {Any<Number>}s from schema "data/tweet.graphql".`,
    );
  }, 60000);
});
