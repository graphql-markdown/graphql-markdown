const fs = require("fs");
// const path = require("path");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.json";

// const pluginConfig = require(`./${pluginConfigFilename}`);

const docusaurusConfig = require.resolve(`./docusaurus.config.js`);

const config = {
  url: "https://edno.github.io/",
  baseUrl: "/graphql-markdown/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  title: "GraphQL to Markdown",
  tagline: "Markdown documentation for GraphQL schema.",
  organizationName: "edno",
  projectName: "graphql-markdown",
  themeConfig: {
    defaultMode: "dark",
    respectPrefersColorScheme: true,
    navbar: {
      title: "GraphQL-Markdown",
      logo: {
        alt: "GraphQL-Markdown",
        src: "img/graphql-markdown.svg",
        target: "_self",
      },
      style: "dark",
      items: [
        {
          to: "/docs/schema",
          label: "Schema",
          position: "left",
        },
        {
          href: "https://github.com/edno/graphql-markdown",
          label: "GitHub",
          position: "right",
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: false,
        },
        theme: {
          customCss: `require.resolve("./src/css/custom.css")`,
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        path: "/docs",
        routeBasePath: "/",
        sidebarPath: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "schema",
        path: "docs/schema",
        routeBasePath: "/schema",
        sidebarPath: `require.resolve("./sidebars.js")`,
      },
    ],
    ["@edno/docusaurus2-graphql-doc-generator", "@config@"],
  ],
};

const configExportString = `const path = require("path");
module.exports = ${JSON.stringify(config)};\n`.replace(
  `"@config@"`,
  `require(path.resolve(__dirname, "${pluginConfigFilename}"))`,
);

fs.writeFile(docusaurusConfig, configExportString, (err) => {
  if (err) {
    console.log(`Error updating '${docusaurusConfig}'`, err);
  } else {
    console.log(`Successfully updated '${docusaurusConfig}'`);
  }
});

const sidebarConfig = require.resolve(`${process.cwd()}/sidebars.js`);

const sidebarConfigString = `
const path = require("path");
const {rootPath, baseURL} = require(path.resolve(__dirname, "${pluginConfigFilename}"));
module.exports = require(path.resolve(__dirname, rootPath, baseURL, "sidebar-schema.js"));
\n`;

fs.writeFile(sidebarConfig, sidebarConfigString, (err) => {
  if (err) {
    console.log(`Error updating '${sidebarConfig}'`, err);
  } else {
    console.log(`Successfully updated '${sidebarConfig}'`);
  }
});
