import { join } from "node:path";

import { typedocBaseOptions } from "./base.mjs";
import { typedocApiOptions } from "./root.mjs";

const projectRoot = join(import.meta.dirname, "../../..");

export default {
  ...typedocBaseOptions,
  ...typedocApiOptions,
  plugin: [
    "typedoc-plugin-markdown",
    "typedoc-plugin-frontmatter",
    "typedoc-docusaurus-theme",
    `${projectRoot}/packages/tooling-config/typedoc/custom-frontmatter.mjs`,
    `${projectRoot}/packages/tooling-config/typedoc/no-media-plugin.mjs`,
  ],
  prettierConfigFile: `${projectRoot}/packages/tooling-config/prettier/index.mjs`,
  entryPoints: [`${projectRoot}/packages/*`],
  entryPointStrategy: "packages",
  exclude: [
    `${projectRoot}/packages/types`,
    `${projectRoot}/packages/tooling-config`,
    `${projectRoot}/packages/core/src/index.ts`,
    `${projectRoot}/packages/graphql/src/index.ts`,
    `${projectRoot}/packages/helpers/src/index.ts`,
    `${projectRoot}/packages/printer-legacy/src/index.ts`,
    `${projectRoot}/packages/printer-legacy/src/graphql/index.ts`,
    `${projectRoot}/packages/utils/src/index.ts`,
  ],
  outputs: [{ name: "markdown", path: `${projectRoot}/api` }],
  readme: `${projectRoot}/docs/__api/__index.md`,
};
