// @ts-check

import configDefault from "./graphql-doc-generator.config.mjs";
import configGroups from "./graphql-doc-generator-groups.config.mjs";
import configTweets from "./graphql-doc-generator-tweets.graphqlrc.mjs";

const config = [configDefault, configGroups, configTweets];

export default config;
