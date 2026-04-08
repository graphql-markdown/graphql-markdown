// @ts-check

import { schema, options } from "./config-groups.mjs";

/** @type {import('@graphql-markdown/types').ConfigOptions} */
const config = {
  id: "schema_with_grouping",
  schema,
  ...options,
};

export default config;
