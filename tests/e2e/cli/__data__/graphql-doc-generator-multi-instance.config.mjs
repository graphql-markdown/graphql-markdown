import configDefault from "./data/graphql-doc-generator.config.mjs";
import configGroups from "./data/graphql-doc-generator-groups.config.mjs";
import configTweets from "./data/graphql-doc-generator-tweets.graphqlrc.mjs";

const config = {
  projects: {
    ...configDefault,
    ...configGroups,
    ...configTweets,
  },
};

export default config;
