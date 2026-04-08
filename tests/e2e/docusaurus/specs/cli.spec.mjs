// @ts-check

import path from "node:path";
import { promises as fs } from "node:fs";

import cli from "../../helpers/cli.mjs";

const rootDir = global["__ROOT_DIR__"];

const pluginConfigs = (await import(
  `${rootDir}/data/graphql-doc-generator-multi-instance.config.mjs`
)).default;

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
      stdout: expect.any(String),
      stderr: "",
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
      stdout: expect.any(String),
      stderr: "",
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
      stdout: expect.any(String),
      stderr: "",
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
        stdout: expect.any(String),
        stderr: "",
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
      stdout: expect.any(String),
      stderr: "",
    });

    const stdout = generateOutput.stdout.replace(/\d+\.?\d*/g, "{Any<Number>}");
    expect(stdout).toMatch(
      `[INFO] {Any<Number>} pages generated in {Any<Number>}s from schema "data/tweet.graphql".`,
    );
  }, 60000);
});

// TODO: Remove tests for runOnBuild lifecycle once fully deprecated and replaced.
describe.skip("loadContent", () => {
  test.todo("should generate plugin files on build when runOnBuild is true");
  test.todo("should not generate plugin files on build when runOnBuild is false");
});
