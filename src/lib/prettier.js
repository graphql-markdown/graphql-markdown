const prettier = require("prettier");

function prettifyMarkdown(content) {
  return prettier.format(content, { parser: "markdown" });
}

function prettifyJavascript(content) {
  return prettier.format(content, { parser: "babel" });
}

module.exports = { prettifyMarkdown, prettifyJavascript };
