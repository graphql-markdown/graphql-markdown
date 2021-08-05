/* eslint-disable no-console */

import fs from "fs-extra";
import path from "path";

import { ERROR_CODE, cli } from "./lib/cli";

const DEFAULT_EXEC_TIMEOUT = 60000;

const rootDir = "/usr/src/app/docusaurus2";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require(`${rootDir}/docusaurus2-graphql-doc-generator.config.json`);

const docsDir = path.resolve(
  rootDir,
  pluginConfig.rootPath,
  pluginConfig.baseURL
);

const messageGenerated = [
  `Documentation successfully generated in "${path.join(
    pluginConfig.rootPath,
    pluginConfig.baseURL
  )}" with base URL "${pluginConfig.baseURL}".`,
  `{Any<Number>} pages generated in {Any<Number>}s from schema "${pluginConfig.schema}".`,
  `Remember to update your Docusaurus site's sidebars with "${path.join(
    pluginConfig.rootPath,
    pluginConfig.baseURL,
    "sidebar-schema.js"
  )}".`,
];

const messageNoUpdate = [
  `No changes detected in schema "${pluginConfig.schema}".`,
];

describe("graphql-to-doc", () => {
  beforeAll(async () => {
    try {
      await fs.ensureDir(docsDir);
      await fs.emptyDir(docsDir);
    } catch (error) {
      console.error(error);
    }
  });

  test(
    "should return 0 with generated message when completed as first run",
    async () => {
      const generateOutput = await cli();
      expect(generateOutput).toMatchObject({
        code: ERROR_CODE.SUCCESS,
        error: null,
        stderr: "",
        stdout: expect.any(String),
      });

      const stdout = generateOutput.stdout.replace(
        /[0-9]+\.?[0-9]+/g,
        "{Any<Number>}"
      );

      messageGenerated.forEach((message) => {
        return expect(stdout).toMatch(message);
      });
    },
    DEFAULT_EXEC_TIMEOUT
  );

  test(
    "should return 0 with generated message when schema unchanged",
    async () => {
      const generateOutput = await cli();
      expect(generateOutput).toHaveProperty("code", ERROR_CODE.SUCCESS);

      const updateOutput = await cli();
      expect(updateOutput).toMatchObject({
        code: ERROR_CODE.SUCCESS,
        error: null,
        stderr: "",
        stdout: expect.any(String),
      });
      const stdout = generateOutput.stdout.replace(
        /[0-9]+\.?[0-9]+/g,
        "{Any<Number>}"
      );
      messageNoUpdate.forEach((message) => {
        return expect(stdout).toMatch(message);
      });
    },
    DEFAULT_EXEC_TIMEOUT
  );

  test(
    "should return 0 with updated message when completed with force flag",
    async () => {
      const generateOutput = await cli();
      expect(generateOutput).toHaveProperty("code", ERROR_CODE.SUCCESS);

      const updateOutput = await cli();
      expect(updateOutput).toHaveProperty("code", ERROR_CODE.SUCCESS);

      const forceOutput = await cli(["--force"]);
      expect(forceOutput).toMatchObject({
        code: ERROR_CODE.SUCCESS,
        error: null,
        stderr: "",
        stdout: expect.any(String),
      });
      const stdout = generateOutput.stdout.replace(
        /[0-9]+\.?[0-9]+/g,
        "{Any<Number>}"
      );
      messageNoUpdate.forEach((message) => {
        return expect(stdout).toMatch(message);
      });
    },
    DEFAULT_EXEC_TIMEOUT
  );
});
