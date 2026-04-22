/**
 * HonKit formatter for GraphQL documentation output.
 *
 * Produces plain Markdown compatible with HonKit static site generator.
 * Internal links are converted to .html paths. Includes a
 * `beforeComposePageTypeHook` that injects entity-kind badges and builds
 * an "On this page" TOC from section headings.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Formatter,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import { MARKDOWN_EOL } from "@graphql-markdown/utils";

/** File extension used for generated pages — HonKit renders plain Markdown to HTML. */
export const mdxExtension = ".md" as const;

/**
 * Formats a badge as an inline HTML `<span>` with themed pill styles.
 * Three built-in themes: `deprecated` (red), `required` (blue), and `default` (grey).
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted inline HTML span string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const label = (
    typeof text === "string" ? String(text) : String(text.singular)
  ).trim();
  const tone = String(classname ?? "default").toLowerCase();

  const themes: Record<string, { bg: string; border: string; color: string }> =
    {
      deprecated: { bg: "#fff3f2", border: "#fecaca", color: "#9f1239" },
      required: { bg: "#eef9ff", border: "#bfdbfe", color: "#1e3a8a" },
      default: { bg: "#f6f7f9", border: "#d1d5db", color: "#374151" },
    };

  const theme = themes[tone] ?? themes.default;
  return `<span style="display:inline-block;padding:0.12rem 0.5rem;margin-right:0.35rem;border:1px solid ${theme.border};border-radius:999px;background:${theme.bg};color:${theme.color};font-size:1.15rem;font-weight:600;line-height:1.2;vertical-align:middle;">${label}</span>` as MDXString;
};

/**
 * Formats an admonition as a Markdown blockquote with a bold prefix label.
 * Maps `warning` type to `WARNING`; all other types use `INFO`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted blockquote string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const prefix = type === "warning" ? "WARNING" : "INFO";
  return `> **${prefix} - ${title}**\n>\n> ${text}` as MDXString;
};

/**
 * Formats a bullet point separator using a Unicode bullet character.
 * @param text - Optional text to append after the bullet
 * @returns Formatted bullet string
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return ` • ${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element.
 * @param option - Configuration for open/close label text
 * @returns Formatted details element string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOL}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}\r${dataClose}${MARKDOWN_EOL}</details>${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats YAML front matter and appends an H1 heading derived from the `title` prop.
 * Merges `props` entries with `formatted` lines (formatted lines take precedence).
 * Returns empty string if `props` is empty or absent — HonKit renders front matter
 * without a title as literal YAML content.
 * @param props - Front matter options; `title` is used to generate the H1 heading
 * @param formatted - Pre-formatted front matter lines that override props values
 * @returns Formatted front matter block with optional H1, or empty string
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  if (!props || typeof props !== "object" || Object.keys(props).length === 0) {
    return "" as MDXString;
  }

  const entries = new Map<string, string>(
    Object.entries(props).map(([k, v]) => {
      return [k, String(v)];
    }),
  );

  for (const line of formatted ?? []) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || key.includes("#")) continue;

    const value = trimmed.slice(separatorIndex + 1).trim();
    entries.set(key, value);
  }

  const lines = Array.from(entries.entries()).map(([k, v]) => {
    return `${k}: ${v}`;
  });
  const title = (entries.get("title") ?? "").replace(/\r?\n/g, " ").trim();
  const heading = title ? `\n\n# ${title}` : "";

  return `---\n${lines.join("\n")}\n---${heading}` as MDXString;
};

/**
 * Converts internal link URLs to `.html` paths for HonKit static output.
 * Absolute paths without an `.html` extension are suffixed with `.html`.
 * External URLs and fragment-only links are returned unchanged.
 * @param link - Link data with URL and text
 * @returns Link with `.html` extension applied to absolute internal paths
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  if (!url || /^(https?:|mailto:|tel:)/i.test(url) || url.startsWith("#"))
    return { text, url };

  const href = String(url).trim();

  const match = /^([^?#]*)([?#].*)?$/.exec(href);
  const pathname = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";

  if (
    pathname.startsWith("/") &&
    pathname !== "/" &&
    !pathname.endsWith(".html")
  ) {
    return { text, url: `${pathname}.html${suffix}` };
  }

  return { text, url: href };
};

/**
 * Formats a named entity as plain text (no markup).
 * HonKit renders plain Markdown — no JSX or code spans needed.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted entity reference string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  return (parentType ? `${parentType}.${name}` : name) as MDXString;
};

/**
 * Formats a "specified by" link as plain text with the raw URL.
 * HonKit does not render custom JSX components.
 * @param url - URL to the specification
 * @returns Formatted specification text string
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `\n\nSpecified by: ${url}` as MDXString;
};

// ---------------------------------------------------------------------------
// Entity-kind badge hook
// ---------------------------------------------------------------------------

/** Color themes keyed by GraphQL entity kind for the kind badge. */
const KIND_THEMES: Record<
  string,
  { bg: string; border: string; color: string }
