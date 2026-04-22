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

export * as docusaurus from "./docusaurus/index";
export * as docfx from "./docfx/index";
export * as fumadocs from "./fumadocs/index";
export * as honkit from "./honkit/index";
export * as hugo from "./hugo/index";
export * as mdbook from "./mdbook/index";
export * as mkdocs from "./mkdocs/index";
export * as starlight from "./starlight/index";
export * as vocs from "./vocs/index";
