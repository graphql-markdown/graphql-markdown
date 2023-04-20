/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-missing-require */
// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "GraphQL-Markdown",
  tagline: "Human-friendly documentation for GraphQL schemas.",
  url: "https://graphql-markdown.github.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  organizationName: "graphql-markdown",
  projectName: "graphql-markdown.github.io",

  plugins: [
    require.resolve("@cmfcmf/docusaurus-search-local"),
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-default",
        path: "./examples/default",
        routeBasePath: "examples/default",
        sidebarPath: require.resolve("./examples/default/sidebar-schema.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "example-group-by",
        path: "./examples/group-by",
        routeBasePath: "examples/group-by",
        sidebarPath: require.resolve("./examples/group-by/sidebar-schema.js"),
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
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
          'If you like GraphQL-Markdown, give it a ⭐️ on <a target="_blank" rel="noopener noreferrer" href="https://github.com/graphql-markdown/graphql-markdown">GitHub</a>!',
        backgroundColor: "#485e58",
        textColor: "#dbf5e6",
        isCloseable: false,
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
            to: "https://codesandbox.io/s/github/graphql-markdown/demo/",
            position: "right",
            label: "CodeSandbox",
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
        copyright: `Copyright © ${new Date().getFullYear()} Grégory Heitz. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
