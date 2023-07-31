import { GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType } from "graphql";

import {
  getTypeName,
  getFields,
} from "@graphql-markdown/utils";

import { printSection, printMetadataSection } from "../section";
import { printCodeField } from "../code";
import { MARKDOWN_EOL, MARKDOWN_CODE_INDENTATION } from "../const/strings";
import { Options } from "../const/options";

export const printInterfaceMetadata = (type: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType, options: Options): string => {
  if ("getInterfaces" in type === false) {
    return "";
  }

  return printSection(type.getInterfaces() as GraphQLInterfaceType[], "Interfaces", options);
};

export const printObjectMetadata = (type: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType, options: Options): string => {
  const interfaceMeta = printInterfaceMetadata(type, options);
  const metadata = printMetadataSection(
    type,
    getFields(type),
    "Fields",
    options
  );

  return `${metadata}${interfaceMeta}`;
};

export const printCodeType = (type: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType, entity: string, options: Options): string => {
  const name = getTypeName(type);
  const extendsInterface =
    "getInterfaces" in type && type.getInterfaces().length > 0
      ? ` implements ${type
          .getInterfaces()
          .map((field) => getTypeName(field))
          .join(", ")}`
      : "";
  const typeFields = getFields(type)
    .map((field) => {
      const f = printCodeField(field, options, 1);
      return f.length > 0 ? `${MARKDOWN_CODE_INDENTATION}${f}` : "";
    })
    .filter((field) => field.length > 0)
    .join("");

  return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
};

export const printCodeObject = (type: GraphQLObjectType | GraphQLInterfaceType, options: Options) => printCodeType(type, "type", options);
