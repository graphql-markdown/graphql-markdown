/** @type {Partial<import("typedoc").TypeDocOptions & import("typedoc-plugin-markdown").PluginOptions>} */

export const typedocBaseOptions = {
  cleanOutputDir: true,
  excludeExternals: true,
  excludeInternal: false,
  excludePrivate: true,
  excludeReferences: true,
  excludeNotDocumented: false,
  formatWithPrettier: true,
  githubPages: false,
  hideBreadcrumbs: true,
  hideGenerator: true,
  hidePageHeader: true,
  hidePageTitle: false,
  useCodeBlocks: true,
  outputFileStrategy: "modules",
  pretty: true,
  theme: "default",
  useHTMLEncodedBrackets: true,
  validation: {
    notExported: false,
    invalidLink: false,
    rewrittenLink: false,
    notDocumented: false,
    unusedMergeModuleWith: false,
  },
  visibilityFilters: {},
  sourceLinkExternal: true,
  gitRevision: "main",
  entryFileName: "index",
  readme: "none",
  mergeReadme: false,
  excludeTags: ["@alias"],
};

export const createPackageTypedocConfig = (overrides = {}) => ({
  ...typedocBaseOptions,
  plugin: [
    "typedoc-plugin-markdown",
    "../../tooling-config/typedoc/no-media-plugin.mjs",
  ],
  prettierConfigFile: "../../tooling-config/prettier/index.js",
  entryPoints: ["./src"],
  entryPointStrategy: "expand",
  out: "./docs",
  ...overrides,
});
