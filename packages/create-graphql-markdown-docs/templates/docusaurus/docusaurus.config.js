// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github,
  darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "My API",
  tagline: "GraphQL-Markdown is cool",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "graphql-markdown", // Usually your GitHub org/user name.
  projectName: "graphql-markdown-template", // Usually your repo name.
  plugins: ["@graphql-markdown/docusaurus"], // See .graphqlrc for configuration
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: false,
        docs: {
          routeBasePath: "/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "GraphQL-Markdown",
        logo: {
          alt: "graphql-markdown",
          src: "img/graphql-markdown.svg"
        },
        items: [
          {
            href: "https://github.com/graphql-markdown/graphql-markdown",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "light",
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} My Website, Inc. Built with GraphQL-Markdown & Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
