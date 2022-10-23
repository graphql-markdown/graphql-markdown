/* istanbul ignore file */

function prettify(content, parser) {
  try {
    const { format } = require("prettier");
    return format(content, { parser });
  } catch (error) {
    console.debug("Prettier is not found");
  }
}

function prettifyMarkdown(content) {
  return prettify(content, "markdown");
}

function prettifyJavascript(content) {
  return prettify(content, "babel");
}

module.exports = { prettifyMarkdown, prettifyJavascript };
