const {
  hasProperty,
  getDefaultValue,
  getTypeName,
  isDeprecated,
  hasDirective,
} = require("@graphql-markdown/utils");

const {
  MARKDOWN_EOL,
  DEPRECATED,
  MARKDOWN_CODE_INDENTATION,
} = require("./const/strings");
const { OPTION_DEPRECATED } = require("./const/options");

const printCodeField = (type, options = {}, indentationLevel = 0) => {
  const skipDirective =
    hasProperty(options, "skipDocDirective") &&
    hasDirective(type, options.skipDocDirective) === true;
  const skipDeprecated =
    hasProperty(options, "printDeprecated") &&
    options.printDeprecated === OPTION_DEPRECATED.SKIP &&
    isDeprecated(type) === true;
  if (skipDirective === true || skipDeprecated === true) {
    return "";
  }

  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type, indentationLevel + 1);
  code += `: ${getTypeName(type.type)}`;
  code += isDeprecated(type) ? ` @${DEPRECATED}` : "";
  code += MARKDOWN_EOL;

  return code;
};

const printCodeArguments = (type, indentationLevel = 1) => {
  if (!hasProperty(type, "args") || type.args.length === 0) {
    return "";
  }

  const argIndentation = MARKDOWN_CODE_INDENTATION.repeat(indentationLevel);
  const parentIndentation =
    indentationLevel === 1 ? "" : MARKDOWN_CODE_INDENTATION;
  let code = `(${MARKDOWN_EOL}`;
  code += type.args.reduce((r, v) => {
    const defaultValue = getDefaultValue(v);
    const hasDefaultValue =
      typeof defaultValue !== "undefined" && defaultValue !== null;
    const printedDefault = hasDefaultValue ? ` = ${getDefaultValue(v)}` : "";
    const propType = v.type.toString();
    const propName = v.name.toString();
    return `${r}${argIndentation}${propName}: ${propType}${printedDefault}${MARKDOWN_EOL}`;
  }, "");
  code += `${parentIndentation})`;

  return code;
};

module.exports = {
  printCodeField,
  printCodeArguments,
};
