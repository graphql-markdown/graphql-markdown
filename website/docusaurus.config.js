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

  // GitHub pages deployment config.
  organizationName: "graphql-markdown",
  projectName: "graphql-markdown.dev",

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  plugins: [
    require.resolve("@cmfcmf/docusaurus-search-local"),
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-default",
        path: "./examples/default",
        routeBasePath: "examples/default",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-group-by",
        path: "./examples/group-by",
        routeBasePath: "examples/group-by",
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
          editUrl:
            "https://github.com/graphql-markdown/graphql-markdown/tree/main/",
          exclude: ["**/__*.md"],
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
        sitemap: {
          changefreq: "monthly",
          priority: 0.5,
          ignorePatterns: ["/examples/default/**", "/examples/group-by/**"],
          filename: "sitemap.xml",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        content:
          '🚀 Now compatible with AstroJS, NextJS and more... <a href="/docs/advanced/integration-with-frameworks">check our documentation</a> 🚀',
        // content:
        //   'If you like GraphQL-Markdown, give it a ⭐️ on <a target="_blank" rel="noopener noreferrer" href="https://github.com/graphql-markdown/graphql-markdown">GitHub</a>!',
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
          // {
          //   to: "https://codesandbox.io/s/github/graphql-markdown/demo/",
          //   position: "right",
          //   label: "CodeSandbox",
          // },
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

  future: {
    experimental_faster: true, // turns Docusaurus Faster on globally
  },
};

module.exports = config;
