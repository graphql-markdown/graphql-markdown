const {
  graphql: { isEnumType, isDeprecated, getTypeName },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL } = require("../const/strings");
const { OPTION_DEPRECATED } = require("../const/options");
const {
  printSection,
  HIDE_DEPRECATED,
  SHOW_DEPRECATED,
} = require("../section");

const printEnumMetadata = (type, options) => {
  switch (options.printDeprecated) {
    case OPTION_DEPRECATED.GROUP: {
      const { values, deprecated } = type.getValues().reduce(
        (res, arg) => {
          isDeprecated(arg) ? res.deprecated.push(arg) : res.values.push(arg);
          return res;
        },
        { values: [], deprecated: [] },
      );

      const meta = printSection(values, "Values", {
        ...options,
        parentType: type.name,
      });
      const deprecatedMeta = printSection(deprecated, "", {
        ...options,
        parentType: type.name,
        level: "",
        collapsible: {
          dataOpen: HIDE_DEPRECATED,
          dataClose: SHOW_DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}`;
    }

    case OPTION_DEPRECATED.DEFAULT:
    default:
      return printSection(type.getValues(), "Values", {
        ...options,
        parentType: type.name,
      });
  }
};

const printCodeEnum = (type) => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((v) => `  ${getTypeName(v)}`)
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};

module.exports = {
  printCodeEnum,
  printEnumMetadata,
};
