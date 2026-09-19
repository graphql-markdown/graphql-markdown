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
export const formatMDXBullet = (text = ""): string => `&nbsp;·&nbsp;${text}`;

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
