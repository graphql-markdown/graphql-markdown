const {
  object: { hasMethod },
  graphql: { getTypeName, getFields, isDeprecated },
} = require("@graphql-markdown/utils");

const {
  printSection,
  HIDE_DEPRECATED,
  SHOW_DEPRECATED,
} = require("../section");
const { printCodeField } = require("../code");
const { MARKDOWN_EOL } = require("../const/strings");
const { OPTION_DEPRECATED } = require("../const/options");

const printInterfaceMetadata = (type, options) => {
  if (hasMethod(type, "getInterfaces") === false) {
    return "";
  }

  return printSection(type.getInterfaces(), "Interfaces", options);
};

const printObjectMetadata = (type, options) => {
  const values = getFields(type);

  const interfaceMeta = printInterfaceMetadata(type, options);

  switch (options.printDeprecated) {
    case OPTION_DEPRECATED.GROUP: {
      const { fields, deprecated } = values.reduce(
        (res, arg) => {
          isDeprecated(arg) ? res.deprecated.push(arg) : res.fields.push(arg);
          return res;
        },
        { fields: [], deprecated: [] },
      );

      const meta = printSection(fields, "Fields", {
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

      return `${meta}${deprecatedMeta}${interfaceMeta}`;
    }

    case OPTION_DEPRECATED.DEFAULT:
    default: {
      const metadata = printSection(values, "Fields", {
        ...options,
        parentType: type.name,
      });

      return `${metadata}${interfaceMeta}`;
    }
  }
};

const printCodeType = (type, entity) => {
  const name = getTypeName(type);
  const extendsInterface =
    hasMethod(type, "getInterfaces") && type.getInterfaces().length > 0
      ? ` implements ${type
          .getInterfaces()
          .map((field) => getTypeName(field))
          .join(", ")}`
      : "";
  const typeFields = getFields(type)
    .map((v) => `  ${printCodeField(v)}`)
    .join("");

  return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
};

const printCodeObject = (type) => printCodeType(type, "type");

module.exports = {
  printObjectMetadata,
  printCodeObject,
  printCodeType,
};
