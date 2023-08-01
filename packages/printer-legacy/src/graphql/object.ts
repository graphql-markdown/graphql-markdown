import { getTypeName, getFields } from "@graphql-markdown/utils";

import { printSection, printMetadataSection } from "../section";
import { printCodeField } from "../code";
import { MARKDOWN_EOL, MARKDOWN_CODE_INDENTATION } from "../const/strings";
import { Options } from "../const/options";

export const printInterfaceMetadata = (
  type: unknown,
  options: Options,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("getInterfaces" in type) ||
    typeof type.getInterfaces !== "function"
  ) {
    return "";
  }

  return printSection(type.getInterfaces(), "Interfaces", options);
};

export const printObjectMetadata = (
  type: unknown,
  options: Options,
): string => {
  const interfaceMeta = printInterfaceMetadata(type, options);
  const metadata = printMetadataSection(
    type,
    getFields(type),
    "Fields",
    options,
  );

  return `${metadata}${interfaceMeta}`;
};

export const printCodeType = (
  type: unknown,
  entity: string,
  options: Options,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("getInterfaces" in type) ||
    typeof type.getInterfaces !== "function"
  ) {
    return "";
  }

  const name = getTypeName(type);
  const extendsInterface =
    "getInterfaces" in type && type.getInterfaces().length > 0
      ? ` implements ${type
          .getInterfaces()
          .map((field: unknown) => getTypeName(field))
          .join(", ")}`
      : "";
  const typeFields = getFields(type)
    .map((field: unknown) => {
      const f = printCodeField(field, options, 1);
      return f.length > 0 ? `${MARKDOWN_CODE_INDENTATION}${f}` : "";
    })
    .filter((field: unknown[]) => field.length > 0)
    .join("");

  return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
};

export const printCodeObject = (type: unknown, options: Options) =>
  printCodeType(type, "type", options);
