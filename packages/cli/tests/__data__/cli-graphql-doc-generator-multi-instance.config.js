module.exports = {
  projects: {
    ...require("./data/cli-graphql-doc-generator.config.js"),
    ...require("./data/cli-graphql-doc-generator-groups.config.js"),
    ...require("./data/cli-graphql-doc-generator-tweets.graphqlrc.js"),
  },
};
