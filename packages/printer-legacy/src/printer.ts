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
  DeprecatedPrintTypeOptions,
  Formatter,
  GraphQLDirective,
  GraphQLField,
  GraphQLSchema,
  IPrinter,
  Maybe,
  MDXString,
  MetaInfo,
  PageHeader,
  PageSection,
  PageSections,
  PrinterConfigPrintTypeOptions,
  PrinterEventEmitter,
  PrintTypeOptions,
  SchemaEntitiesGroupMap,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

/**
 * Print type event constants.
 * Duplicated here to avoid circular dependency with \@graphql-markdown/core.
 * These must match the values in core/src/events/print-type-events.ts
 */
const PrintTypeEvents = {
  BEFORE_PRINT_CODE: "print:beforePrintCode",
  AFTER_PRINT_CODE: "print:afterPrintCode",
  BEFORE_PRINT_TYPE: "print:beforePrintType",
  AFTER_PRINT_TYPE: "print:afterPrintType",
  BEFORE_COMPOSE_PAGE_TYPE: "print:beforeComposePageType",
} as const;

const TYPE_PAGE_HEADER_ORDER = [
  "header",
  "metatags",
  "mdxDeclaration",
] as const;

const TYPE_PAGE_SECTION_ORDER = [
  "tags",
  "description",
  "code",
  "customDirectives",
  "metadata",
  "example",
  "relations",
] as const;

type TypePageContentSection = (typeof TYPE_PAGE_SECTION_ORDER)[number];

type TypePageHeaderSection = (typeof TYPE_PAGE_HEADER_ORDER)[number];

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
import { createDefaultFormatter } from "./formatter";
import {
  DEFAULT_OPTIONS,
  PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS,
  PRINT_TYPE_DEFAULT_OPTIONS,
  SectionLevels,
} from "./const/options";
import { printExample } from "./example";
import {
  PrintCodeEvent,
  PrintTypeEvent,
  BeforeComposePageTypeEvent,
} from "./events";

/**
 * Default initialization options for the Printer class.
 * @internal
 */
const DEFAULT_INIT_OPTIONS = {
  customDirectives: undefined,
  groups: undefined,
  sectionHeaderId: true,
};

