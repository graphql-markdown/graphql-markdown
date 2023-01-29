const {
  graphql: {
    getTypeName,
    isOperation,
    isEnumType,
    isUnionType,
    isInterfaceType,
    isObjectType,
    isInputType,
    isScalarType,
    isDirectiveType,
  },
} = require("@graphql-markdown/utils");

const {
  url: { pathUrl },
} = require("@graphql-markdown/utils");

const { printRelations } = require("./relation");
const { printDescription } = require("./common");
const { printCodeField } = require("./code");
const { printOperationMetadata } = require("./operation");
const { printCodeEnum, printEnumMetadata } = require("./enum");
const { printCodeUnion, printUnionMetadata } = require("./union");
const { printCodeInterface, printInterfaceMetadata } = require("./interface");
const { printCodeObject, printObjectMetadata } = require("./object");
const { printCodeInput, printInputMetadata } = require("./input");
const { printCodeScalar, printScalarMetadata } = require("./scalar");
const { printCodeDirective, printDirectiveMetadata } = require("./directive");
const {
  MARKDOWN_EOP,
  MARKDOWN_EOL,
  MARKDOWN_SOC,
  MARKDOWN_EOC,
  FRONT_MATTER,
} = require("./const/strings");
const mdx = require("./const/mdx");

const DEFAULT_OPTIONS = {
  schema: undefined,
  basePath: "/",
  groups: {},
  parentTypePrefix: true,
  relatedTypeSection: true,
  typeBadges: true,
  skipDocDirective: undefined,
};

class Printer {
  static options;

  static init = (
    schema,
    baseURL,
    linkRoot = "/",
    { groups, printTypeOptions, skipDocDirective } = {
      groups: undefined,
      printTypeOptions: undefined,
      skipDocDirective: undefined,
    },
  ) => {
    if (typeof this.options !== "undefined") {
      return;
    }

    this.options = {
      ...DEFAULT_OPTIONS,
      schema,
      basePath: pathUrl.join(linkRoot, baseURL),
      groups,
      parentTypePrefix: printTypeOptions?.parentTypePrefix ?? true,
      relatedTypeSection: printTypeOptions?.relatedTypeSection ?? true,
      typeBadges: printTypeOptions?.typeBadges ?? true,
      skipDocDirective: skipDocDirective ?? undefined,
    };
  };

  static printHeader = (id, title, options) => {
    const { toc, pagination } = {
      toc: true,
      pagination: true,
      ...(options.header ?? undefined),
    };
    const pagination_buttons = pagination
      ? []
      : ["pagination_next: null", "pagination_prev: null"];

    const header = [
      FRONT_MATTER,
      `id: ${id}`,
      `title: ${title}`,
      `hide_table_of_contents: ${!toc}`,
      ...pagination_buttons,
      FRONT_MATTER,
    ];

    return header.join(MARKDOWN_EOL);
  };

  static printDescription = printDescription;

  static printCode = (type) => {
    let code = "";

    switch (true) {
      case isOperation(type):
        code += printCodeField(type);
        break;
      case isEnumType(type):
        code += printCodeEnum(type);
        break;
      case isUnionType(type):
        code += printCodeUnion(type);
        break;
      case isInterfaceType(type):
        code += printCodeInterface(type);
        break;
      case isObjectType(type):
        code += printCodeObject(type);
        break;
      case isInputType(type):
        code += printCodeInput(type);
        break;
      case isScalarType(type):
        code += printCodeScalar(type);
        break;
      case isDirectiveType(type):
        code += printCodeDirective(type);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }

    return MARKDOWN_SOC + code.trim() + MARKDOWN_EOC;
  };

  static printTypeMetadata = (type, options) => {
    let metadata;

    switch (true) {
      case isScalarType(type):
        return printScalarMetadata(type, options);
      case isEnumType(type):
        return printEnumMetadata(type, options);
      case isUnionType(type):
        return printUnionMetadata(type, options);
      case isObjectType(type):
        return printObjectMetadata(type, options);
      case isInterfaceType(type):
        return printInterfaceMetadata(type, options);
      case isInputType(type):
        return printInputMetadata(type, options);
      case isDirectiveType(type):
        return printDirectiveMetadata(type, options);
      case isOperation(type):
        return printOperationMetadata(type, options);
      default:
        return metadata;
    }
  };

  static printRelations = this.relatedTypeSection ? printRelations : () => "";

  static printType = (name, type, options) => {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const header = Printer.printHeader(name, getTypeName(type), {
      ...this.options,
      header: options,
    });
    const description = Printer.printDescription(type, this.options);
    const code = Printer.printCode(type, this.options);
    const metadata = Printer.printTypeMetadata(type, this.options);
    const relations = Printer.printRelations(type, this.options);

    return [header, mdx, description, code, metadata, relations].join(
      MARKDOWN_EOP,
    );
  };
}

module.exports = { Printer, DEFAULT_OPTIONS };
