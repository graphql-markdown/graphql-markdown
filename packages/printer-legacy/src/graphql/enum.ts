import type { PrintTypeOptions } from "@graphql-markdown/types";

import {
  isEnumType,
  getTypeName,
  isDeprecated,
  hasDirective,
} from "@graphql-markdown/utils";

import { MARKDOWN_EOL, DEPRECATED } from "../const/strings";
import { printMetadataSection } from "../section";

export const printEnumMetadata = <T>(type: T, options: PrintTypeOptions) => {
  if (!isEnumType(type)) {
    return "";
  }

  return printMetadataSection(type, type.getValues(), "Values", options);
};

export const printCodeEnum = <T>(type: T, options: PrintTypeOptions) => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((value) => {
      const skipDirective =
        "skipDocDirective" in options &&
        hasDirective(value, options.skipDocDirective) === true;
      const skipDeprecated =
        "deprecated" in options &&
        options.deprecated === "skip" &&
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
