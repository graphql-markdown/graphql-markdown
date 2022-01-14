/* istanbul ignore file */
let prettier;

try {
  prettier = require("prettier");
} catch (e) {
  console.debug("Prettier is not found");
}

function prettifyMarkdown(content) {
  if (typeof prettier == "undefined") {
    return content;
  }

  return prettier.format(content, { parser: "markdown" });
}

function prettifyJavascript(content) {
  if (typeof prettier == "undefined") {
    return content;
  }

  return prettier.format(content, { parser: "babel" });
}

module.exports = { prettifyMarkdown, prettifyJavascript };
