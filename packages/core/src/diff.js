const logger = require("@graphql-markdown/utils").logger.getInstance();

const hasChanges = async (
  schema,
  tmpDir,
  diffMethod,
  diffModule = "@graphql-markdown/diff",
) => {
  if (
    typeof diffMethod === "undefined" ||
    diffMethod == null ||
    typeof diffModule === "undefined" ||
    diffModule == null
  ) {
    return true;
  }

  try {
    const { checkSchemaChanges } = require(diffModule);
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch (error) {
    logger.warn(
      `Cannot find module '${diffModule}' from @graphql-markdown/core!`,
    );
  }

  return true;
};

module.exports = { hasChanges };
