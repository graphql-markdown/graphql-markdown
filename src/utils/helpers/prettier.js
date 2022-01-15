/* istanbul ignore file */
let prettier;

try {
  prettier = require("prettier");
} catch (e) {
  console.debug("Prettier is not found");
}

function hasPrettierModule() {
  return typeof prettier !== "undefined";
}

function prettify(content, parser) {
  if (!hasPrettierModule()) {
    return content;
  }
  return prettier.format(content, { parser });
}

function prettifyMarkdown(content) {
  return prettify(content, "markdown");
}

function prettifyJavascript(content) {
  return prettify(content, "babel");
}

module.exports = { hasPrettierModule, prettifyMarkdown, prettifyJavascript };
