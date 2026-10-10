import { docusaurus } from "./docusaurus.mjs";
import { nuxt } from "./nuxt.mjs";

/**
 * Supported scaffold targets; each key maps to `templates/<framework>`.
 * `scaffold.runScripts` are the package scripts to run after install, in order.
 */
export const FRAMEWORKS = { nuxt, docusaurus };

export const DEFAULT_FRAMEWORK = "nuxt";
