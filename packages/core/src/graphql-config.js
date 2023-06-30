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
    // eslint-disable-next-line node/no-missing-require
    GraphQLConfig = require("graphql-config");
  } catch (error) {
    logger.log("Cannot find module 'graphql-config'!");
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

  const defaultConfig = config.getDefault().extension(EXTENSION_NAME);

  if (typeof defaultConfig?.schema !== "string") {
    const schema = defaultConfig?.schema[0];
    if (typeof schema === "string") {
      defaultConfig.schema = schema;
    } else {
      defaultConfig.schema = Object.keys(schema)[0];
    }
  }

  return defaultConfig;
};

module.exports = { loadConfiguration, EXTENSION_NAME };
