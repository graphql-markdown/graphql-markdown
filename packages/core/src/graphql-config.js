const logger = require("@graphql-markdown/utils").logger.getInstance();

const EXTENSION_NAME = "graphql-markdown";

const loadConfiguration = (
  id = undefined,
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

  try {
    if (
      typeof config === "undefined" ||
      typeof config.getProject(id) === "undefined"
    ) {
      return undefined;
    }

    const projectConfig = config.getProject(id).extension(EXTENSION_NAME);

    if (typeof projectConfig?.schema !== "string") {
      const schema = projectConfig?.schema[0];
      if (typeof schema === "string") {
        projectConfig.schema = schema;
      } else {
        projectConfig.schema = Object.keys(schema)[0];
      }
    }
    return projectConfig;
  } catch (error) {
    return undefined;
  }
};

module.exports = { loadConfiguration, EXTENSION_NAME };
