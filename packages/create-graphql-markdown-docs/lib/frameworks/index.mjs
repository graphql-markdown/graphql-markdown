import { docusaurus } from "./docusaurus.mjs";
import { markdown, mdx } from "./markdown.mjs";
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
 * Supported scaffold targets; each key maps to `templates/<framework>`, unless
 * `scaffold.template` overrides it (mdx uses the markdown template).
 * `scaffold.runScripts` are the package scripts to run after install, in order.
 */
export const FRAMEWORKS = { nuxt, docusaurus, markdown, mdx };

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
  mdx,
  generic,
};

/**
 * Accepted `--framework` aliases per mode: alias -> framework id in that mode.
 * Scaffolding has no "generic" template (plain Markdown is its equivalent);
 * wiring has no "markdown" target (generic is its equivalent).
 */
export const FRAMEWORK_ALIASES = {
  scaffold: { generic: "markdown" },
  wire: { markdown: "generic" },
};

export const DEFAULT_FRAMEWORK = "nuxt";
