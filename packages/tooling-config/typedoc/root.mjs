// @ts-check

/** @type {Partial<import("typedoc").TypeDocOptions & import("typedoc-plugin-markdown").PluginOptions & import("typedoc-plugin-frontmatter").PluginOptions>} */

export const typedocApiOptions = {
  excludeGroups: true,
  excludeInternal: false,
  excludeNotDocumented: true,
  excludePrivate: false,
  excludeReferences: true,
  frontmatterGlobals: {
    pagination_prev: null,
    pagination_next: null,
    toc_max_heading_level: 2,
  },
  hidePageTitle: true,
  name: "API",
  entryFileName: "generated",
  mergeReadme: false,
  useHTMLEncodedBrackets: true,
  useCustomAnchors: true,
  customAnchorsFormat: "escapedCurlyBrace",
  sanitizeComments: true,
  validation: {
    invalidLink: true,
    notDocumented: true,
  },
  sort: ["visibility", "alphabetical"],
  sourceLinkExternal: true,
  groupOrder: [
    "Classes",
    "Interfaces",
    "Enumerations",
    "Functions",
    "Variables",
  ],
};
