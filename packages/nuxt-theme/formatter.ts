/**
 * Formatter overrides handed to `graphql-markdown` (see `generate.ts`).
 *
 * The library loads this module by URL at generation time, so it is typed
 * structurally: `@graphql-markdown/types` is not a direct dependency, and its
 * `MDXString` return type is opaque and cannot be produced from here.
 */

interface Badge {
  text: string;
  classname?: string[] | string;
}

interface Admonition {
  icon?: string | null;
  text: string;
  title: string | null;
  type: string;
}

/** ` · ` instead of the default ` ● `, as text rather than a styled span. */
export const formatMDXBullet = (text = ""): string => {
  return `&nbsp;·&nbsp;${text}`;
};

export const formatMDXBadge = ({ text }: Badge): string => {
  const suffix = String(text).toLowerCase();

  return `<mark class="gqlmd-mdx-badge gqlmd-mdx-badge-${suffix}">${text}</mark>`;
};

export const formatMDXAdmonition = ({
  text,
  title,
  type,
}: Admonition): string => {
  if (
    type.toLowerCase() === "warning" &&
    title?.toLowerCase() === "deprecated"
  ) {
    return `<aside class="api-deprecation-callout not-prose mb-8"><span class="api-deprecated-badge">deprecated</span><span class="api-deprecation-message">${text.trim()}</span></aside>`;
  }

  return `<fieldset class="gqlmd-mdx-admonition-fieldset"><legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLowerCase()}">${title}</span></legend><span>${text}</span></fieldset>`;
};

/**
 * Nuxt Content parses `.md` and `.mdx` alike, but its search indexer
 * (`queryCollectionSearchSections`) only reads `extension = "md"` — so the
 * generated pages have to be emitted as plain Markdown to be searchable.
 */
export const mdxExtension = ".md";

/**
 * Stamps a `kind` frontmatter field (the GraphQL entity kind being
 * rendered — `objects`, `scalars`, `queries`, `directives`, etc.) onto every
 * generated page, on top of the same `---`-delimited wrapping graphql-markdown's
 * own default `formatMDXFrontmatter` produces (reimplemented inline rather
 * than imported, since this file is loaded by URL at generation time and
 * deliberately stays free of `@graphql-markdown/*` runtime dependencies).
 *
 * `useApiNavigation.ts` reads this field back to group the sidebar/landing
 * grid by entity kind whenever a page has no folder segments left to group
 * by — today, that's `printTypeOptions.hierarchy: "flat"`, which otherwise
 * has nothing else to group on.
 */
export const formatMDXFrontmatter = (
  _props: unknown,
  formatted: string[] | null | undefined,
  context?: { entity?: string | null },
): string => {
  if (!formatted) return "";
  const lines = context?.entity
    ? [...formatted, `kind: ${context.entity}`]
    : formatted;
  return ["---", ...lines, "---"].join("\n");
};
