// @ts-check

import { createMultiProjectConfig } from "./base.mjs";

/**
 * @param {string} rootDir
 * @returns {import('jest').Config}
 */
export const createRootConfig = (rootDir) =>
  createMultiProjectConfig(
    rootDir,
    {
      testMatch: ["<rootDir>/tests/(unit|integration)/**/(*.)+(spec|test).ts"],
    },
    { collectCoverage: true, coverageReporters: ["json", "lcov"] },
  );
