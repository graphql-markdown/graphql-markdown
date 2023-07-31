import {
  hasProperty,
  isEnumType,
  getTypeName,
  isDeprecated,
  hasDirective,
} from "@graphql-markdown/utils";

import { MARKDOWN_EOL, DEPRECATED } from "../const/strings";
import { printMetadataSection } from "../section";
import { Options, DeprecatedOption } from "../const/options";
import { GraphQLEnumType, GraphQLEnumValue } from "graphql";

export const printEnumMetadata = (type: GraphQLEnumType, options: Options) => {
  return printMetadataSection(type, type.getValues() as GraphQLEnumValue[], "Values", options);
};

export const printCodeEnum = (type: GraphQLEnumType, options: Options) => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((value) => {
      const skipDirective =
        hasProperty(options, "skipDocDirective") &&
        hasDirective(value, options.skipDocDirective) === true;
      const skipDeprecated =
        hasProperty(options, "printDeprecated") &&
        options.deprecated === DeprecatedOption.SKIP &&
        isDeprecated(value) === true;
      if (skipDirective === true || skipDeprecated === true) {
        return "";
      }
      const v = getTypeName(value);
      const d = isDeprecated(value) === true ? ` @${DEPRECATED}` : "";
      return `  ${v}${d}`;
    })
    .filter((value) => value.length > 0)
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};
