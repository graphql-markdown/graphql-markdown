import { GraphQLDirective, GraphQLField, GraphQLNamedType } from "graphql";

import {
  hasProperty,
  getDefaultValue,
  getTypeName,
  isDeprecated,
  hasDirective,
} from "@graphql-markdown/utils";

import {
  MARKDOWN_EOL,
  DEPRECATED,
  MARKDOWN_CODE_INDENTATION,
} from "./const/strings";
import { Options, DeprecatedOption } from "./const/options";

export const printCodeField = (type: GraphQLField<any, any, any> | GraphQLDirective, options: Options, indentationLevel: number = 0) => {
  const skipDirective =
    hasProperty(options, "skipDocDirective") &&
    hasDirective(type, options.skipDocDirective) === true;
  const skipDeprecated =
    hasProperty(options, "printDeprecated") &&
    options.deprecated === DeprecatedOption.SKIP &&
    isDeprecated(type) === true;
  if (skipDirective === true || skipDeprecated === true) {
    return "";
  }

  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type, indentationLevel + 1);
  code += `: ${getTypeName(type.type as GraphQLNamedType)}`;
  code += isDeprecated(type) ? ` @${DEPRECATED}` : "";
  code += MARKDOWN_EOL;

  return code;
};

export const printCodeArguments = (type: GraphQLField<any, any, any> | GraphQLDirective, indentationLevel: number = 1) => {
  if (!("args" in type) || type.args.length === 0) {
    return "";
  }

  const argIndentation = MARKDOWN_CODE_INDENTATION.repeat(indentationLevel);
  const parentIndentation =
    indentationLevel === 1 ? "" : MARKDOWN_CODE_INDENTATION;
  let code = `(${MARKDOWN_EOL}`;
  code += type.args.reduce((r, v) => {
    const defaultValue = getDefaultValue(v);
    const hasDefaultValue =
      typeof defaultValue !== "undefined" && defaultValue !== null;
    const printedDefault = hasDefaultValue ? ` = ${getDefaultValue(v)}` : "";
    const propType = v.type.toString();
    const propName = v.name.toString();
    return `${r}${argIndentation}${propName}: ${propType}${printedDefault}${MARKDOWN_EOL}`;
  }, "");
  code += `${parentIndentation})`;

  return code;
};
