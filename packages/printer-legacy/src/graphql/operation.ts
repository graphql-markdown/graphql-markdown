import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";

import { getTypeName } from "@graphql-markdown/utils";

import { printSection, printMetadataSection } from "../section";
import { printCodeField } from "../code";

export const printOperationType = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  return printSection([options.schema!.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

export const printOperationMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("args" in type)) {
    return "";
  }

  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args, "Arguments", options);

  return `${metadata}${response}` as MDXString;
};

export const printCodeOperation = printCodeField;
