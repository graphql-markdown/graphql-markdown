// @ts-check

import { mergeConfig } from "vitest/config";

import { createPackageConfig } from "@graphql-markdown/tooling-config/vitest/base";

const config = createPackageConfig("graphql", import.meta.url);

export default mergeConfig(config, {
  resolve: {
    mainFields: ["main"],
  },
  ssr: {
    resolve: {
      mainFields: ["main"],
    },
  },
});
