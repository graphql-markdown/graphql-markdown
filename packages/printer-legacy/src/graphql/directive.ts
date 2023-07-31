import { GraphQLArgument, GraphQLDirective } from "graphql";

import { getTypeName } from "@graphql-markdown/utils";

import { printMetadataSection } from "../section";
import { printCodeArguments } from "../code";
import { Options } from "../const/options";

const printCodeDirectiveLocation = (type: GraphQLDirective) => {
  if (
    typeof type.locations === "undefined" ||
    type.locations == null ||
    type.locations.length === 0
  ) {
    return "";
  }

  let code = ` on `;
  const separator = `\r\n  | `;
  if (type.locations.length > 1) {
    code += separator;
  }
  code += type.locations.join(separator).trim();

  return code;
};

export const printDirectiveMetadata = (type: GraphQLDirective, options: Options) => {
  if ("args" in type === false) {
    return "";
  }

  return printMetadataSection(type, type.args as GraphQLArgument[], "Arguments", options);
};

export const printCodeDirective = (type: GraphQLDirective, options?: Options) => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};

module.exports = {
  printDirectiveMetadata,
  printCodeDirective,
};
