/**
 * String constants and helpers shared by the legacy printer when composing
 * Markdown fragments for GraphQL schemas.
 *
 * @packageDocumentation
 */
import type { RootTypeLocale } from "@graphql-markdown/types";
import { MARKDOWN_CODE_SNIPPET, MARKDOWN_EOL } from "@graphql-markdown/utils";

export {
  MARKDOWN_CODE_INDENTATION,
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
const GRAPHQL = "graphql" as const;

/** Default placeholder when no schema description is provided. */
export const NO_DESCRIPTION_TEXT = "No description" as const;

/**
 * Wraps code in a fenced code block. The fence is longer than any run of
 * backticks in the code, so schema text inside cannot close it early.
 *
 * @param code - the code to wrap.
 * @param language - the fence language, defaults to `graphql`.
 *
 * @returns the fenced code block, surrounded by line breaks.
 */
export const printCodeBlock = (
  code: string,
  language: string = GRAPHQL,
): string => {
  const char = MARKDOWN_CODE_SNIPPET[0]!;
  const longestRun = Math.max(
    0,
    ...(code.match(new RegExp(`${char}+`, "g")) ?? []).map((run) => {
      return run.length;
    }),
  );
  const fence = char.repeat(Math.max(3, longestRun + 1));
  return `${MARKDOWN_EOL}${fence}${language}${MARKDOWN_EOL}${code}${MARKDOWN_EOL}${fence}${MARKDOWN_EOL}`;
};
