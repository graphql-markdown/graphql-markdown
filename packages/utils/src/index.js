module.exports = {
  helpers: {
    fs: require("./helpers/fs"),
    prettier: require("./helpers/prettier"),
  },
  scalars: {
    array: require("./scalars/array"),
    object: require("./scalars/object"),
    string: require("./scalars/string"),
    url: require("./scalars/url"),
  },
  graphql: require("./lib/graphql"),
};
