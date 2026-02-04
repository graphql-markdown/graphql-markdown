// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github,
  darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "GraphQL-Markdown",
  tagline: "Human-friendly documentation for GraphQL schemas.",
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
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-group-by",
        path: "./examples/group-by",
        routeBasePath: "examples/group-by",
        sidebarCollapsed: true,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "./api",
        routeBasePath: "api",
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "../docs",
          editUrl:
            "https://github.com/graphql-markdown/graphql-markdown/tree/main/",
          exclude: ["**/__*.md"],
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/examples/**", "/search/**"],
          filename: "sitemap.xml",
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
        operatingSystem: "Any",
        description:
          "Generate human-friendly Markdown/MDX documentation from GraphQL schemas. Works with Docusaurus and popular frameworks.",
        url: "https://graphql-markdown.dev",
        author: {
          "@type": "Person",
          name: "Grégory Heitz",
        },
        license: "https://opensource.org/licenses/MIT",
      }),
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
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
      image: "img/social-card.png",
      metadata: [
        {
          name: "description",
          content:
            "Generate human-friendly Markdown/MDX documentation from GraphQL schemas. Works with Docusaurus and popular frameworks.",
        },
        {
          name: "keywords",
          content:
            "GraphQL, Markdown, MDX, documentation, Docusaurus, API documentation, schema, generator, GraphQL schema",
        },
        { name: "author", content: "Grégory Heitz" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "GraphQL-Markdown" },
        {
          name: "twitter:description",
          content:
            "Generate human-friendly Markdown/MDX documentation from GraphQL schemas.",
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

  future: {v4: true}
};

module.exports = config;
