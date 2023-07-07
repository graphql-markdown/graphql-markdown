const {
  graphql: {
    getTypeName,
    hasDirective,
    isDirectiveType,
    isEnumType,
    isInputType,
    isInterfaceType,
    isObjectType,
    isOperation,
    isScalarType,
    isUnionType,
  },
} = require("@graphql-markdown/utils");

const {
  url: { pathUrl },
} = require("@graphql-markdown/utils");

const { printRelations } = require("./relation");
const { printDescription } = require("./common");
const { printCustomDirectives, printCustomTags } = require("./directive");
const {
  printCodeDirective,
  printCodeEnum,
  printCodeInput,
  printCodeInterface,
  printCodeObject,
  printCodeOperation,
  printCodeScalar,
  printCodeUnion,
  printDirectiveMetadata,
  printEnumMetadata,
  printInputMetadata,
  printInterfaceMetadata,
  printObjectMetadata,
  printOperationMetadata,
  printScalarMetadata,
  printUnionMetadata,
} = require("./graphql");
const {
  FRONT_MATTER,
  MARKDOWN_EOC,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
} = require("./const/strings");
const mdx = require("./const/mdx");

const {
  DEFAULT_OPTIONS,
  PRINT_TYPE_DEFAULT_OPTIONS,
} = require("./const/options");

class Printer {
  static options;

  static init = (
    schema,
    baseURL,
    linkRoot = "/",
    { customDirectives, groups, printTypeOptions, skipDocDirective } = {
      customDirectives: undefined,
      groups: undefined,
      printTypeOptions: PRINT_TYPE_DEFAULT_OPTIONS,
      skipDocDirective: undefined,
    },
  ) => {
    if (typeof Printer.options !== "undefined" && Printer.options !== null) {
      return;
    }

    Printer.options = {
      ...DEFAULT_OPTIONS,
      basePath: pathUrl.join(linkRoot, baseURL),
      codeSection:
        printTypeOptions?.codeSection ?? PRINT_TYPE_DEFAULT_OPTIONS.codeSection,
      customDirectives,
      groups,
      parentTypePrefix:
        printTypeOptions?.parentTypePrefix ??
        PRINT_TYPE_DEFAULT_OPTIONS.parentTypePrefix,
      printDeprecated:
        printTypeOptions?.deprecated ??
        PRINT_TYPE_DEFAULT_OPTIONS.printDeprecated,
      relatedTypeSection:
        printTypeOptions?.relatedTypeSection ??
        PRINT_TYPE_DEFAULT_OPTIONS.relatedTypeSection,
      schema,
      skipDocDirective: skipDocDirective ?? undefined,
      typeBadges:
        printTypeOptions?.typeBadges ?? PRINT_TYPE_DEFAULT_OPTIONS.typeBadges,
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

  static printCode = (type, options) => {
    let code = "";

    if (
      typeof options?.codeSection === "undefined" ||
      options.codeSection !== true
    ) {
      return code;
    }

    switch (true) {
      case isOperation(type):
        code += printCodeOperation(type, options);
        break;
      case isEnumType(type):
        code += printCodeEnum(type, options);
        break;
      case isUnionType(type, options):
        code += printCodeUnion(type, options);
        break;
      case isInterfaceType(type, options):
        code += printCodeInterface(type, options);
        break;
      case isObjectType(type):
        code += printCodeObject(type, options);
        break;
      case isInputType(type):
        code += printCodeInput(type, options);
        break;
      case isScalarType(type):
        code += printCodeScalar(type, options);
        break;
      case isDirectiveType(type):
        code += printCodeDirective(type, options);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }

    return MARKDOWN_SOC + code.trim() + MARKDOWN_EOC;
  };

  static printCustomDirectives = printCustomDirectives;

  static printCustomTags = printCustomTags;

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
    const code = Printer.printCode(type, printTypeOptions);
    const customDirectives = Printer.printCustomDirectives(
      type,
      printTypeOptions,
    );
    const tags = Printer.printCustomTags(type, printTypeOptions);
    const metadata = Printer.printTypeMetadata(type, printTypeOptions);
    const relations = Printer.printRelations(type, printTypeOptions);

    return [
      header,
      mdx,
      tags,
      description,
      code,
      customDirectives,
      metadata,
      relations,
    ].join(MARKDOWN_EOP);
  };
}

module.exports = { Printer, DEFAULT_OPTIONS };
