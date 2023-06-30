const { loadConfigSync } = require("graphql-config");

const EXTENSION_NAME = "graphql-markdown";

const loadConfiguration = (
  options = undefined,
  { throwOnMissing, throwOnEmpty } = {
    throwOnMissing: false,
    throwOnEmpty: false,
  },
) => {
  const config = loadConfigSync({
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
