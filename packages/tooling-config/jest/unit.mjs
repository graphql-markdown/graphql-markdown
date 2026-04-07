// @ts-check

import { createMultiProjectConfig } from "./base.mjs";

/**
 * @param {string} rootDir
 * @returns {import('jest').Config}
 */
export const createUnitConfig = (rootDir) =>
  createMultiProjectConfig(
    rootDir,
    { testTimeout: 5000, testMatch: ["<rootDir>/tests/unit/**/(*.)+(spec|test).ts"] },
    { collectCoverage: false },
  );
