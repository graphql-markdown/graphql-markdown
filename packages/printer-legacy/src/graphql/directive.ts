import {
  getTypeName,
  GraphQLArgument,
  GraphQLDirective,
} from "@graphql-markdown/utils";

import { printMetadataSection } from "../section";
import { printCodeArguments } from "../code";
import { PrintTypeOptions } from "../const/options";

export type PrintDirectiveOptions = Pick<
  PrintTypeOptions,
  "basePath" | "deprecated" | "parentTypePrefix"
> &
  Partial<PrintTypeOptions>;

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

export const printDirectiveMetadata = (
  type: GraphQLDirective,
  options: PrintDirectiveOptions,
) => {
  if ("args" in type === false) {
    return "";
  }

  return printMetadataSection(
    type,
    type.args as GraphQLArgument[],
    "Arguments",
    options,
  );
};

export const printCodeDirective = (
  type: GraphQLDirective,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: PrintDirectiveOptions,
) => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};
