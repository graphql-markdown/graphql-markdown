const LLMS_IGNORE_PATTERNS = [
  "node_modules/**",
  ".docusaurus/**",
  "build/**",
  "src/**",
  "static/**",
  "packages/**",
  "coverage/**",
  "scripts/**",
  "config/**",
  "blog/**",
  "examples/**",
  "test/**",
];

const LLMS_KEEP_FRONTMATTER = [
  "sidebar_label",
  "sidebar_position",
  "id",
  "slug",
];

const DOC_SECTION_PATTERNS = [
  "intro*",
  "get-started*",
  "try-it*",
  "how-it-works*",
  "configuration*",
  "advanced/**",
  "settings*",
  "troubleshooting*",
];

const ROOT_CONTENT =
  "This index exposes the documentation set that powers graphql-markdown.dev so LLMs can discover sections without scraping HTML.";
const FULL_ROOT_CONTENT =
  "Complete offline export of the core docs, API reference, and worked examples published on graphql-markdown.dev.";

const CUSTOM_LLM_FILES = [
  {
    filename: "llms-api.txt",
    includePatterns: [
      "api/**/*.md",
    ],
    title: "GraphQL-Markdown API Reference",
    description:
      "Comprehensive API reference for GraphQL-Markdown packages, CLI commands, and integration helpers.",
    fullContent: true,
    includeUnmatchedLast: true,
    rootContent:
      "Endpoints, CLI commands, and helper utilities documented here mirror the content published under /api/ on graphql-markdown.dev.",
  }
];

const normalizePath = (value) => value.replaceAll("\\", "/");

const resolveLLMSContentDir = () => {
  if (process.env.GQLMD_LLMS_DOCS_DIR) {
    return process.env.GQLMD_LLMS_DOCS_DIR;
  }
  return ".";
};

const buildDocsIncludeOrder = (docsDir) => {
  const prefixes = new Set(["docs/"]);
  const normalized = normalizePath(docsDir);
  if (normalized === ".") {
    prefixes.add("");
  } else if (normalized && normalized !== "docs") {
    const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
    prefixes.add(withSlash);
  }
  const includeOrder = [];
  for (const prefix of prefixes) {
    for (const pattern of DOC_SECTION_PATTERNS) {
      includeOrder.push(`${prefix}${pattern}`);
    }
  }
  for (const prefix of prefixes) {
    includeOrder.push(`${prefix}**`);
  }
  includeOrder.push("docs/**");
  return includeOrder;
};

function createLLMSPluginConfig() {
  const docsDir = resolveLLMSContentDir();
  return {
    docsDir,
    ignoreFiles: LLMS_IGNORE_PATTERNS,
    title: "GraphQL-Markdown Documentation",
    description:
      "Human-friendly documentation for GraphQL-Markdown schemas and tooling.",
    includeOrder: buildDocsIncludeOrder(docsDir),
    includeUnmatchedLast: false,
    generateMarkdownFiles: false,
    keepFrontMatter: LLMS_KEEP_FRONTMATTER,
    excludeImports: true,
    removeDuplicateHeadings: true,
    rootContent: ROOT_CONTENT,
    fullRootContent: FULL_ROOT_CONTENT,
    customLLMFiles: CUSTOM_LLM_FILES,
  };
}

module.exports = createLLMSPluginConfig;
