/* istanbul ignore file */

module.exports = {
  generateDocFromSchema: require("./lib/generator"),
  groupInfo: require("./lib/group-info"),
  config: require("./config"),
  utils: require("./utils"),
  graphql: require("./lib/graphql"),
};
