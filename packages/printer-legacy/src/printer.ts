import type {
  CustomDirectiveMap,
  DirectiveName,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  MDXString,
  PrintTypeOptions,
  PrinterConfigPrintTypeOptions,
  SchemaEntitiesGroupMap,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

import {
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
  pathUrl,
} from "@graphql-markdown/utils";

import { printRelations } from "./relation";
import { printDescription } from "./common";
import { printCustomDirectives, printCustomTags } from "./directive";
import {
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
} from "./graphql";

import {
  FRONT_MATTER,
  MARKDOWN_EOC,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
} from "./const/strings";
import { mdx } from "./const/mdx";

import { DEFAULT_OPTIONS, PRINT_TYPE_DEFAULT_OPTIONS } from "./const/options";
export class Printer {
  static options: PrintTypeOptions | undefined;

  static init(
    schema: GraphQLSchema | undefined = undefined,
    baseURL: string = "schema",
    linkRoot: string = "/",
    {
      customDirectives,
      groups,
      printTypeOptions,
      skipDocDirective,
    }: {
      customDirectives?: CustomDirectiveMap;
      deprecated?: TypeDeprecatedOption;
      groups?: SchemaEntitiesGroupMap;
      printTypeOptions?: PrinterConfigPrintTypeOptions;
      skipDocDirective?: DirectiveName[];
    } = {
      customDirectives: undefined,
      groups: undefined,
      printTypeOptions: PRINT_TYPE_DEFAULT_OPTIONS,
      skipDocDirective: undefined,
    },
  ): void {
    if (typeof Printer.options !== "undefined") {
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
      deprecated:
        printTypeOptions?.deprecated ?? PRINT_TYPE_DEFAULT_OPTIONS.deprecated,
      relatedTypeSection:
        printTypeOptions?.relatedTypeSection ??
        PRINT_TYPE_DEFAULT_OPTIONS.relatedTypeSection,
      schema,
      skipDocDirective: skipDocDirective ?? undefined,
      typeBadges:
        printTypeOptions?.typeBadges ?? PRINT_TYPE_DEFAULT_OPTIONS.typeBadges,
    };
  }

  static printHeader = (
    id: string,
    title: string,
    options: PrintTypeOptions,
  ): string => {
    const { toc, pagination } = options.header ?? DEFAULT_OPTIONS.header;
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

  static printCode = (type: unknown, options: PrintTypeOptions): string => {
    let code = "";

    if (
      typeof options?.codeSection === "undefined" ||
      options.codeSection !== true
    ) {
      return code;
    }

    switch (true) {
      case isOperation(type):
        code += printCodeOperation(
          type as GraphQLField<unknown, unknown, unknown>,
          options,
        );
        break;
      case isEnumType(type):
        code += printCodeEnum(type as GraphQLEnumType, options);
        break;
      case isUnionType(type):
        code += printCodeUnion(type as GraphQLUnionType, options);
        break;
      case isInterfaceType(type):
        code += printCodeInterface(type as GraphQLInterfaceType, options);
        break;
      case isObjectType(type):
        code += printCodeObject(type as GraphQLObjectType, options);
        break;
      case isInputType(type):
        code += printCodeInput(type as GraphQLInputObjectType, options);
        break;
      case isScalarType(type):
        code += printCodeScalar(type as GraphQLScalarType, options);
        break;
      case isDirectiveType(type):
        code += printCodeDirective(type as GraphQLDirective, options);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }

    return MARKDOWN_SOC + code.trim() + MARKDOWN_EOC;
  };

  static printCustomDirectives = printCustomDirectives;

  static printCustomTags = printCustomTags;

  static printTypeMetadata = (
    type: unknown,
    options: PrintTypeOptions,
  ): string | MDXString => {
    switch (true) {
      case isScalarType(type):
        return printScalarMetadata(type as GraphQLScalarType);
      case isEnumType(type):
        return printEnumMetadata(type as GraphQLEnumType, options);
      case isUnionType(type):
        return printUnionMetadata(type as GraphQLUnionType, options);
      case isObjectType(type):
        return printObjectMetadata(type as GraphQLObjectType, options);
      case isInterfaceType(type):
        return printInterfaceMetadata(type as GraphQLInterfaceType, options);
      case isInputType(type):
        return printInputMetadata(type as GraphQLInputObjectType, options);
      case isDirectiveType(type):
        return printDirectiveMetadata(type as GraphQLDirective, options);
      case isOperation(type):
        return printOperationMetadata(
          type as GraphQLField<unknown, unknown, unknown>,
          options,
        );
      default:
        return "";
    }
  };

  static printRelations = (
    type: unknown,
    options: PrintTypeOptions,
  ): string | MDXString => {
    if (options.relatedTypeSection !== true) {
      return "";
    }
    return printRelations(type, options);
  };

  static printType = (
    name: string | undefined,
    type: unknown,
    options?: PrintTypeOptions,
  ): MDXString | undefined => {
    const printTypeOptions: PrintTypeOptions = {
      ...DEFAULT_OPTIONS,
      ...Printer.options,
      ...options,
    };

    if (
      typeof type === "undefined" ||
      type === null ||
      typeof name === "undefined" ||
      hasDirective(type, printTypeOptions.skipDocDirective)
    ) {
      return undefined;
    }

    const header = Printer.printHeader(
      name,
      getTypeName(type),
      printTypeOptions,
    );
    const description = Printer.printDescription(type, printTypeOptions);
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
    ].join(MARKDOWN_EOP) as MDXString;
  };
}
