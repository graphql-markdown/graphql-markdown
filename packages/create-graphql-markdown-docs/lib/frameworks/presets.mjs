/**
 * Wire-only framework descriptors (no `scaffold` key): these presets are
 * referenced by the wire mode but are not scaffolded by this package.
 */

/** Astro Starlight preset. */
export const starlight = {
  id: "starlight",
  name: "Astro Starlight",
  label: "Astro Starlight",
  formatter: "@graphql-markdown/formatters/starlight",
  createCommand: "npm create astro@latest -- --template starlight",
  detect: ["@astrojs/starlight"],
  links: "absolute",
  contentRoot: "src/content/docs",
  contentRoute: "/",
  outputHint: "Astro Starlight reads content from src/content/docs/",
  nextSteps: ({ outputDir }) =>
    `Add a sidebar group in astro.config.*: { label: 'API', autogenerate: { directory: '${outputDir}' } }.`,
};

/** Fumadocs preset. */
export const fumadocs = {
  id: "fumadocs",
  name: "Fumadocs",
  label: "Fumadocs",
  formatter: "@graphql-markdown/formatters/fumadocs",
  createCommand: "npm create fumadocs-app@latest",
  detect: ["fumadocs-core", "fumadocs-ui"],
  links: "router",
  contentRoot: "content/docs",
  contentRoute: "/docs",
  outputHint: "Fumadocs reads content from content/docs/",
  nextSteps: ({ outputDir }) =>
    `Add the folder to \`pages\` in the parent meta.json of \`${outputDir}\` (or let Fumadocs list it).`,
};

/** Vocs preset. */
export const vocs = {
  id: "vocs",
  name: "Vocs",
  label: "Vocs",
  formatter: "@graphql-markdown/formatters/vocs",
  createCommand: "npm create vocs@latest",
  detect: ["vocs"],
  links: "router",
  contentRoot: "docs/pages",
  contentRoute: "/",
  outputHint: "Vocs reads content from docs/pages/",
  nextSteps: ({ route }) =>
    `Add a sidebar entry in vocs.config.* linking to \`${route}\`.`,
};

/** HonKit preset. */
export const honkit = {
  id: "honkit",
  name: "HonKit",
  label: "HonKit",
  formatter: "@graphql-markdown/formatters/honkit",
  createCommand: "npx honkit init",
  detect: ["honkit"],
  links: "absolute",
  contentRoot: ".",
  contentRoute: "/",
  outputHint: "HonKit reads content from the project root",
  nextSteps: () => "List the generated pages in SUMMARY.md.",
};

/** Hugo preset. */
export const hugo = {
  id: "hugo",
  name: "Hugo",
  label: "Hugo",
  formatter: "@graphql-markdown/formatters/hugo",
  createCommand: "hugo new site <dir>",
  detect: ["hugo-bin", "hugo-extended"],
  links: "absolute",
  contentRoot: "content",
  contentRoute: "/",
  outputHint: "Hugo reads content from content/",
  nextSteps: ({ route }) =>
    `Add a menu entry in your Hugo config pointing to \`${route}\`.`,
};

/** MkDocs preset. */
export const mkdocs = {
  id: "mkdocs",
  name: "MkDocs",
  label: "MkDocs",
  formatter: "@graphql-markdown/formatters/mkdocs",
  createCommand: "mkdocs new <dir>",
  links: "relative",
  contentRoot: "docs",
  outputHint: "MkDocs reads content from docs/",
  nextSteps: ({ outputDir }) =>
    `Add \`${outputDir}\` to \`nav\` in mkdocs.yml (or omit \`nav\` to list pages automatically).`,
};

/** DocFX preset. */
export const docfx = {
  id: "docfx",
  name: "DocFX",
  label: "DocFX",
  formatter: "@graphql-markdown/formatters/docfx",
  createCommand: "docfx init",
  links: "relative",
  contentRoot: "docs",
  outputHint: "DocFX reads content from docs/",
  nextSteps: ({ outputDir }) => `Add \`${outputDir}\` to toc.yml.`,
};

/** mdBook preset. */
export const mdbook = {
  id: "mdbook",
  name: "mdBook",
  label: "mdBook",
  formatter: "@graphql-markdown/formatters/mdbook",
  createCommand: "mdbook init <dir>",
  links: "relative",
  contentRoot: "src",
  outputHint: "mdBook reads content from src/",
  nextSteps: () =>
    "List the generated pages in src/SUMMARY.md — mdBook only builds listed pages.",
};

/** Generic Markdown fallback (no formatter preset). */
export const generic = {
  id: "generic",
  name: "Other / generic Markdown",
  label: "Other / generic Markdown",
  nextSteps: ({ outputDir }) =>
    `Point your site navigation at \`${outputDir}\`. Manual wiring guide: https://graphql-markdown.dev`,
};
