/**
 * Formatter presets for documentation frameworks.
 *
 * Each preset implements the {@link Formatter} interface and can be used
 * as the `mdxParser` config value in graphql-markdown.
 *
 * @example
 * ```yaml
 * # .graphqlrc.yml
 * extensions:
 *   graphql-markdown:
 *     mdxParser: "@graphql-markdown/formatters/mkdocs"
 * ```
 *
 * @packageDocumentation
 */

export * as docusaurus from "./docusaurus/index.js";
export * as docfx from "./docfx/index.js";
export * as fumadocs from "./fumadocs/index.js";
export * as honkit from "./honkit/index.js";
export * as hugo from "./hugo/index.js";
export * as mdbook from "./mdbook/index.js";
export * as mdx from "./mdx/index.js";
export * as mkdocs from "./mkdocs/index.js";
export * as starlight from "./starlight/index.js";
export * as vocs from "./vocs/index.js";
