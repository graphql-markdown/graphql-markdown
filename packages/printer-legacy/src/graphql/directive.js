const {
  object: { hasProperty },
  graphql: { getTypeName, isDeprecated },
} = require("@graphql-markdown/utils");

const {
  printSection,
  HIDE_DEPRECATED,
  SHOW_DEPRECATED,
} = require("../section");
const { printCodeArguments } = require("../code");
const { OPTION_DEPRECATED } = require("../const/options");

const printCodeDirectiveLocation = (type) => {
  if (
    typeof type.locations === "undefined" ||
    type.locations == null ||
    type.locations.length === 0
  ) {
    return "";
  }

  let code = ` on `;
  const separator = `\r\n  | `;
  if (type.locations.length > 1) {
    code += separator;
  }
  code += type.locations.join(separator).trim();

  return code;
};

const printDirectiveMetadata = (type, options) => {
  if (hasProperty(type, "args") === false) {
    return "";
  }

  switch (options.printDeprecated) {
    case OPTION_DEPRECATED.GROUP: {
      const { fields, deprecated } = type.args.reduce(
        (res, arg) => {
          isDeprecated(arg) ? res.deprecated.push(arg) : res.fields.push(arg);
          return res;
        },
        { fields: [], deprecated: [] },
      );

      const meta = printSection(fields, "Arguments", {
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
      return printSection(type.args, "Arguments", {
        ...options,
        parentType: type.name,
      });
  }
};

const printCodeDirective = (type) => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};

module.exports = {
  printDirectiveMetadata,
  printCodeDirective,
};
