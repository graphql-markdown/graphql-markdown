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

export * as docusaurus from "./docusaurus/index.ts";
export * as docfx from "./docfx/index.ts";
export * as fumadocs from "./fumadocs/index.ts";
export * as honkit from "./honkit/index.ts";
export * as hugo from "./hugo/index.ts";
export * as mdbook from "./mdbook/index.ts";
export * as mdx from "./mdx/index.ts";
export * as mkdocs from "./mkdocs/index.ts";
export * as starlight from "./starlight/index.ts";
export * as vocs from "./vocs/index.ts";