type InitPrintTypeOptions = DeprecatedPrintTypeOptions &
  Omit<PrinterConfigPrintTypeOptions, "exampleSection"> & {
    exampleSection?:
      | DeprecatedPrintTypeOptions["exampleSection"]
      | PrinterConfigPrintTypeOptions["exampleSection"];
  };

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

  private static _eventEmitter: Maybe<PrinterEventEmitter>;

  private static _options: Readonly<Maybe<PrintTypeOptions>>;

  private static _deprecatedOptions: Readonly<
    Maybe<DeprecatedPrintTypeOptions>
  >;

  private static _mdxDeclaration: Readonly<Maybe<string>>;

  /**
   * Global printer configuration options
   */
  static get options(): Readonly<Maybe<PrintTypeOptions>> {
    return Printer._options;
  }

  /**
   * Backward-compat section toggles extracted from legacy config options.
   *
   * These flags are applied only during section order composition.
   */
  static get deprecatedOptions(): Readonly<Maybe<DeprecatedPrintTypeOptions>> {
    return Printer._deprecatedOptions;
  }

  /**
   * Optional event emitter for print events.
   * When set, the printer will emit events before/after printCode and printType,
   * allowing external code to intercept and modify the output.
   */
  static get eventEmitter(): Maybe<PrinterEventEmitter> {
    return Printer._eventEmitter;
  }

  /**
   * Prints mdx modules import declaration
   */
  static get mdxDeclaration(): Readonly<Maybe<string>> {
    return Printer._mdxDeclaration;
  }

  static set options(options: Readonly<Maybe<PrintTypeOptions>>) {
    Printer._options = options;
  }

  static set eventEmitter(eventEmitter: Maybe<PrinterEventEmitter>) {
    Printer._eventEmitter = eventEmitter;
  }

  static set mdxDeclaration(mdxDeclaration: Readonly<Maybe<string>>) {
    Printer._mdxDeclaration = mdxDeclaration;
  }

  /**
   * Initializes the printer with the given schema and configuration.
   *
   * @param schema - GraphQL schema to generate documentation for
   * @param baseURL - Base URL path for documentation, e.g. '/docs'
   * @param linkRoot - Root path for generating links between types
   * @param options - Configuration options for the printer
   * @param formatter - Optional formatter functions for customizing output format
   * @param mdxDeclaration - Optional MDX import declaration
   * @param eventEmitter - Optional event emitter for print events interception
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
      sectionHeaderId,
      suppressGenerator,
    }: {
      customDirectives?: CustomDirectiveMap;
      deprecated?: TypeDeprecatedOption;
      groups?: SchemaEntitiesGroupMap;
      meta?: Maybe<MetaInfo>;
      metatags?: Record<string, string>[];
      onlyDocDirectives?: GraphQLDirective[];
      printTypeOptions?: InitPrintTypeOptions;
      skipDocDirectives?: GraphQLDirective[];
      sectionHeaderId?: boolean;
      suppressGenerator?: boolean;
    } = DEFAULT_INIT_OPTIONS,
    formatter?: Partial<Formatter>,
    mdxDeclaration?: Maybe<string>,
    eventEmitter?: Maybe<PrinterEventEmitter>,
  ): Promise<void> {
    // Always update eventEmitter regardless of initialization state
    Printer.eventEmitter = eventEmitter ?? null;

    if (Printer.options === undefined) {
      Printer.options = {
        ...DEFAULT_OPTIONS,
        basePath: pathUrl.join(linkRoot ?? "", baseURL ?? ""),
        customDirectives,
        exampleSection:
          typeof printTypeOptions?.exampleSection === "object"
            ? printTypeOptions.exampleSection
            : undefined,
        groups,
        parentTypePrefix:
          printTypeOptions?.parentTypePrefix ??
          PRINT_TYPE_DEFAULT_OPTIONS.parentTypePrefix,
        deprecated:
          printTypeOptions?.deprecated ?? PRINT_TYPE_DEFAULT_OPTIONS.deprecated,
        schema,
        onlyDocDirectives: onlyDocDirectives ?? [],
        skipDocDirectives: skipDocDirectives ?? [],
        sectionHeaderId: sectionHeaderId ?? DEFAULT_OPTIONS.sectionHeaderId,
        typeBadges:
          printTypeOptions?.typeBadges ?? PRINT_TYPE_DEFAULT_OPTIONS.typeBadges,
        metatags: metatags ?? [],
        suppressGenerator:
          suppressGenerator ?? DEFAULT_OPTIONS.suppressGenerator,
        hierarchy:
          printTypeOptions?.hierarchy ?? PRINT_TYPE_DEFAULT_OPTIONS.hierarchy,
        meta: meta,
        // Merge formatter functions: default formatter with any overrides
        ...createDefaultFormatter(),
        ...formatter,
      };

      const initExampleSection = printTypeOptions?.exampleSection;
      let deprecatedExampleSection: DeprecatedPrintTypeOptions["exampleSection"];

      if (typeof initExampleSection === "boolean") {
        deprecatedExampleSection = initExampleSection;
      } else if (initExampleSection === undefined) {
        deprecatedExampleSection =
          PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS.exampleSection;
      } else {
        deprecatedExampleSection = true;
      }

      Printer._deprecatedOptions = {
        codeSection:
          printTypeOptions?.codeSection ??
          PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS.codeSection,
        exampleSection: deprecatedExampleSection,
        relatedTypeSection:
          printTypeOptions?.relatedTypeSection ??
          PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS.relatedTypeSection,
      };

      Printer.mdxDeclaration = mdxDeclaration ?? "";
    }
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

    switch (true) {
      case isOperation(type):
        code = printCodeOperation(type, options);
        break;
      case isEnumType(type):
        code = printCodeEnum(type, options);
        break;
      case isUnionType(type):
        code = printCodeUnion(type, options);
        break;
      case isInterfaceType(type):
        code = printCodeInterface(type, options);
        break;
      case isObjectType(type):
        code = printCodeObject(type, options);
        break;
      case isInputType(type):
        code = printCodeInput(type, options);
        break;
      case isScalarType(type):
        code = printCodeScalar(type, options);
        break;
      case isDirectiveType(type):
        code = printCodeDirective(type, options);
        break;
      default:
        code = `"${getTypeName(type)}" not supported`;
    }

    return MARKDOWN_SOC + code.trim() + MARKDOWN_EOC;
  };

  /**
   * Prints the GraphQL type definition as code block with event emission support.
   *
   * @param type - GraphQL type to print
   * @param typeName - Name of the type being printed
   * @param options - Printer configuration options
   * @returns Promise resolving to formatted code block string with type definition
   *
   * @remarks
   * This async version emits events before and after code generation:
   * - `print:beforePrintCode` - Emitted before generating code (can modify inputs or prevent default)
   * - `print:afterPrintCode` - Emitted after generating code (can modify output)
   *
   * Event handlers can:
   * - Modify `event.data.options` in BEFORE to affect code generation
   * - Call `event.preventDefault()` in BEFORE to skip default generation and provide custom output
   * - Modify `event.output` in AFTER to change the final result
   */
  static readonly printCodeAsync = async (
    type: unknown,
    typeName: string,
    options: PrintTypeOptions,
  ): Promise<string> => {
    // If no event emitter, just run sync method
    if (!Printer.eventEmitter) {
      return Printer.printCode(type, options);
    }

    // Create mutable event data - handlers can modify options
    const eventData = { type, typeName, options: { ...options } };

    // Emit BEFORE event - handlers can modify inputs or prevent default
    const beforeEvent = new PrintCodeEvent(eventData, "");
    await Printer.eventEmitter.emitAsync(
      PrintTypeEvents.BEFORE_PRINT_CODE,
      beforeEvent,
    );

    // If prevented, handlers should have set the output they want
    if (beforeEvent.defaultPrevented) {
      return beforeEvent.output;
    }

    // Generate code using the (potentially modified) options from event data
    const output = Printer.printCode(type, eventData.options);

    // Emit AFTER event - handlers can modify the output
    const afterEvent = new PrintCodeEvent(eventData, output);
    await Printer.eventEmitter.emitAsync(
      PrintTypeEvents.AFTER_PRINT_CODE,
      afterEvent,
    );

    return afterEvent.output;
  };

  /**
   * Prints example usage of the type if available
   *
   * @param type - GraphQL type to generate example for
   * @param options - Printer configuration options
   * @returns Example page section or undefined when no example is available
   */
  static readonly printExample = (
    type: unknown,
    options: PrintTypeOptions,
  ): Maybe<PageSection> => {
    const example = printExample(type, options);

    if (!example) {
      return undefined;
    }

    return {
      content: `${MARKDOWN_SOC}${example}${MARKDOWN_EOC}${MARKDOWN_EOP}`,
      title: "Example",
    };
  };

  /**
   * Prints metadata information for a GraphQL type
   *
   * @param type - GraphQL type to print metadata for
   * @param options - Printer configuration options
   * @returns Metadata section (or section list) for supported types, otherwise undefined
   */
  static readonly printTypeMetadata = (
    type: unknown,
    options: PrintTypeOptions,
  ): Maybe<PageSection | PageSection[]> => {
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
        return undefined;
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
    return printRelations(type, options);
  };

  /**
   * Prints HTML meta tags for the documentation.
   *
   * Always injects a `<meta name="generator" content="graphql-markdown" />`
   * tag so that pages generated by graphql-markdown are discoverable by web
   * crawlers and tooling (analogous to the generator meta tag used by
   * WordPress, Gatsby, Docusaurus, etc.).  Any user-configured `metatags`
   * are appended after the generator tag.
   *
   * @param _type - GraphQL type (unused)
   * @param options - Printer configuration options containing metatags
   * @returns Formatted HTML meta tags string
   */
  static readonly printMetaTags = (
    _type: unknown,
    { metatags, suppressGenerator }: PrintTypeOptions,
  ): MDXString | string => {
    const generatorTag = suppressGenerator
      ? []
      : [`<meta name="generator" content="@graphql-markdown" />`];

    const userTags = (metatags ?? []).map((tag) => {
      const props = Object.entries(tag).map(([name, value]) => {
        return `${name}="${value}"`;
      });

      return `<meta ${props.join(" ")} />`;
    });

    const allTags = [...generatorTag, ...userTags];

    if (allTags.length === 0) {
      return "";
    }

    return ["<head>", ...allTags, "</head>"].join(MARKDOWN_EOL);
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
   * const doc = await Printer.printType('User', UserType, {
   *   frontMatter: true
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
   *
   * When an event emitter is configured, emits events:
   * - `print:beforePrintType` - Before generating documentation
   * - `print:beforeComposePageType` - Before composing section order and final page output
   * - `print:afterPrintType` - After generating documentation (output can be modified)
   */
  static readonly printType = async (
    name: Maybe<string>,
    type: unknown,
    options?: Maybe<Partial<PrintTypeOptions>>,
  ): Promise<Maybe<MDXString>> => {
    const printTypeOptions: PrintTypeOptions = {
      ...DEFAULT_OPTIONS,
      ...Printer.options,
      ...options,
    };

    const deprecatedOptions: DeprecatedPrintTypeOptions = {
      ...Printer.deprecatedOptions,
      exampleSection: printTypeOptions.exampleSection
        ? true
        : Printer.deprecatedOptions?.exampleSection,
    };

    if (!name || !hasPrintableDirective(type, printTypeOptions)) {
      return undefined;
    }

    // Create event data for potential before event
    const eventData = { type, name, options: printTypeOptions };

    // Emit BEFORE_PRINT_TYPE event if emitter is configured
    if (Printer.eventEmitter) {
      const beforeEvent = new PrintTypeEvent(eventData, undefined);
      await Printer.eventEmitter.emitAsync(
        PrintTypeEvents.BEFORE_PRINT_TYPE,
        beforeEvent,
      );

      // If prevented, return the output set by handlers (or undefined)
      if (beforeEvent.defaultPrevented) {
        return beforeEvent.output;
      }
    }

    const header = Printer.printHeader(
      name,
      getTypeName(type),
      printTypeOptions,
    );
    const metatags = Printer.printMetaTags(type, printTypeOptions);

    const description = Printer.printDescription(type, printTypeOptions);

    // Generate all sections unconditionally to support event hooks that might re-add
    // sections excluded by deprecated toggles. This is a performance trade-off:
    // sections excluded by deprecated flags (codeSection, exampleSection, relatedTypeSection)
    // are still generated and print events emitted, even if they won't be rendered.
    // TODO(perf): Implement lazy section generation based on final composed order
    // when no BEFORE_COMPOSE_PAGE_TYPE listeners are registered.
    const code = await Printer.printCodeAsync(type, name, printTypeOptions);

    const customDirectives = Printer.printCustomDirectives(
      type,
      printTypeOptions,
    );
    const tags = Printer.printCustomTags(type, printTypeOptions);
    const metadata = Printer.printTypeMetadata(type, printTypeOptions);
    const relations = Printer.printRelations(type, printTypeOptions);
    const example = Printer.printExample(type, printTypeOptions);

    // Create sections map for composition events
    const sections: PageSections = {
      header: { content: header } as PageHeader,
      metatags: { content: metatags } as PageHeader,
      mdxDeclaration: { content: Printer.mdxDeclaration ?? "" } as PageHeader,
      tags: Printer.normalizePageSection(tags),
      description: Printer.normalizePageSection(description),
      code: Printer.normalizePageSection(code),
      customDirectives: Printer.normalizePageSection(customDirectives),
      metadata: Printer.normalizePageSection(metadata),
      example: Printer.normalizePageSection(example),
      relations: Printer.normalizePageSection(relations),
    };

    let sectionOrder: (keyof PageSections)[] =
      Printer.getDeprecatedTypePageSectionOrder(
        [...TYPE_PAGE_SECTION_ORDER],
        deprecatedOptions,
      );

    // Emit BEFORE_COMPOSE_PAGE_TYPE event if emitter is configured
    if (Printer.eventEmitter) {
      const beforeComposeEvent = new BeforeComposePageTypeEvent(
        { type, name, options: printTypeOptions, sections },
        sectionOrder,
      );
      await Printer.eventEmitter.emitAsync(
        PrintTypeEvents.BEFORE_COMPOSE_PAGE_TYPE,
        beforeComposeEvent,
      );
      sectionOrder = Printer.sanitizeTypePageSectionOrder(
        beforeComposeEvent.output,
        sections,
      );
    }

    // Compose output based on section order
    const pageSections: (keyof PageSections)[] = [
      ...TYPE_PAGE_HEADER_ORDER,
      ...sectionOrder,
    ];
    let output = pageSections
      .map((key) => {
        return Printer.renderPageSection(sections[key]);
      })
      .filter((section) => {
        return section.length > 0;
      })
      .join(MARKDOWN_EOP)
      .trim() as MDXString;

    // Emit AFTER_PRINT_TYPE event if emitter is configured
    if (Printer.eventEmitter) {
      const afterEvent = new PrintTypeEvent(eventData, output);
      await Printer.eventEmitter.emitAsync(
        PrintTypeEvents.AFTER_PRINT_TYPE,
        afterEvent,
      );
      output = afterEvent.output ?? output;
    }

    return output;
  };

  /**
   * Renders a page section, optionally prefixing a heading when a title is present.
   */
  private static readonly renderPageSection = (
    section: Maybe<PageSections[keyof PageSections]>,
  ): string => {
    if (
      !section ||
      typeof section !== "object" ||
      Array.isArray(section) ||
      (!("content" in section) && !("title" in section))
    ) {
      return "";
    }

    let content: string;
    if (!("content" in section) || !section.content) {
      content = "";
    } else if (Array.isArray(section.content)) {
      content = section.content
        .map((entry) => {
          return Printer.renderPageSection(entry);
        })
        .filter((entry) => {
          return entry.length > 0;
        })
        .join(MARKDOWN_EOP);
    } else if (typeof section.content === "string") {
      content = section.content;
    } else {
      content = Printer.renderPageSection(section.content);
    }

    if (!("title" in section) || typeof section.title !== "string") {
      if (!content || content.trim().length === 0) {
        return "";
      }

      return content;
    }

    if (!section.title || section.title.trim().length === 0) {
      if (!content || content.trim().length === 0) {
        return "";
      }

      return content;
    }

    const level = Math.max(1, section.level ?? 3);
    const title = `${SectionLevels.LEVEL.repeat(level)} ${section.title}${MARKDOWN_EOP}`;

    if (!content || content.trim().length === 0) {
      return title;
    }

    return `${title}${content}`;
  };

  /**
   * Returns the default content section order for type pages.
   *
   * Applies backward-compatibility toggles from deprecated section flags.
   */
  private static readonly getDeprecatedTypePageSectionOrder = (
    sections: TypePageContentSection[],
    deprecatedOptions: DeprecatedPrintTypeOptions,
  ): TypePageContentSection[] => {
    return sections.filter((section) => {
      if (section === "code") {
        return deprecatedOptions.codeSection !== false;
      }

      if (section === "example") {
        return deprecatedOptions.exampleSection !== false;
      }

      if (section === "relations") {
        return deprecatedOptions.relatedTypeSection !== false;
      }

      return true;
    });
  };

  /**
   * Runtime guard for built-in page content section keys.
   */
  private static readonly isTypePageContentSection = (
    section: unknown,
  ): section is TypePageContentSection => {
    return (
      typeof section === "string" &&
      (TYPE_PAGE_SECTION_ORDER as readonly string[]).includes(section)
    );
  };

  /**
   * Runtime guard for header-only page section keys.
   */
  private static readonly isTypePageHeaderSection = (
    section: unknown,
  ): section is TypePageHeaderSection => {
    return (
      typeof section === "string" &&
      (TYPE_PAGE_HEADER_ORDER as readonly string[]).includes(section)
    );
  };

  /**
   * Normalizes event-driven section order, allowing built-in section keys and
   * any custom keys that were added to the sections map by an event handler.
   * Keys that are neither built-in nor present in the sections map are dropped.
   */
  private static readonly sanitizeTypePageSectionOrder = (
    sectionOrder: Maybe<(keyof PageSections)[]>,
    sections: PageSections,
  ): string[] => {
    if (!Array.isArray(sectionOrder)) {
      return [];
    }

    return sectionOrder.filter((section): section is string => {
      return (
        typeof section === "string" &&
        !Printer.isTypePageHeaderSection(section) &&
        (Printer.isTypePageContentSection(section) ||
          Object.hasOwn(sections, section))
      );
    });
  };

  /**
   * Normalizes mixed section value shapes to the internal PageSection format.
   */
  private static readonly normalizePageSection = (
    section: Maybe<unknown>,
  ): PageSection | undefined => {
    if (!section) {
      return undefined;
    }

    if (typeof section === "string" || Array.isArray(section)) {
      return { content: section } as PageSection;
    }

    return section;
  };
}
