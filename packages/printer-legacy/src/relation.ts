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

  let data: string[] = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation)!;
    const badge = printBadge(
      {
        text: category,
        classname: DEFAULT_CSS_CLASSNAME,
      },
      options,
    );
    data = data.concat(
      types.map((t: unknown): string => {
        const link = getRelationLink(category, t, options);
        return link ? `[\`${link.text}\`](${link.url})  ${badge}` : "";
      }),
    );
  }

  if (data.length === 0) {
    return "";
  }

  const content = [...data]
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .join(options.formatMDXBullet!()) as MDXString;

  return `${SectionLevels.LEVEL_3} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}` as MDXString;
};

export const printRelations = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const relations: Record<string, RelationOf> = {
    returnedBy: { section: "Returned By", getRelation: getRelationOfReturn },
    memberOf: { section: "Member Of", getRelation: getRelationOfField },
    implementedBy: {
      section: "Implemented By",
      getRelation: getRelationOfImplementation,
    },
  };

  let data = "";
  for (const { section, getRelation } of Object.values(relations)) {
    data += printRelationOf(type, section, getRelation, options);
  }

  return data as MDXString;
};
