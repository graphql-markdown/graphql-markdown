import type { RootTypeLocale } from "@graphql-markdown/types";
import { MARKDOWN_CODE_SNIPPET, MARKDOWN_EOL } from "@graphql-markdown/utils";

export {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_CODE_INDENTATION,
  MARKDOWN_CODE_SNIPPET,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "@graphql-markdown/utils";

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

export const DEPRECATED = "deprecated" as const;
export const NON_NULL = "non-null" as const;
export const GRAPHQL = "graphql" as const;
export const NO_DESCRIPTION_TEXT = "No description" as const;

export const MARKDOWN_EOC =
  `${MARKDOWN_EOL}${MARKDOWN_CODE_SNIPPET}${MARKDOWN_EOL}` as const;
export const MARKDOWN_SOC =
  `${MARKDOWN_EOL}${MARKDOWN_CODE_SNIPPET}${GRAPHQL}${MARKDOWN_EOL}` as const;
