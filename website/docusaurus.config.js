// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const createLLMSPluginConfig = require("./llms.config");
const lightCodeTheme = themes.github,
  darkCodeTheme = themes.dracula;
const sitemapLastmod =
  process.env.DOCUSAURUS_DISABLE_GIT_METADATA === "true" ? undefined : "date";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "GraphQL-Markdown — GraphQL schema documentation generator",
  tagline: "Customizable Markdown/MDX documentation for GraphQL schemas.",
  url: "https://graphql-markdown.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  // GitHub pages deployment config.
  organizationName: "graphql-markdown",
  projectName: "graphql-markdown.dev",

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexBlog: false,
        indexPages: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-default",
        path: "./examples/default",
        routeBasePath: "examples/default",
        sidebarCollapsed: true,
        versions: { current: { noIndex: true } },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-group-by",
        path: "./examples/group-by",
        routeBasePath: "examples/group-by",
        sidebarCollapsed: true,
        versions: { current: { noIndex: true } },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "./api",
        routeBasePath: "api",
        versions: { current: { noIndex: true } },
      },
    ],
    ["docusaurus-plugin-llms", createLLMSPluginConfig()],
    // Disabling due to known bug which causes slowdowns in the build process
    // https://github.com/facebook/docusaurus/discussions/11199
    function disableExpensiveBundlerOptimizationPlugin() {
      return {
        name: "disable-expensive-bundler-optimizations",
        configureWebpack(_config, isServer) {
          return {
            optimization: {
              concatenateModules: false,
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "docs",
          editUrl:
            "https://github.com/graphql-markdown/graphql-markdown/tree/main/",
          exclude: ["**/__*.md"],
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
        blog: false,
        sitemap: {
          lastmod: sitemapLastmod,
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: [
            "/examples/**",
            "/search/**",
            "/api/category/**",
            "/api/printer-legacy/**",
            "/blog/**",
          ],
          filename: "sitemap.xml",
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.map((item) => {
              if (item.url === "https://graphql-markdown.dev/") {
                return { ...item, priority: 1.0, changefreq: "monthly" };
              }
              if (
                /\/docs\/(get-started|intro|configuration|try-it)$/.test(
                  item.url,
                )
              ) {
                return { ...item, priority: 0.9, changefreq: "monthly" };
              }
              if (item.url.includes("/docs/")) {
                return { ...item, priority: 0.7 };
              }
              if (item.url.includes("/api/")) {
                return { ...item, priority: 0.4, changefreq: "monthly" };
              }
              return item;
            });
          },
        },
      }),
    ],
  ],

  headTags: [
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "GraphQL-Markdown",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "DocumentationTool",
        operatingSystem: "Linux, macOS, Windows",
        description:
          "Generate customizable Markdown/MDX documentation from GraphQL schemas. Works with Docusaurus and popular MDX frameworks.",
        url: "https://graphql-markdown.dev",
        downloadUrl: "https://www.npmjs.com/package/@graphql-markdown/cli",
        softwareVersion: "latest",
        author: {
          "@type": "Person",
          name: "Grégory Heitz",
        },
        license: "https://opensource.org/licenses/MIT",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        codeRepository:
          "https://github.com/graphql-markdown/graphql-markdown",
        programmingLanguage: ["TypeScript", "JavaScript"],
      }),
    },
    {
      tagName: "link",
      attributes: {
        rel: "manifest",
        href: "/manifest.json",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "theme-color",
        content: "#485e58",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        href: "/img/graphql-markdown.png",
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.jpg",
      metadata: [
        {
          name: "description",
          content:
            "Auto-generate beautiful Markdown and MDX docs from any GraphQL schema. Open-source CLI with type cross-linking, custom directives, and Docusaurus integration. MIT licensed.",
        },
        { name: "author", content: "Grégory Heitz" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "GraphQL-Markdown" },
        {
          name: "twitter:description",
          content:
            "Auto-generate beautiful Markdown and MDX docs from any GraphQL schema. Open-source CLI, Docusaurus integration, MIT licensed.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "GraphQL-Markdown" },
        { property: "og:locale", content: "en_US" },
      ],
      announcementBar: {
        // content:
        //   '🚀 Now compatible with AstroJS, NextJS and more... <a href="/docs/advanced/integration-with-frameworks">check our documentation</a> 🚀',
        content:
          'If you like GraphQL-Markdown, give it a ⭐️ on <a target="_blank" rel="noopener noreferrer" href="https://github.com/graphql-markdown/graphql-markdown">GitHub</a>!',
        backgroundColor: "#485e58",
        textColor: "#dbf5e6",
        isCloseable: true,
      },
      navbar: {
        title: "GraphQL-Markdown",
        logo: {
          alt: "GraphQL-Markdown",
          src: "img/graphql-markdown.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "right",
            label: "Docs",
          },
          {
            to: "/api/",
            position: "right",
            label: "API",
          },
          {
            to: "showcase",
            position: "right",
            label: "Showcase",
          },
          {
            type: "dropdown",
            position: "right",
            label: "Examples",
            items: [
              {
                to: "/examples/default",
                label: "Default",
              },
              {
                to: "/examples/group-by",
                label: "Group by directive",
              },
            ],
          },
          {
            to: "https://github.com/graphql-markdown/graphql-markdown/releases",
            position: "right",
            label: "Release notes",
          },
          {
            to: "https://github.com/graphql-markdown/graphql-markdown",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "light",
        copyright: `Copyright © 2020-${new Date().getFullYear()} Grégory Heitz. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  future: { v4: true },
};

module.exports = config;
