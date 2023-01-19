const {
  object: { hasProperty },
  graphql: { getDefaultValue, getTypeName },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL } = require("./const/strings");

const printCodeField = (type) => {
  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += `: ${getTypeName(type.type)}${MARKDOWN_EOL}`;

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
