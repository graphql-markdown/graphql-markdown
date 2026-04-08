import { schema, options } from "./config-tweets.mjs";

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
  schema_tweets: {
    schema,
    extensions: {
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      "graphql-markdown": options,
    },
  },
};

export default config;
