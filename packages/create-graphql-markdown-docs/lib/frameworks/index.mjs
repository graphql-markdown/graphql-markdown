import { docusaurus } from "./docusaurus.mjs";
import { nuxt } from "./nuxt.mjs";
import {
  docfx,
  fumadocs,
  generic,
  honkit,
  hugo,
  mdbook,
  mkdocs,
  starlight,
  vocs,
} from "./presets.mjs";

/**
 * @typedef {object} FrameworkDescriptor
 * @property {string} id
 * @property {string} name
 * @property {string} label
 * @property {string} [hint]
 * @property {string} [formatter]
 * @property {string} [createCommand]
 * @property {string[]} [detect]
 * @property {string} [outputHint]
 * @property {"relative" | "router" | "absolute"} [links]
 * @property {string} [contentRoot]
 * @property {string} [contentRoute]
 * @property {(ctx: { outputDir: string, route?: string }) => string} nextSteps
 * @property {object} [scaffold]
 */

/**
 * Supported scaffold targets; each key maps to `templates/<framework>`.
 * `scaffold.runScripts` are the package scripts to run after install, in order.
 */
export const FRAMEWORKS = { nuxt, docusaurus };

/** Every framework descriptor available in wire mode, keyed by id. */
export const WIRE_FRAMEWORKS = {
  docusaurus,
  starlight,
  fumadocs,
  vocs,
  honkit,
  hugo,
  mkdocs,
  docfx,
  mdbook,
  nuxt,
  generic,
};

export const DEFAULT_FRAMEWORK = "nuxt";
