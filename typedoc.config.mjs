import { typedocBaseOptions } from "./packages/tooling-config/typedoc/base.mjs";
import { typedocApiOptions } from "./packages/tooling-config/typedoc/root.mjs";

export default {
  ...typedocBaseOptions,
  ...typedocApiOptions,
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-frontmatter",
    "typedoc-docusaurus-theme",
    "./packages/tooling-config/typedoc/custom-frontmatter.mjs",
    "./packages/tooling-config/typedoc/no-media-plugin.mjs",
  ],
  prettierConfigFile: "./packages/tooling-config/prettier/index.js",
  entryPoints: ["packages/*"],
  entryPointStrategy: "packages",
  exclude: [
    "packages/types",
    "packages/core/src/index.ts",
    "packages/graphql/src/index.ts",
    "packages/helpers/src/index.ts",
    "packages/printer-legacy/src/index.ts",
    "packages/printer-legacy/src/graphql/index.ts",
    "packages/utils/src/index.ts",
  ],
  outputs: [{ name: "markdown", path: "./api" }],
  readme: "./docs/__api/__index.md",
};
