export type TypeLocale = { singular: string, plural: string}

export const ROOT_TYPE_LOCALE: Record<string, TypeLocale> = {
  QUERY: { singular: "query", plural: "queries" },
  MUTATION: { singular: "mutation", plural: "mutations" },
  SUBSCRIPTION: { singular: "subscription", plural: "subscriptions" },
  TYPE: { singular: "object", plural: "objects" },
  INTERFACE: { singular: "interface", plural: "interfaces" },
  DIRECTIVE: { singular: "directive", plural: "directives" },
  SCALAR: { singular: "scalar", plural: "scalars" },
  ENUM: { singular: "enum", plural: "enums" },
  OPERATION: { singular: "operation", plural: "operations" },
  UNION: { singular: "union", plural: "unions" },
  INPUT: { singular: "input", plural: "inputs" },
};

export const HEADER_SECTION_LEVEL: string = "###";
export const HEADER_SECTION_SUB_LEVEL: string = "####";
export const HEADER_SECTION_ITEM_LEVEL: string = "#####";
export const NO_DESCRIPTION_TEXT: string = "No description";
export const MARKDOWN_EOL : string= "\n";
export const MARKDOWN_EOP: string = "\n\n";

