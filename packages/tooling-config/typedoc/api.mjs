import { typedocBaseOptions } from "./base.mjs";
import { typedocApiOptions } from "./root.mjs";

const ROOT_DIR = "../../..";

export default {
  ...typedocBaseOptions,
  ...typedocApiOptions,
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-frontmatter",
    "typedoc-docusaurus-theme",
    "./custom-frontmatter.mjs",
    "./no-media-plugin.mjs",
  ],
  prettierConfigFile: "../prettier/index.mjs",
  entryPoints: [`${ROOT_DIR}/packages/*`],
  entryPointStrategy: "packages",
  exclude: [
    `${ROOT_DIR}/packages/types`,
    `${ROOT_DIR}/packages/core/src/index.ts`,
    `${ROOT_DIR}/packages/graphql/src/index.ts`,
    `${ROOT_DIR}/packages/helpers/src/index.ts`,
    `${ROOT_DIR}/packages/printer-legacy/src/index.ts`,
    `${ROOT_DIR}/packages/printer-legacy/src/graphql/index.ts`,
    `${ROOT_DIR}/packages/utils/src/index.ts`,
  ],
  outputs: [{ name: "markdown", path: `${ROOT_DIR}/api` }],
  readme: `${ROOT_DIR}/docs/__api/__index.md`,
};
