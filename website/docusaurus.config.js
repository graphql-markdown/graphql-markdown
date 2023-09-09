// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const { directiveDescriptor } = require("@graphql-markdown/helpers");
const { getTypeDirectiveValues } = require("@graphql-markdown/graphql");

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
    "@cmfcmf/docusaurus-search-local",
    [
      "@graphql-markdown/docusaurus",
      {
        id: "example-default",
        linkRoot: "/examples/default",
        rootPath: "./examples/default",
      },
    ],
    [
      "@graphql-markdown/docusaurus",
      /** @type {import('@graphql-markdown/types').ConfigOptions & import('@docusaurus/plugin-content-docs').PluginOptions} */
      ({
        id: "example-group-by",
        rootPath: "./examples/group-by",
        linkRoot: "/examples/group-by",
        customDirective: {
          auth: {
            descriptor: (directive, type) =>
              directiveDescriptor(
                directive,
                type,
                "This requires the current user to be in `${requires}` role.",
              ),
          },
          complexity: {
            descriptor: (directive, type) => {
              const { value, multipliers } = getTypeDirectiveValues(
                directive,
                type,
              );
              const multiplierDescription = multipliers
                ? ` per ${multipliers.map((v) => `\`${v}\``).join(", ")}`
                : "";
              return `This has an additional cost of \`${value}\` points${multiplierDescription}.`;
            },
          },
        },
      }),
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
          sidebarPath: "./sidebars.js",
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
            to: "/api/",
            position: "right",
            label: "API",
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
        copyright: `Copyright © 2020-${new Date().getFullYear()} Grégory Heitz. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
