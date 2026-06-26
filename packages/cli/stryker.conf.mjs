// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

import baseConfig from "@graphql-markdown/tooling-config/stryker";
import jestConfig from "./jest.config.mjs";

export default {
  ...baseConfig,
  jest: {
    ...baseConfig.jest,
    config: {
      ...baseConfig.jest?.config,
      // Import transform rules from jest.config.mjs (single source of truth) so
      // Stryker's inline Jest config also handles commander v15's ESM syntax.
      transformIgnorePatterns: jestConfig.transformIgnorePatterns,
      transform: {
        ...baseConfig.jest?.config?.transform,
        ...jestConfig.transform,
      },
    },
  },
};

