/**
 * String constants and helpers shared by the legacy printer when composing
 * Markdown fragments for GraphQL schemas.
 *
 * @packageDocumentation
 */
import type { RootTypeLocale } from "@graphql-markdown/types";
import { MARKDOWN_CODE_SNIPPET, MARKDOWN_EOL } from "@graphql-markdown/utils";

export {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_CODE_INDENTATION,
  MARKDOWN_CODE_SNIPPET,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "@graphql-markdown/utils";

/**
 * Human-readable labels for each GraphQL root type used when rendering copy or badges.
 */
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

/** Label used when a schema element is flagged as deprecated. */
export const DEPRECATED = "deprecated" as const;

/** Copy fragment describing a non-null GraphQL modifier. */
export const NON_NULL = "non-null" as const;

/** Short identifier for the GraphQL language tag used in fenced blocks. */
export const GRAPHQL = "graphql" as const;

/** Default placeholder when no schema description is provided. */
export const NO_DESCRIPTION_TEXT = "No description" as const;

/** Helper for inserting the code-block end delimiter in generated Markdown. */
export const MARKDOWN_EOC =
  `${MARKDOWN_EOL}${MARKDOWN_CODE_SNIPPET}${MARKDOWN_EOL}` as const;

/** Helper for inserting the code-block start delimiter targeting GraphQL syntax. */
export const MARKDOWN_SOC =
  `${MARKDOWN_EOL}${MARKDOWN_CODE_SNIPPET}${GRAPHQL}${MARKDOWN_EOL}` as const;
