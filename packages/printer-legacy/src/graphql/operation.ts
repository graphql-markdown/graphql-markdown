import { GraphQLArgument, GraphQLField } from "graphql/type/definition";

import { getTypeName } from "@graphql-markdown/utils";

import { printSection, printMetadataSection } from "../section";
import { printCodeField } from "../code";
import { Options } from "../const/options";

export const printOperationType = (type: GraphQLField<any, any>, options: Options): string => {
  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  return printSection([options.schema!.getType(queryType)!], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

export const printOperationMetadata = (type: GraphQLField<any, any>, options: Options) => {
  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args as GraphQLArgument[], "Arguments", options);

  return `${metadata}${response}`;
};

export const printCodeOperation = printCodeField;
