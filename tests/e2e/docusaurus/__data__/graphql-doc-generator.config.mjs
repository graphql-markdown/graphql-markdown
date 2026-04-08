// @ts-check

import { schema, options } from "./config-default.mjs";

/** @type {import('@graphql-markdown/types').ConfigOptions} */
const config = {
  schema,
  ...options,
};

export default config;
