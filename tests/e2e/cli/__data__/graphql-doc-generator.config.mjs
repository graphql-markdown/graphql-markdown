import { schema, options } from "./config-default.mjs";

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
  default: {
    schema,
    extensions: {
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      "graphql-markdown": options,
    },
  },
};

export default config;
