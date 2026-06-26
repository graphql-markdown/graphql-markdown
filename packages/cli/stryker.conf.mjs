// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

import baseConfig from "@graphql-markdown/tooling-config/stryker";

export default {
  ...baseConfig,
  jest: {
    ...baseConfig.jest,
    config: {
      ...baseConfig.jest?.config,
      // Commander v15 is ESM-only; Stryker builds its own inline Jest config that
      // does not inherit transformIgnorePatterns from jest.config.mjs, so we must
      // repeat the override here. Match 'commander' as a directory segment to
      // handle both direct installs and bun-nested paths (.bun/commander@x/.../commander/).
      transformIgnorePatterns: [
        "/node_modules/(?!(commander/|.*\\/commander/))",
      ],
      transform: {
        ...baseConfig.jest?.config?.transform,
        "/commander/.*\\.js$": [
          "ts-jest",
          {
            tsconfig: {
              allowJs: true,
              module: "commonjs",
              moduleResolution: "bundler",
            },
            diagnostics: false,
          },
        ],
      },
    },
  },
};
