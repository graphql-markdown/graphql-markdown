import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import {
  getFormattedDefaultValue,
  getTypeName,
  isDeprecated,
} from "@graphql-markdown/graphql";

import {
  MARKDOWN_EOL,
  DEPRECATED,
  MARKDOWN_CODE_INDENTATION,
} from "./const/strings";
import { hasPrintableDirective } from "./link";

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
    const defaultValue = getFormattedDefaultValue(v);
    const hasDefaultValue =
      typeof defaultValue !== "undefined" && defaultValue !== null;
    const printedDefault = hasDefaultValue
      ? ` = ${getFormattedDefaultValue(v)}`
      : "";
    const propType = String(v.type);
    const propName = String(v.name);
    return `${r}${argIndentation}${propName}: ${propType}${printedDefault}${MARKDOWN_EOL}`;
  }, "");
  code += `${parentIndentation})`;

  return code;
};

export const printCodeField = (
  type: unknown,
  options?: PrintTypeOptions,
  indentationLevel: number = 0,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  if (!hasPrintableDirective(type, options)) {
    return "";
  }

  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type, indentationLevel + 1);
  code += `: ${getTypeName(type.type)}`;
  code += isDeprecated(type) ? ` @${DEPRECATED}` : "";
  code += MARKDOWN_EOL;

  return code;
};
