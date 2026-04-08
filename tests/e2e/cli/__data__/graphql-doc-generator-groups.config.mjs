import { schema, options } from "./config-groups.mjs";

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
  schema_with_grouping: {
    schema,
    extensions: {
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      "graphql-markdown": options,
    },
  },
};

export default config;
