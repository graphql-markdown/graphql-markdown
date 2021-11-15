const fs = require("fs");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.js";
const pluginGroupConfigFilename = "docusaurus2-graphql-doc-generator-groups.config.js";

const docusaurusConfig = require.resolve(`./docusaurus.config.js`);

const config = {
  url: "https://edno.github.io/",
  baseUrl: "/graphql-markdown/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  title: "GraphQL to Markdown",
  tagline: "Markdown documentation for GraphQL schema.",
  organizationName: "edno",
  projectName: "graphql-markdown",
  trailingSlash: false,
  themeConfig: {
    respectPrefersColorScheme: true,
    navbar: {
      title: "GraphQL-Markdown",
      logo: {
        alt: "GraphQL-Markdown",
        src: "img/graphql-markdown.svg",
        target: "_self",
      },
      items: [
        {
          to: "/schema",
          label: "Demo 1",
          position: "left",
        },
        {
          to: "/group-by",
          label: "Demo 2",
          position: "left",
        },
        {
          href: "https://github.com/edno/graphql-markdown/releases",
          label: "Release Notes",
          position: "right",
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
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "sidebars.js",
        },
      },
    ],
  ],
  plugins: [["@edno/docusaurus2-graphql-doc-generator", "@config@"]],
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
const basicSchema = require(path.resolve(__dirname, "${pluginConfigFilename}"));
const groupSchema = require(path.resolve(__dirname, "${pluginGroupConfigFilename}"));
const { schemaSidebar: basic } = require(path.resolve(__dirname, basicSchema.rootPath, basicSchema.baseURL, "sidebar-schema.js"));
const { schemaSidebar: group } = require(path.resolve(__dirname, groupSchema.rootPath, groupSchema.baseURL, "sidebar-schema.js"));
module.exports = { basic, group };
\n`;

fs.writeFile(sidebarConfig, sidebarConfigString, (err) => {
  if (err) {
    console.log(`Error updating '${sidebarConfig}'`, err);
  } else {
    console.log(`Successfully updated '${sidebarConfig}'`);
  }
});
