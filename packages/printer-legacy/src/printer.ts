import type {
  CustomDirectiveMap,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLOperationType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  IPrinter,
  MDXString,
  Maybe,
  PrintTypeOptions,
  PrinterConfigPrintTypeOptions,
  SchemaEntitiesGroupMap,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

import {
  getTypeName,
  isDirectiveType,
  isEnumType,
  isInputType,
  isInterfaceType,
  isObjectType,
  isOperation,
  isScalarType,
  isUnionType,
} from "@graphql-markdown/graphql";
import { pathUrl } from "@graphql-markdown/utils";

import { printRelations } from "./relation";
import { hasPrintableDirective, printDescription } from "./common";
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

export class Printer implements IPrinter {
  static options: Maybe<PrintTypeOptions>;

  static printDescription = printDescription;

  static printCustomDirectives = printCustomDirectives;

  static printCustomTags = printCustomTags;

  static init(
    schema: Maybe<GraphQLSchema>,
    baseURL: Maybe<string> = "schema",
    linkRoot: Maybe<string> = "/",
    {
      customDirectives,
      groups,
      onlyDocDirectives,
      printTypeOptions,
      skipDocDirectives,
      metatags,
    }: {
      customDirectives?: CustomDirectiveMap;
      deprecated?: TypeDeprecatedOption;
      groups?: SchemaEntitiesGroupMap;
      onlyDocDirectives?: GraphQLDirective[];
      printTypeOptions?: PrinterConfigPrintTypeOptions;
      skipDocDirectives?: GraphQLDirective[];
      metatags?: Record<string, string>[];
    } = {
      customDirectives: undefined,
      groups: undefined,
      onlyDocDirectives: [],
      printTypeOptions: PRINT_TYPE_DEFAULT_OPTIONS,
      skipDocDirectives: [],
      metatags: [],
    },
  ): void {
    if (typeof Printer.options !== "undefined") {
      return;
    }

    Printer.options = {
      ...DEFAULT_OPTIONS,
      basePath: pathUrl.join(linkRoot ?? "", baseURL ?? ""),
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
      onlyDocDirectives: onlyDocDirectives ?? [],
      skipDocDirectives: skipDocDirectives ?? [],
      typeBadges:
        printTypeOptions?.typeBadges ?? PRINT_TYPE_DEFAULT_OPTIONS.typeBadges,
      metatags: metatags ?? [],
    };
  }

  static printHeader = (
    id: string,
    title: string,
    options: PrintTypeOptions,
  ): string => {
    const { toc, pagination, frontMatter } =
      options.header ?? DEFAULT_OPTIONS.header!;
    const paginationButtons = pagination!
      ? {}
      : { pagination_next: null, pagination_prev: null };

    const fm = {
      id,
      title,
      ...paginationButtons,
      hide_table_of_contents: !toc,
      ...frontMatter,
    };

    const header: string[] = [FRONT_MATTER];
    for (const [key, value] of Object.entries(fm)) {
      header.push(`${key}: ${value}`);
    }
    header.push(FRONT_MATTER);

    return header.join(MARKDOWN_EOL);
  };

  static printCode = (type: unknown, options: PrintTypeOptions): string => {
    let code = "";

    if (
      typeof options.codeSection === "undefined" ||
      options.codeSection !== true
    ) {
      return code;
    }

    switch (true) {
      case isOperation(type):
        code += printCodeOperation(type as GraphQLOperationType, options);
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

  static printTypeMetadata = (
    type: unknown,
    options: PrintTypeOptions,
  ): MDXString | string => {
    switch (true) {
      case isScalarType(type):
        return printScalarMetadata(type as GraphQLScalarType, options);
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
          type as unknown as GraphQLField<unknown, unknown, unknown>,
          options,
        );
      default:
        return "";
    }
  };

  static printRelations = (
    type: unknown,
    options: PrintTypeOptions,
  ): MDXString | string => {
    if (options.relatedTypeSection !== true) {
      return "";
    }
    return printRelations(type, options);
  };

  static printMetaTags = (
    _type: unknown,
    { metatags }: PrintTypeOptions,
  ): MDXString | string => {
    if (!metatags || metatags.length < 1) {
      return "";
    }

    const meta = metatags.map((tag) => {
      const props = Object.entries(tag).map(([name, value]) => {
        return `${name}="${value}"`;
      });

      return `<meta ${props.join(" ")} />`;
    });

    return ["<head>", ...meta, "</head>"].join(MARKDOWN_EOL);
  };

  static printType = (
    name: Maybe<string>,
    type: unknown,
    options?: Maybe<Partial<PrintTypeOptions>>,
  ): Maybe<MDXString> => {
    const printTypeOptions: PrintTypeOptions = {
      ...DEFAULT_OPTIONS,
      ...Printer.options,
      ...options,
    };

    if (!name || !hasPrintableDirective(type, printTypeOptions)) {
      return undefined;
    }

    const header = Printer.printHeader(
      name,
      getTypeName(type),
      printTypeOptions,
    );
    const metatags = Printer.printMetaTags(type, printTypeOptions);
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
      metatags,
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
