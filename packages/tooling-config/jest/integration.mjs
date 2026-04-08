// @ts-check

import { createMultiProjectConfig } from "./base.mjs";

/**
 * @param {string} rootDir
 * @returns {import('jest').Config}
 */
export const createIntegrationConfig = (rootDir) =>
  createMultiProjectConfig(
    rootDir,
    {
      testTimeout: 30000,
      testMatch: ["<rootDir>/tests/integration/**/(*.)+(spec|test).ts"],
    },
    { collectCoverage: false },
  );
