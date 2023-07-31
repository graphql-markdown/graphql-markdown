import { GraphQLNamedType, GraphQLSchema } from "graphql";

import {
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfReturn,
  isOperation,
} from "@graphql-markdown/utils";

import { Link } from "./link";
import { DEFAULT_CSS_CLASSNAME, printBadge } from "./badge";
import {
  HEADER_SECTION_LEVEL,
  MARKDOWN_EOP,
  ROOT_TYPE_LOCALE,
  RootTypeName,
  TypeLocale,
} from "./const/strings";
import { Options } from "./const/options";
import { MDXString } from "./const/mdx";

export type IGetRelation = (type: GraphQLNamedType, schema: GraphQLSchema) => Record<string, GraphQLNamedType[]> | undefined;

export const getRootTypeLocaleFromString = (text: string): TypeLocale | undefined => {
  for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
    if (Object.values(props).includes(text)) {
      return ROOT_TYPE_LOCALE[type as RootTypeName];
    }
  }
  return undefined;
};

export const printRelationOf = (type: GraphQLNamedType, section: unknown, getRelation: IGetRelation, options: Options): string | MDXString => {
  if (
    isOperation(type) || typeof options.schema === "undefined"
  ) {
    return "";
  }

  const relations = getRelation(type, options.schema);

  if (typeof relations === "undefined") {
    return "";
  }

  let data: string[] = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation)!;
    const badge = printBadge({
      text: category.singular,
      classname: DEFAULT_CSS_CLASSNAME,
    });
    data = data.concat(
      types.map((t) => {
        const link = Link.getRelationLink(category, t, options);
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

  return `${HEADER_SECTION_LEVEL} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}` as MDXString;
};

export const printRelations = (type: GraphQLNamedType, options: Options): string | MDXString => {
  const relations = {
    "Returned by": getRelationOfReturn,
    "Member of": getRelationOfField,
    "Implemented by": getRelationOfImplementation,
  };

  let data = "";
  for (const [section, getRelation] of Object.entries(relations)) {
    data += printRelationOf(type, section, getRelation, options);
  }

  return data as MDXString;
};
