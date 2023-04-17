const {
  object: { hasProperty },
  graphql: { getDefaultValue, getTypeName, isDeprecated, hasDirective },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL, DEPRECATED } = require("./const/strings");
const { OPTION_DEPRECATED } = require("./const/options");

const printCodeField = (type, options = {}) => {
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
  code += printCodeArguments(type);
  code += `: ${getTypeName(type.type)}`;
  code += isDeprecated(type) ? ` @${DEPRECATED}` : "";
  code += MARKDOWN_EOL;

  return code;
};

const printCodeArguments = (type) => {
  if (!hasProperty(type, "args") || type.args.length === 0) {
    return "";
  }

  let code = `(${MARKDOWN_EOL}`;
  code += type.args.reduce((r, v) => {
    const defaultValue = getDefaultValue(v);
    const hasDefaultValue =
      typeof defaultValue !== "undefined" && defaultValue !== null;
    const printedDefault = hasDefaultValue ? ` = ${getDefaultValue(v)}` : "";
    const propType = v.type.toString();
    const propName = v.name.toString();
    return `${r}  ${propName}: ${propType}${printedDefault}${MARKDOWN_EOL}`;
  }, "");
  code += `)`;

  return code;
};

module.exports = {
  printCodeField,
  printCodeArguments,
};
