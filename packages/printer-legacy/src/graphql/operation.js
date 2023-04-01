const {
  graphql: { getTypeName, isDeprecated },
} = require("@graphql-markdown/utils");

const {
  printSection,
  HIDE_DEPRECATED,
  SHOW_DEPRECATED,
} = require("../section");
const { printCodeField } = require("../code");
const { OPTION_DEPRECATED } = require("../const/options");

const printOperationType = (type, options) => {
  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  return printSection([options.schema.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

const printOperationMetadata = (type, options) => {
  const values = type.args;

  const response = printOperationType(type, options);

  switch (options.printDeprecated) {
    case OPTION_DEPRECATED.GROUP: {
      const { fields, deprecated } = values.reduce(
        (res, arg) => {
          isDeprecated(arg) ? res.deprecated.push(arg) : res.fields.push(arg);
          return res;
        },
        { fields: [], deprecated: [] },
      );

      const meta = printSection(fields, "Arguments", {
        ...options,
        parentType: type.name,
        parentTypePrefix: true,
      });
      const deprecatedMeta = printSection(deprecated, "", {
        ...options,
        parentType: type.name,
        parentTypePrefix: true,
        level: "",
        collapsible: {
          dataOpen: HIDE_DEPRECATED,
          dataClose: SHOW_DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}${response}`;
    }

    case OPTION_DEPRECATED.DEFAULT:
    default: {
      const metadata = printSection(values, "Arguments", {
        ...options,
        parentType: type.name,
        parentTypePrefix: true,
      });

      return `${metadata}${response}`;
    }
  }
};

const printCodeOperation = printCodeField;

module.exports = {
  printOperationMetadata,
  printCodeOperation,
};
