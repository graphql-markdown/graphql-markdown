// @ts-check

import { createPackageConfig } from "@graphql-markdown/tooling-config/vitest/base";
import { mergeConfig } from "vitest/config";

const config = mergeConfig(
  createPackageConfig("create-graphql-markdown-docs", import.meta.url),
  {
    // This package has no `src/`; the code lives in `bin/`.
    test: { coverage: { include: ["bin/**/*.mjs"] } },
  },
);

export default config;
