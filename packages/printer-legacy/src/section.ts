/**
 * Module responsible for generating Markdown sections for GraphQL schema documentation.
 * Handles the printing of section items, metadata, and structured documentation content.
 * @module section
 */

import type {
  GraphQLArgument,
  MDXString,
  PrintTypeOptions,
  SectionLevelValue,
} from "@graphql-markdown/types";

import { isGraphQLFieldType, isDeprecated } from "@graphql-markdown/graphql";

import { printDescription } from "./common";
import { printBadges } from "./badge";
import { hasPrintableDirective, printLink, printParentLink } from "./link";
import { printCustomTags } from "./directive";

import { DEPRECATED, MARKDOWN_EOL, MARKDOWN_EOP } from "./const/strings";
import { SectionLevels } from "./const/options";

/**
 * Prints a single section item with its associated metadata.
 *
 * @param type - The GraphQL type or field to print
 * @param options - Configuration options for printing
 * @returns Formatted MDX string containing the section item
 *
 * @template T - Type of the GraphQL element being printed
 */
export const printSectionItem = <T>(
  type: T,
  options: PrintTypeOptions,
): MDXString | string => {
  const level =
    "level" in options && typeof options.level === "number" ? options.level : 4;

  if (!hasPrintableDirective(type, options)) {
    return "";
  }

  const typeNameLink = printLink(type, {
    ...options,
    withAttributes: false,
  });

  const badges = printBadges(type, options);
  const tags = printCustomTags(type, options);
  const parentTypeLink = printParentLink(type, options);
  const title = `${SectionLevels.LEVEL.repeat(level)} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}`;

  const description = printDescription(type, options, "")
    .trim()
    .replaceAll("\n", `${MARKDOWN_EOL}`);

  let section = `${title}${description}${MARKDOWN_EOL}`;
  if (isGraphQLFieldType(type)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    section += printSectionItems(type.args as GraphQLArgument[], {
      ...options,
      level: 5 as SectionLevelValue,
      parentType:
        typeof options.parentType === "undefined"
          ? type.name
          : `${options.parentType}.${type.name}`,
    });
  }

  return section as MDXString;
};

/**
 * Prints an array of section items with consistent formatting.
 *
 * @param values - Single value or array of values to print as section items
 * @param options - Configuration options for printing
 * @returns Formatted MDX string containing all section items
 *
 * @template V - Type of the values being printed
 */
export const printSectionItems = <V>(
  values: V | V[],
  options: PrintTypeOptions,
): MDXString | string => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level = (
    "level" in options && typeof options.level === "number" ? options.level : 4
  ) as SectionLevelValue;

  return values
    .map((v: V): MDXString => {
      return (
        v &&
        (printSectionItem(v, {
          ...options,
          level,
        }) as MDXString)
      );
    })
    .join(MARKDOWN_EOP) as MDXString;
};

/**
 * Prints a complete section with title and content.
 *
 * @param values - Array of values to include in the section
 * @param section - Section title/header
 * @param options - Configuration options for printing
 * @returns Formatted MDX string containing the complete section
 *
 * @template V - Type of the values being printed
 */
export const printSection = <V>(
  values: V[] | readonly V[],
  section: string,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const level = (
    "level" in options && typeof options.level === "number" ? options.level : 3
  ) as SectionLevelValue;

  const [openSection, closeSection] = ((): MDXString[] | string[] => {
    if (
      typeof options.collapsible?.dataOpen === "string" &&
      typeof options.collapsible.dataClose === "string"
    ) {
      return options.formatMDXDetails!(options.collapsible).split(
        `\r`,
      ) as MDXString[];
    }
    return [MARKDOWN_EOP, MARKDOWN_EOP];
  })();

  const items = printSectionItems(values, {
    ...options,
    collapsible: undefined, // do not propagate collapsible
    level:
      level >= 3 && level <= 5 ? ((level + 1) as SectionLevelValue) : undefined,
  });

  if (items === "") {
    return ""; // do not print section is no items printed
  }

  return `${SectionLevels.LEVEL.repeat(level)} ${section}${openSection}${items}${closeSection}` as MDXString;
};

/**
 * Prints a metadata section with special handling for deprecated items.
 *
 * @param type - The parent type containing the metadata
 * @param values - Values to include in the metadata section
 * @param section - Section title/header
 * @param options - Configuration options for printing
 * @returns Formatted MDX string containing the metadata section
 *
 * @template T - Type of the parent element
 * @template V - Type of the values being printed
 */
export const printMetadataSection = <T, V>(
  type: T,
  values: V | V[] | readonly V[],
  section: string,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("name" in type) ||
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return "";
  }

  switch (options.deprecated) {
    case "group": {
      const { fields, deprecated } = values.reduce(
        (res, arg) => {
          if (isDeprecated(arg)) {
            res.deprecated.push(arg);
          } else {
            res.fields.push(arg);
          }
          return res;
        },
        { fields: [] as V[], deprecated: [] as V[] },
      );

      const meta = printSection(fields, section, {
        ...options,
        parentType: type.name as string,
      });
      const deprecatedMeta = printSection(deprecated, "", {
        ...options,
        parentType: type.name as string,
        level: 0 as SectionLevelValue,
        collapsible: {
          dataOpen: DEPRECATED,
          dataClose: DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}`;
    }

    case "default":
    default:
      return printSection(values, section, {
        ...options,
        parentType: type.name as string,
      });
  }
};
