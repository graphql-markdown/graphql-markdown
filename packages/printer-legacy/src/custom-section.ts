/**
 * Module providing directive-driven custom sections for type pages.
 *
 * A custom section is declared in `printTypeOptions.customSections`, reads one
 * schema directive, and renders its occurrences through a user callback. It is
 * a top-level section of the type page, placed relative to the built-in ones.
 *
 * @packageDocumentation
 */

import type {
  Maybe,
  PageSection,
  PageSections,
  PrintTypeOptions,
  SchemaEntity,
  TypeCustomSectionOption,
} from "@graphql-markdown/types";

import {
  getTypeDirectiveValuesList,
  GraphQLSchema,
  instanceOf,
  isDirectiveType,
  isEnumType,
  isInputType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "@graphql-markdown/graphql";

import { printExample } from "./example";

import { MARKDOWN_EOC, MARKDOWN_EOP, MARKDOWN_SOC } from "./const/strings";

/**
 * Resolves the values a section renders, replacing the default directive lookup.
 *
 * Used by the built-in sections, such as the example section, whose values do
 * not come from reading directive occurrences off the type.
 *
 * @internal
 */
export type SectionValuesResolver = (
  type: unknown,
  options: PrintTypeOptions,
) => Maybe<Record<string, unknown>[]>;

/**
 * A custom section, optionally resolving its own values.
 *
 * The `resolve` callback is internal: a section declared through
 * `printTypeOptions.customSections` always reads directive occurrences.
 *
 * @internal
 */
export type SectionDefinition = TypeCustomSectionOption & {
  resolve?: SectionValuesResolver;
};

/**
 * Section keys owned by the printer, which a custom section cannot claim.
 *
 * @internal
 */
export const RESERVED_SECTION_NAMES: readonly string[] = [
  "header",
  "metatags",
  "mdxDeclaration",
  "tags",
  "description",
  "code",
  "customDirectives",
  "metadata",
  "example",
  "relations",
] as const;

/**
 * Resolves the schema entity kind of the type being printed.
 *
 * The kind is taken from the print options when the caller knows it, as only
 * the caller can tell a query from a mutation. It falls back to the type guards
 * otherwise, which cover every kind but the operations.
 *
 * @internal
 *
 * @param type - the GraphQL type being printed.
 * @param options - the print options in effect.
 *
 * @returns the schema entity kind, or `undefined` when it cannot be determined.
 *
 */
export const getSchemaEntity = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<SchemaEntity> => {
  if (options.entity) {
    return options.entity;
  }

  switch (true) {
    case isDirectiveType(type):
      return "directives";
    case isEnumType(type):
      return "enums";
    case isInputType(type):
      return "inputs";
    case isInterfaceType(type):
      return "interfaces";
    case isObjectType(type):
      return "objects";
    case isScalarType(type):
      return "scalars";
    case isUnionType(type):
      return "unions";
    default:
      return undefined;
  }
};

/**
 * Checks a custom section against its `appliesTo` filter.
 *
 * A section without `appliesTo` applies everywhere. A section with `appliesTo`
 * is skipped when the entity kind is unknown, as the narrowing cannot be honoured.
 *
 * @internal
 *
 * @param type - the GraphQL type being printed.
 * @param section - the custom section declaration.
 * @param options - the print options in effect.
 *
 * @returns `true` if the section applies to the type being printed.
 *
 */
const appliesToEntity = (
  type: unknown,
  section: TypeCustomSectionOption,
  options: PrintTypeOptions,
): boolean => {
  if (!Array.isArray(section.appliesTo) || section.appliesTo.length === 0) {
    return true;
  }

  const entity = getSchemaEntity(type, options);

  return !!entity && section.appliesTo.includes(entity);
};

/**
 * Builds the example section as a custom section definition.
 *
 * The example section is a specialized custom section: it is driven by a schema
 * directive, named by [`printTypeOptions.exampleSection`](https://graphql-markdown.dev/docs/settings#printtypeoptions),
 * and rendered as a code block.
 *
 * It resolves its own value rather than reading directive occurrences, because
 * an example is also derived from the fields of a type carrying no example
 * directive itself. The `directive` name is therefore descriptive only: the
 * schema lookup belongs to {@link printExample}.
 *
 * @param options - the print options in effect.
 *
 * @returns the example section definition.
 *
 * @example
 * ```ts
 * const section = getExampleSectionDefinition(options);
 * const example = printCustomSection(type, section, options);
 * ```
 *
 */
export const getExampleSectionDefinition = (
  options: PrintTypeOptions,
): SectionDefinition => {
  const { exampleSection } = options;
  // Matches `getDirectiveExampleOption`: an empty directive name falls back too.
  const directive =
    exampleSection &&
    typeof exampleSection === "object" &&
    exampleSection.directive
      ? exampleSection.directive
      : "example";

  return {
    name: "example",
    title: "Example",
    directive,
    resolve: (
      type: unknown,
      printOptions: PrintTypeOptions,
    ): Record<string, unknown>[] => {
      const example = printExample(type, printOptions);
      return example ? [{ example }] : [];
    },
    render: (values: Record<string, unknown>[]): string => {
      return `${MARKDOWN_SOC}${values[0]!.example as string}${MARKDOWN_EOC}`;
    },
  };
};

/**
 * Reads every occurrence of a section's directive on a type.
 *
 * @internal
 *
 * @param type - the GraphQL type being printed.
 * @param section - the section declaration.
 * @param options - the print options in effect.
 *
 * @returns one record of arguments per occurrence, empty when the directive is
 * absent from the schema or from the type.
 *
 */
const getDirectiveValues = (
  type: unknown,
  section: SectionDefinition,
  options: PrintTypeOptions,
): Record<string, unknown>[] => {
  const schema = options.schema;
  const directive =
    schema && instanceOf(schema, GraphQLSchema as never)
      ? schema.getDirective(section.directive)
      : undefined;

  if (!directive) {
    return [];
  }

  return getTypeDirectiveValuesList(directive, type);
};

/**
 * Prints a single custom section for a type.
 *
 * The section is skipped, returning `undefined`, when its `appliesTo` filter
 * excludes the type, no value is resolved for it, or the render callback returns
 * no content.
 *
 * Reserved names are filtered by `getDeclaredSections`, not here: the built-in
 * sections are themselves declared with a reserved name.
 *
 * @param type - the GraphQL type being printed.
 * @param section - the custom section declaration.
 * @param options - the print options in effect.
 *
 * @returns the rendered page section, or `undefined` when nothing to print.
 *
 */
export const printCustomSection = (
  type: unknown,
  section: SectionDefinition,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  if (
    typeof section.render !== "function" ||
    !appliesToEntity(type, section, options)
  ) {
    return undefined;
  }

  const values = section.resolve
    ? section.resolve(type, options)
    : getDirectiveValues(type, section, options);

  if (!Array.isArray(values) || values.length === 0) {
    return undefined;
  }

  const content = section.render(values, options);

  if (typeof content !== "string" || content.trim().length === 0) {
    return undefined;
  }

  return {
    title: section.title ?? undefined,
    // The render callback owns its Markdown: trimming here would alter content
    // whose leading whitespace is significant, such as an indented code block.
    content: `${content}${MARKDOWN_EOP}`,
    level: section.level ?? 3,
  };
};

/**
 * Returns the custom sections to build, in declaration order.
 *
 * Sections claiming a reserved name are dropped, and a name is kept only once:
 * the printer is reachable directly through its public API, bypassing the
 * configuration validation, and a repeated name would otherwise render the same
 * section twice on the page.
 *
 * @internal
 *
 * @param options - the print options in effect.
 *
 * @returns the custom sections to build, empty when none is declared.
 *
 */
const getDeclaredSections = (
  options: PrintTypeOptions,
): TypeCustomSectionOption[] => {
  if (!Array.isArray(options.customSections)) {
    return [];
  }

  const names = new Set<string>();

  return options.customSections.filter((section): boolean => {
    if (
      RESERVED_SECTION_NAMES.includes(section.name) ||
      names.has(section.name)
    ) {
      return false;
    }
    names.add(section.name);
    return true;
  });
};

/**
 * Prints every custom section declared in the print options.
 *
 * Every declared section yields an entry, so that composition hooks can restore
 * a section which rendered no content. Sections with a reserved or repeated name
 * are dropped.
 *
 * @param type - the GraphQL type being printed.
 * @param options - the print options in effect.
 *
 * @returns a map of section name to rendered section, empty when none is declared.
 *
 */
export const printCustomSections = (
  type: unknown,
  options: PrintTypeOptions,
): PageSections => {
  // Null-prototype map: a section named `__proto__` would otherwise reach the
  // prototype setter of an object literal and never become an own property.
  // Configuration rejects that name, but the printer is also reachable directly.
  const sections = Object.create(null) as PageSections;

  getDeclaredSections(options).forEach((section): void => {
    sections[section.name] = printCustomSection(type, section, options);
  });

  return sections;
};

/**
 * Splices the custom sections into the built-in section order.
 *
 * A section is placed after or before the section named by its `position`, and
 * appended last when `position` is absent or names an unknown section. Sections
 * are placed in declaration order, so a section may target a previously placed one.
 * A repeated name is placed once, at its first declaration.
 *
 * @param sectionOrder - the built-in section order.
 * @param options - the print options in effect.
 *
 * @returns the section order including the custom sections.
 *
 */
export const getCustomSectionsOrder = (
  sectionOrder: readonly string[],
  options: PrintTypeOptions,
): string[] => {
  return getDeclaredSections(options).reduce(
    (order: string[], section: TypeCustomSectionOption): string[] => {
      const position = section.position;
      const anchor =
        position && typeof position === "object"
          ? (position.after ?? position.before)
          : undefined;
      const index = anchor ? order.indexOf(anchor) : -1;

      if (index === -1) {
        order.push(section.name);
        return order;
      }

      order.splice(position?.after ? index + 1 : index, 0, section.name);
      return order;
    },
    [...sectionOrder],
  );
};
