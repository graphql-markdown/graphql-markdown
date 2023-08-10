import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import {
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

export const printCodeField = (
  type: unknown,
  options?: PrintTypeOptions,
  indentationLevel: number = 0,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  const skipDirective =
    typeof options !== "undefined" &&
    "skipDocDirective" in options &&
    hasDirective(type, options.skipDocDirective);
  const skipDeprecated =
    typeof options !== "undefined" &&
    "deprecated" in options &&
    options.deprecated === "skip" &&
    isDeprecated(type);

  if (skipDirective || skipDeprecated) {
    return "";
  }

  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type, indentationLevel + 1);
  code += `: ${getTypeName(type.type)}`;
  code += isDeprecated(type) ? ` @${DEPRECATED}` : "";
  code += MARKDOWN_EOL;

  return code;
};

export const printCodeArguments = (
  type: unknown,
  indentationLevel: number = 1,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("args" in type) ||
    !Array.isArray(type.args) ||
    type.args.length === 0
  ) {
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
