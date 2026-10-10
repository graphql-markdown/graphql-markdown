/** Default value for `gqlmd.baseURL` / `createGenerateDocs`'s `baseURL` option — the shared route prefix every page and content-generation call resolves against unless overridden. */
export const DEFAULT_BASE_URL = "api-reference";

/** Name (without extension) every landing doc is stored under — the theme finds the schema homepage by this name, whatever the template was called. */
export const LANDING_DOC_NAME = "generated";

/** True when the last path segment is the landing doc name (`/api-reference/generated`), never for lookalikes such as `generated-things`. */
export const isLandingDocPath = (path: string): boolean => {
  return path.split("/").findLast(Boolean) === LANDING_DOC_NAME;
};
