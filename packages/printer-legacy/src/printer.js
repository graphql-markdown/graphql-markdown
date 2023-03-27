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
    hasDirective,
  },
} = require("@graphql-markdown/utils");

const {
  url: { pathUrl },
} = require("@graphql-markdown/utils");

const { printRelations } = require("./relation");
const { printDescription } = require("./common");
const {
  printOperationMetadata,
  printCodeOperation,
  printCodeEnum,
  printEnumMetadata,
  printCodeUnion,
  printUnionMetadata,
  printCodeInterface,
  printInterfaceMetadata,
  printCodeObject,
  printObjectMetadata,
  printCodeInput,
  printInputMetadata,
  printCodeScalar,
  printScalarMetadata,
  printCodeDirective,
  printDirectiveMetadata,
} = require("./graphql");
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
  collapsible: true,
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
    if (typeof Printer.options !== "undefined" && Printer.options !== null) {
      return;
    }

    Printer.options = {
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
        code += printCodeOperation(type);
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

  static printRelations = (type, options) => {
    if (Printer.options.relatedTypeSection !== true) {
      return "";
    }
    return printRelations(type, options);
  };

  static printType = (name, type, options) => {
    if (
      typeof type === "undefined" ||
      type === null ||
      typeof name === "undefined" ||
      name === null ||
      hasDirective(type, Printer.options.skipDocDirective)
    ) {
      return undefined;
    }

    const printTypeOptions = {
      ...DEFAULT_OPTIONS,
      ...Printer.options,
      ...options,
    };

    const header = Printer.printHeader(name, getTypeName(type), {
      ...printTypeOptions,
      header: options,
    });
    const description = Printer.printDescription(type);
    const code = Printer.printCode(type);
    const metadata = Printer.printTypeMetadata(type, printTypeOptions);
    const relations = Printer.printRelations(type, printTypeOptions);

    return [header, mdx, description, code, metadata, relations].join(
      MARKDOWN_EOP,
    );
  };
}

module.exports = { Printer, DEFAULT_OPTIONS };
