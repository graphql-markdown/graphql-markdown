/** Error class names that may be reported as-is. */
export const ERROR_TYPES = [
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "ReferenceError",
  "GraphQLError",
  "AggregateError",
  "AbortError",
  "SystemError",
] as const;

/** Reported when no schema could be loaded. */
export const NO_SCHEMA_ERROR = "<no-schema>";

/** Prefix for failures happening after generation (post-generation hooks). */
export const POST_ERROR_PREFIX = "post:";

const CUSTOM_ERROR = "<custom-error>";

const ERROR_CODE = /^E[A-Z]+$/;

/**
 * Maps any thrown value to an anonymous error type: an allowlisted class
 * name (optionally suffixed with a system code), or `<custom-error>`.
 * Never throws.
 */
export const errorTypeOf = (error: unknown): string => {
  try {
    if (typeof error !== "object" || error === null) {
      return CUSTOM_ERROR;
    }
    const name = (error as { constructor?: { name?: unknown } }).constructor
      ?.name;
    const base = (ERROR_TYPES as readonly string[]).includes(name as string)
      ? (name as string)
      : CUSTOM_ERROR;
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string" && ERROR_CODE.test(code)) {
      return `${base}:${code}`;
    }
    return base;
  } catch {
    return CUSTOM_ERROR;
  }
};
