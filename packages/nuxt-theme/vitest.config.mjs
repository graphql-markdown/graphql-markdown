// @ts-check

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPackageConfig } from "@graphql-markdown/tooling-config/vitest/base";

const config = createPackageConfig("nuxt-theme", import.meta.url);
const root = fileURLToPath(new URL(".", import.meta.url));

// Add ~ alias for app directory
config.resolve.alias["~"] = resolve(root, "app");

export default config;
