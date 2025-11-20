/**
 * GraphQL Schema Printer Module
 *
 * This module provides functionality for printing GraphQL schema types into Markdown documentation.
 * It includes utilities for handling various GraphQL types, custom directives, and formatting options.
 *
 * @module printer
 * @packageDocumentation
 */

import type {
  CustomDirectiveMap,
  GraphQLDirective,
  GraphQLField,
  GraphQLSchema,
  IPrinter,
  MDXString,
  MDXSupportType,
  Maybe,
  MetaOptions,
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
import { printDescription } from "./common";
import { printCustomDirectives, printCustomTags } from "./directive";
import { printFrontMatter } from "./frontmatter";
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
import { hasPrintableDirective } from "./link";

import {
  MARKDOWN_EOC,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
} from "./const/strings";
import { mdxModule } from "./mdx";
import {
  DEFAULT_OPTIONS,
  PRINT_TYPE_DEFAULT_OPTIONS,
  SectionLevels,
} from "./const/options";
import { printExample } from "./example";

/**
 * The Printer class implements the core functionality for generating Markdown documentation
 * from GraphQL schema types.
 *
 * @remarks
 * This class provides static methods for rendering different components of the documentation:
 * - Headers and frontmatter
 * - Type descriptions and code blocks
 * - Custom directives and metadata
 * - Examples and relations
 *
 * @example
 * ```typescript
 * const printer = new Printer();
 * await printer.init(schema, '/docs', 'graphql', options);
 * const docs = printer.printType('Query', queryType);
 * ```
 */
export class Printer implements IPrinter {
  /**
   * Global printer configuration options
   */
  static options: Readonly<Maybe<PrintTypeOptions>>;

  /**
   * Prints type descriptions
   */
  static readonly printDescription = printDescription;

  /**
   * Prints custom directives
   */
  static readonly printCustomDirectives = printCustomDirectives;

  /**
   * Prints custom tags
   */
  static readonly printCustomTags = printCustomTags;

  /**
   * MDX module configuration
   */
  static printMDXModule: Readonly<MDXSupportType>;

  /**
   * Initializes the printer with the given schema and configuration.
   *
   * @param schema - GraphQL schema to generate documentation for
   * @param baseURL - Base URL path for documentation, e.g. '/docs'
   * @param linkRoot - Root path for generating links between types
   * @param options - Configuration options for the printer
   * @param mdxParser - Optional MDX parser module for MDX output support
   */
  static async init(
    schema: Maybe<GraphQLSchema>,
    baseURL: Maybe<string> = "schema",
    linkRoot: Maybe<string> = "/",
    {
      customDirectives,
      groups,
      meta,
      metatags,
      onlyDocDirectives,
      printTypeOptions,
      skipDocDirectives,
    }: {
      customDirectives?: CustomDirectiveMap;
      deprecated?: TypeDeprecatedOption;
      groups?: SchemaEntitiesGroupMap;
      meta?: Maybe<MetaOptions>;
      metatags?: Record<string, string>[];
      onlyDocDirectives?: GraphQLDirective[];
      printTypeOptions?: PrinterConfigPrintTypeOptions;
      skipDocDirectives?: GraphQLDirective[];
    } = {
      customDirectives: undefined,
      groups: undefined,
    },
    mdxParser?: Record<string, unknown>,
  ): Promise<void> {
    if (typeof Printer.options !== "undefined") {
      return;
    }

    Printer.options = {
      ...DEFAULT_OPTIONS,
      basePath: pathUrl.join(linkRoot ?? "", baseURL ?? ""),
      codeSection:
        printTypeOptions?.codeSection ?? PRINT_TYPE_DEFAULT_OPTIONS.codeSection,
      customDirectives,
      exampleSection:
        printTypeOptions?.exampleSection ??
        PRINT_TYPE_DEFAULT_OPTIONS.exampleSection,
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
      hierarchy:
        printTypeOptions?.hierarchy ?? PRINT_TYPE_DEFAULT_OPTIONS.hierarchy,
      meta: meta,
    };

    Printer.printMDXModule = await mdxModule(mdxParser);
  }

  /**
   * Prints the header section of a type documentation
   *
   * @param id - Unique identifier for the type
   * @param title - Display title for the type
   * @param options - Printer configuration options
   * @returns Formatted header string with optional frontmatter
   */
  static readonly printHeader = (
    id: string,
    title: string,
    options: PrintTypeOptions,
  ): string => {
    if (options.frontMatter === false) {
      return `# ${title}${MARKDOWN_EOP}`;
    }

    const fmOptions = options.frontMatter ?? DEFAULT_OPTIONS.frontMatter;

    return printFrontMatter(title, { ...fmOptions, id }, options);
  };

  /**
   * Prints the GraphQL type definition as code block
   *
   * @param type - GraphQL type to print
   * @param options - Printer configuration options
   * @returns Formatted code block string with type definition
   */
  static readonly printCode = (
    type: unknown,
    options: PrintTypeOptions,
  ): string => {
    let code = "";

    if (
      typeof options.codeSection === "undefined" ||
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
      case isUnionType(type):
        code += printCodeUnion(type, options);
        break;
      case isInterfaceType(type):
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

  /**
   * Prints example usage of the type if available
   *
   * @param type - GraphQL type to generate example for
   * @param options - Printer configuration options
   * @returns Formatted example section string or empty string if no example
   */
  static readonly printExample = (
    type: unknown,
    options: PrintTypeOptions,
  ): string => {
    if (
      typeof options.exampleSection === "undefined" ||
      options.exampleSection === null ||
      options.exampleSection === false
    ) {
      return "";
    }

    const example = printExample(type, options);

    if (!example) {
      return "";
    }

    return `${SectionLevels.LEVEL.repeat(3)} Example${MARKDOWN_EOP}${MARKDOWN_SOC}${example}${MARKDOWN_EOC}${MARKDOWN_EOP}`;
  };

  /**
   * Prints metadata information for a GraphQL type
   *
   * @param type - GraphQL type to print metadata for
   * @param options - Printer configuration options
   * @returns Formatted metadata string as MDX or plain string
   * @throws When type is not supported
   */
  static readonly printTypeMetadata = (
    type: unknown,
    options: PrintTypeOptions,
  ): MDXString | string => {
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
        return printOperationMetadata(
          type as unknown as GraphQLField<unknown, unknown, unknown>,
          options,
        );
      default:
        return "";
    }
  };

  /**
   * Prints related type information
   *
   * @param type - GraphQL type to find relations for
   * @param options - Printer configuration options
   * @returns Formatted relations section as MDX or plain string
   */
  static readonly printRelations = (
    type: unknown,
    options: PrintTypeOptions,
  ): MDXString | string => {
    if (options.relatedTypeSection !== true) {
      return "";
    }
    return printRelations(type, options);
  };

  /**
   * Prints HTML meta tags for the documentation
   *
   * @param _type - GraphQL type (unused)
   * @param options - Printer configuration options containing metatags
   * @returns Formatted HTML meta tags string
   */
  static readonly printMetaTags = (
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

  /**
   * Main method to print complete documentation for a GraphQL type
   *
   * @param name - Name identifier for the type
   * @param type - GraphQL type to generate documentation for
   * @param options - Optional printer configuration options
   * @returns Complete documentation as MDX string or undefined if type should be skipped
   *
   * @example
   * ```typescript
   * const doc = Printer.printType('User', UserType, {
   *   frontMatter: true,
   *   codeSection: true
   * });
   * ```
   *
   * @remarks
   * The method combines multiple sections:
   * - Header with frontmatter
   * - Meta tags
   * - Description
   * - Code definition
   * - Custom directives
   * - Type metadata
   * - Example usage
   * - Related types
   */
  static readonly printType = (
    name: Maybe<string>,
    type: unknown,
    options?: Maybe<Partial<PrintTypeOptions>>,
  ): Maybe<MDXString> => {
    const printTypeOptions: PrintTypeOptions = {
      ...DEFAULT_OPTIONS,
      ...Printer.options,
      ...options,
      ...Printer.printMDXModule,
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
    const example = Printer.printExample(type, printTypeOptions);

    return [
      header,
      metatags,
      Printer.printMDXModule.mdxDeclaration,
      tags,
      description,
      code,
      customDirectives,
      metadata,
      example,
      relations,
    ]
      .join(MARKDOWN_EOP)
      .trim() as MDXString;
  };
}
