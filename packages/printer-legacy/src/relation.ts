/**
 * This module provides functionality to print relationships between GraphQL types,
 * including return types, member fields, and implementations, in a formatted MDX string output.
 * @module
 */

import type {
  IGetRelation,
  MDXString,
  Maybe,
  PrintTypeOptions,
  RelationOf,
  RootTypeName,
  TypeLocale,
} from "@graphql-markdown/types";

import {
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfReturn,
  getSchemaMap,
  isNamedType,
  isOperation,
} from "@graphql-markdown/graphql";

import { getRelationLink } from "./link";
import { CSS_BADGE_CLASSNAME, printBadge } from "./badge";
import { MARKDOWN_EOP, ROOT_TYPE_LOCALE } from "./const/strings";
import { SectionLevels } from "./const/options";

/**
 * Converts a string representation of a root type to its corresponding `TypeLocale`
 * @param text - The string to convert to a `TypeLocale`
 * @returns The matching `TypeLocale` if found, `undefined` otherwise
 * @example
 * ```ts
 * const locale = getRootTypeLocaleFromString('Query');
 * ```
 */
export const getRootTypeLocaleFromString = (
  text: string,
): Maybe<TypeLocale> => {
  for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
    if (Object.values(props).includes(text)) {
      return ROOT_TYPE_LOCALE[type as RootTypeName];
    }
  }
  return undefined;
};

/**
 * Prints the relation section for a specific type and relation category
 * @template T - Type of the relation
 * @param type - The GraphQL type to get relations for
 * @param section - The section title for the relation
 * @param getRelation - Function to retrieve relations of type T
 * @param options - Printing options for type formatting
 * @returns Formatted MDX string containing the relations or empty string if no relations found
 * @throws If the schema is not provided in options
 * @example
 * ```ts
 * const mdx = printRelationOf(type, "Member Of", getRelationOfField, options);
 * ```
 */
export const printRelationOf = <T>(
  type: unknown,
  section: unknown,
  getRelation: Maybe<IGetRelation<T>>,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    !isNamedType(type) ||
    isOperation(type) ||
    !options.schema ||
    typeof getRelation !== "function"
  ) {
    return "";
  }

  const schemaMap = getSchemaMap(options.schema);

  const relations = getRelation(type, schemaMap) as Maybe<IGetRelation<T>>;

  if (!relations) {
    return "";
  }

  const data: string[] = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation)!;
    const badge = printBadge(
      {
        text: category,
        classname: CSS_BADGE_CLASSNAME.RELATION,
      },
      options,
    );
    data.push(
      ...types.map((t: unknown): string => {
        const link = getRelationLink(category, t, options);
        return link ? `[\`${link.text}\`](${link.url})  ${badge}` : "";
      }),
    );
  }

  if (data.length === 0) {
    return "";
  }

  const content = data
    .toSorted((a, b) => {
      return a.localeCompare(b);
    })
    .join(options.formatMDXBullet!()) as MDXString;

  return `${SectionLevels.LEVEL.repeat(3)} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}` as MDXString;
};

/**
 * Prints all relations (return types, member fields, and implementations) for a given type
 * @param type - The GraphQL type to get all relations for
 * @param options - Printing options for type formatting
 * @returns Formatted MDX string containing all relations or empty string if no relations found
 * @throws If the schema is not provided in options
 * @example
 * ```ts
 * const relations = printRelations(myType, { schema, formatMDXBullet: () => "* " });
 * ```
 */
export const printRelations = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const relations: Record<string, RelationOf<unknown>> = {
    returnedBy: { section: "Returned By", getRelation: getRelationOfReturn },
    memberOf: { section: "Member Of", getRelation: getRelationOfField },
    implementedBy: {
      section: "Implemented By",
      getRelation: getRelationOfImplementation,
    },
  };

  const relationResults = Object.values(relations).map(
    ({ section, getRelation }) => {
      return printRelationOf(type, section, getRelation, options);
    },
  );
  return relationResults.join("") as MDXString;
};
