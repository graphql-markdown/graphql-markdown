import { RootTypeLocale } from "./options";

export const ROOT_TYPE_LOCALE: RootTypeLocale = {
  DIRECTIVE: { singular: "directive", plural: "directives" },
  ENUM: { singular: "enum", plural: "enums" },
  INPUT: { singular: "input", plural: "inputs" },
  INTERFACE: { singular: "interface", plural: "interfaces" },
  MUTATION: { singular: "mutation", plural: "mutations" },
  OPERATION: { singular: "operation", plural: "operations" },
  QUERY: { singular: "query", plural: "queries" },
  SCALAR: { singular: "scalar", plural: "scalars" },
  SUBSCRIPTION: { singular: "subscription", plural: "subscriptions" },
  TYPE: { singular: "object", plural: "objects" },
  UNION: { singular: "union", plural: "unions" },
};

export const HEADER_SECTION_ITEM_LEVEL = "#####";
export const HEADER_SECTION_LEVEL = "###";
export const HEADER_SECTION_SUB_LEVEL = "####";

export const NO_DESCRIPTION_TEXT = "No description";

export const FRONT_MATTER = "---";
export const MARKDOWN_CODE_INDENTATION = "  ";
export const MARKDOWN_EOL = "\n";
export const MARKDOWN_EOP = "\n\n";
export const MARKDOWN_EOC = `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
export const MARKDOWN_SOC = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;

export const DEPRECATED = "deprecated";

export const HIDE_DEPRECATED = `<><span className="deprecated">Hide deprecated</span></>`;
export const SHOW_DEPRECATED = `<><span className="deprecated">Show deprecated</span></>`;
