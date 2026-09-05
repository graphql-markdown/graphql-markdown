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

import { MARKDOWN_EOP } from "./const/strings";

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
 * Prints a single custom section for a type.
 *
 * The section is skipped, returning `undefined`, when its name is reserved, its
 * `appliesTo` filter excludes the type, the directive is absent from the schema
 * or from the type, or the render callback returns no content.
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
  section: TypeCustomSectionOption,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  if (
    RESERVED_SECTION_NAMES.includes(section.name) ||
    typeof section.render !== "function" ||
    !appliesToEntity(type, section, options)
  ) {
    return undefined;
  }

  const schema = options.schema;
  const directive =
    schema && instanceOf(schema, GraphQLSchema as never)
      ? schema.getDirective(section.directive)
      : undefined;

  if (!directive) {
    return undefined;
  }

  const values = getTypeDirectiveValuesList(directive, type);

  if (values.length === 0) {
    return undefined;
  }

  const content = section.render(values, options);

  if (typeof content !== "string" || content.trim().length === 0) {
    return undefined;
  }

  return {
    title: section.title ?? undefined,
    content: `${content.trim()}${MARKDOWN_EOP}`,
    level: section.level ?? 3,
  };
};

/**
 * Prints every custom section declared in the print options.
 *
 * Every declared section yields an entry, so that composition hooks can restore
 * a section which rendered no content. Sections with a reserved name are dropped.
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
  if (!Array.isArray(options.customSections)) {
    return {};
  }

  const sections: PageSections = {};

  options.customSections
    .filter((section): boolean => {
      return !RESERVED_SECTION_NAMES.includes(section.name);
    })
    .forEach((section): void => {
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
  if (!Array.isArray(options.customSections)) {
    return [...sectionOrder];
  }

  return options.customSections
    .filter((section): boolean => {
      return !RESERVED_SECTION_NAMES.includes(section.name);
    })
    .reduce(
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
