import type { RootTypeLocale } from "@graphql-markdown/types";

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
} as const;

export const NO_DESCRIPTION_TEXT = "No description" as const;

export const FRONT_MATTER_DELIMITER = "---" as const;
export const MARKDOWN_CODE_INDENTATION = "  " as const;
export const MARKDOWN_EOL = "\n" as const;
export const MARKDOWN_EOP = "\n\n" as const;
export const MARKDOWN_EOC = `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}` as const;
export const MARKDOWN_SOC =
  `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}` as const;

export const DEPRECATED = "deprecated" as const;

export const HIDE_DEPRECATED =
  `<><span className="deprecated">Hide deprecated</span></>` as const;
export const SHOW_DEPRECATED =
  `<><span className="deprecated">Show deprecated</span></>` as const;
