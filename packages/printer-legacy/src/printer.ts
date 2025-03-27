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
 *
 * @example
 */
export class Printer implements IPrinter {
  static options: Readonly<Maybe<PrintTypeOptions>>;

  static readonly printDescription = printDescription;

  static readonly printCustomDirectives = printCustomDirectives;

  static readonly printCustomTags = printCustomTags;

  static printMDXModule: Readonly<MDXSupportType>;

  /**
   *
   * @example
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

  static readonly printRelations = (
    type: unknown,
    options: PrintTypeOptions,
  ): MDXString | string => {
    if (options.relatedTypeSection !== true) {
      return "";
    }
    return printRelations(type, options);
  };

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
