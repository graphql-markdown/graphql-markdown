const logger = require("@graphql-markdown/utils").logger.getInstance();

const EXTENSION_NAME = "graphql-markdown";

const loadConfiguration = (
  options = undefined,
  { throwOnMissing, throwOnEmpty } = {
    throwOnMissing: false,
    throwOnEmpty: false,
  },
) => {
  let GraphQLConfig;
  try {
    GraphQLConfig = require("graphql-config");
  } catch (error) {
    logger.warn(error.message);
    return undefined;
  }

  const config = GraphQLConfig.loadConfigSync({
    ...options,
    extensions: [() => ({ name: EXTENSION_NAME })],
    throwOnMissing: throwOnMissing || false,
    throwOnEmpty: throwOnEmpty || false,
  });

  if (
    typeof config === "undefined" ||
    typeof config.getDefault() === "undefined"
  ) {
    return undefined;
  }

  return config.getDefault().extension(EXTENSION_NAME);
};

module.exports = { loadConfiguration, EXTENSION_NAME };