> = {
  query: { bg: "#f0fdf4", border: "#bbf7d0", color: "#14532d" },
  mutation: { bg: "#fdf4ff", border: "#e9d5ff", color: "#581c87" },
  subscription: { bg: "#fff7ed", border: "#fed7aa", color: "#7c2d12" },
  object: { bg: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a" },
  input: { bg: "#fefce8", border: "#fef08a", color: "#713f12" },
  enum: { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534" },
  scalar: { bg: "#f8fafc", border: "#cbd5e1", color: "#334155" },
  interface: { bg: "#eef2ff", border: "#c7d2fe", color: "#3730a3" },
  union: { bg: "#fff1f2", border: "#fecdd3", color: "#881337" },
  directive: { bg: "#fdf2f8", border: "#f0abfc", color: "#86198f" },
};

const makeKindBadge = (kind: string): string => {
  const theme = KIND_THEMES[kind] ?? {
    bg: "#f6f7f9",
    border: "#d1d5db",
    color: "#374151",
  };
  return `<span style="display:inline-block;padding:0.12rem 0.5rem;margin-left:0.5rem;border:1px solid ${theme.border};border-radius:999px;background:${theme.bg};color:${theme.color};font-size:1.5rem;font-weight:600;line-height:1.2;vertical-align:middle;">${kind}</span>`;
};

const getEntityKind = (type: unknown, schema: unknown): string | null => {
  if (!type) return null;

  const t = type as Record<string, unknown>;
  const ctor = (t.constructor as { name?: string } | undefined)?.name;
  const astKind = (t.astNode as { kind?: string } | undefined)?.kind;

  const rootMatch = (getType: unknown, label: string): string | null => {
    if (!schema || typeof schema !== "object") return null;
    const s = schema as Record<string, unknown>;
    const fn = s[getType as string] as (() => { name?: string }) | undefined;
    const root = typeof fn === "function" ? fn() : undefined;
    return root?.name === (t as { name?: string }).name ? label : null;
  };

  if (astKind === "ObjectTypeDefinition" || ctor === "GraphQLObjectType") {
    return (
      rootMatch("getQueryType", "query") ??
      rootMatch("getMutationType", "mutation") ??
      rootMatch("getSubscriptionType", "subscription") ??
      "object"
    );
  }
  if (
    astKind === "InputObjectTypeDefinition" ||
    ctor === "GraphQLInputObjectType"
  )
    return "input";
  if (astKind === "EnumTypeDefinition" || ctor === "GraphQLEnumType")
    return "enum";
  if (astKind === "ScalarTypeDefinition" || ctor === "GraphQLScalarType")
    return "scalar";
  if (astKind === "InterfaceTypeDefinition" || ctor === "GraphQLInterfaceType")
    return "interface";
  if (astKind === "UnionTypeDefinition" || ctor === "GraphQLUnionType")
    return "union";
  if (astKind === "DirectiveDefinition" || ctor === "GraphQLDirective")
    return "directive";

  return null;
};

interface TocEntry {
  text: string;
  anchor: string;
}

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const collectTocEntries = (section: unknown, entries: TocEntry[]): void => {
  if (!section) return;

  if (typeof section === "string") {
    for (const line of section.split(/\r?\n/)) {
      if (!line.startsWith("###")) continue;
      const title = line.slice(3).trim();
      if (!title) continue;

      const raw = title;
      if (!raw) continue;
      entries.push({
        text: raw,
        anchor: raw
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
      });
    }
    return;
  }

  if (Array.isArray(section)) {
    for (const item of section) collectTocEntries(item, entries);
    return;
  }

  if (typeof section === "object") {
    const s = section as Record<string, unknown>;
    if (typeof s.title === "string" && s.title.trim()) {
      const raw = s.title.trim();
      if (raw) {
        entries.push({
          text: raw,
          anchor: raw
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
        });
      }
    }
    if (s.content !== undefined) collectTocEntries(s.content, entries);
  }
};

const buildPageToc = (
  sections: Record<string, unknown>,
  outputKeys: string[],
): string | null => {
  const items: TocEntry[] = [];
  for (const key of outputKeys) collectTocEntries(sections[key], items);
  if (items.length < 2) return null;

  const links = items
    .map(({ text, anchor }) => {
      return `<li><a href="#${escapeHtml(anchor)}">${escapeHtml(text)}</a></li>`;
    })
    .join("");

  return [
    `<aside class="on-this-page" aria-label="On this page">`,
    `  <div class="on-this-page__title">On this page</div>`,
    `  <ul class="on-this-page__list">${links}</ul>`,
    `</aside>`,
    "",
  ].join("\n");
};

/**
 * Lifecycle hook that fires before composing a page for a GraphQL type entity.
 * Determines the entity's GraphQL kind (query, mutation, object, enum, etc.),
 * injects a colored kind badge into the H1 heading, and prepends an
 * "On this page" TOC sidebar when two or more `###` sections are present.
 * @param event - Hook payload with `type`, `options` (including `schema`), and `sections`
 */
export const beforeComposePageTypeHook = async (event: {
  data: {
    type: unknown;
    options: Record<string, unknown>;
    sections: Record<string, unknown>;
  };
  output: string[];
}): Promise<void> => {
  const { type, options, sections } = event.data;
  const schema = options.schema;

  const kind = getEntityKind(type, schema);
  if (!kind) return;

  const badge = makeKindBadge(kind);
  const header = sections.header as Record<string, unknown> | undefined;
  if (header && typeof header.content === "string") {
    const lines = header.content.split(/\r?\n/);
    const h1Index = lines.findIndex((line) => {
      return line.startsWith("# ");
    });
    if (h1Index >= 0) {
      lines[h1Index] = `${lines[h1Index]} ${badge}`;
      header.content = lines.join("\n");
    }
  }

  const toc = buildPageToc(sections, event.output);
  if (toc) {
    sections.toc = { content: toc };
    event.output.unshift("toc");
  }
};

/**
 * Creates a HonKit formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for HonKit output
 */
export const createMDXFormatter = (_meta?: Maybe<MetaInfo>): Formatter => {
  return {
    formatMDXBadge,
    formatMDXAdmonition,
    formatMDXBullet,
    formatMDXDetails,
    formatMDXFrontmatter,
    formatMDXLink,
    formatMDXNameEntity,
    formatMDXSpecifiedByLink,
  };
};
