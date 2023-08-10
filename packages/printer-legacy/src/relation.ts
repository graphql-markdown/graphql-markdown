import type {
  IGetRelation,
  MDXString,
  Maybe,
  PrintTypeOptions,
  RootTypeName,
  TypeLocale,
} from "@graphql-markdown/types";

import {
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfReturn,
  isNamedType,
  isOperation,
} from "@graphql-markdown/utils";

import { getRelationLink } from "./link";
import { DEFAULT_CSS_CLASSNAME, printBadge } from "./badge";
import { MARKDOWN_EOP, ROOT_TYPE_LOCALE } from "./const/strings";
import { SectionLevels } from "./const/options";

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

export const printRelationOf = <T>(
  type: unknown,
  section: unknown,
  getRelation: Maybe<IGetRelation<T>>,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    !isNamedType(type) ||
    isOperation(type) ||
    typeof options.schema === "undefined" ||
    typeof getRelation !== "function"
  ) {
    return "";
  }

  const relations = getRelation(type, options.schema);

  if (typeof relations === "undefined" || relations === null) {
    return "";
  }

  let data: string[] = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation)!;
    const badge = printBadge({
      text: typeof category === "string" ? category : category.singular,
      classname: DEFAULT_CSS_CLASSNAME,
    });
    data = data.concat(
      types.map((t: unknown) => {
        const link = getRelationLink(category, t, options);
        return link ? `[\`${link.text}\`](${link.url})  ${badge}` : "";
      }),
    );
  }

  if (data.length === 0) {
    return "";
  }

  const content = [...data]
    .sort((a, b) => a.localeCompare(b))
    .join("<Bullet />");

  return `${SectionLevels.LEVEL_3} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}` as MDXString;
};

export const printRelations = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const relations: Record<string, IGetRelation<unknown>> = {
    "Returned by": getRelationOfReturn,
    "Member of": getRelationOfField,
    "Implemented by": getRelationOfImplementation,
  };

  let data = "";
  for (const [section, getRelation] of Object.entries<IGetRelation<unknown>>(
    relations,
  )) {
    data += printRelationOf(type, section, getRelation, options);
  }

  return data as MDXString;
};
