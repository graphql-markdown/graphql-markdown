/* istanbul ignore file */

const logger = require("./logger").getInstance();

async function prettify(content, parser) {
  try {
    const { format } = require("prettier");
    return await format(content, { parser });
  } catch (error) {
    logger.warn("Prettier is not found");
  }
}

async function prettifyMarkdown(content) {
  return await prettify(content, "markdown");
}

async function prettifyJavascript(content) {
  return await prettify(content, "babel");
}

module.exports = { prettifyMarkdown, prettifyJavascript };
