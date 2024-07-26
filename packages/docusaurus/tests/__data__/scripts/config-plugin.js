const fs = require("node:fs");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.js";
const pluginGroupConfigFilename =
  "docusaurus2-graphql-doc-generator-groups.config.js";
const pluginGraphqlrcConfigFilename =
  "docusaurus2-graphql-doc-generator-tweets.graphqlrc.js";

const docusaurusConfigFilepath = require.resolve("./docusaurus.config.js");

/** @type {import('@docusaurus/types').Config} */
const config = {
  url: "https://graphql-markdown.dev",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  title: "GraphQL-Markdown",
  tagline: "Flexible GraphQL Documentation Generator",
  organizationName: "edno",
  projectName: "graphql-markdown",
  trailingSlash: false,
  themeConfig: {
    image: "img/preview.png",
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
          to: "/examples/default",
          label: "Schema",
        },
        {
          to: "/examples/group-by",
          label: "Group by directive",
        },
        {
          href: "https://github.com/graphql-markdown/graphql-markdown/releases",
          label: "Release Notes",
          position: "right",
        },
        {
          href: "https://github.com/graphql-markdown/graphql-markdown",
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
        blog: false,
        docs: {
          path: "docs",
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    ["@graphql-markdown/docusaurus", "@config1@"],
    ["@graphql-markdown/docusaurus", "@config2@"],
    ["@graphql-markdown/docusaurus", "@config3@"],
  ],
};

const configExportString = `
const path = require("path");

module.exports = ${JSON.stringify(config)};\n`
  .replace(
    `"@config1@"`,
    `require(path.resolve(__dirname, "data/${pluginConfigFilename}"))`,
  )
  .replace(
    `"@config2@"`,
    `require(path.resolve(__dirname, "data/${pluginGroupConfigFilename}"))`,
  )
  .replace(
    `"@config3@"`,
    `require(path.resolve(__dirname, "data/${pluginGraphqlrcConfigFilename}"))`,
  );

fs.writeFile(docusaurusConfigFilepath, configExportString, (err) => {
  if (err) {
    console.log(`Error updating '${docusaurusConfigFilepath}'`, err);
  } else {
    console.log(`Successfully updated '${docusaurusConfigFilepath}'`);
  }
});
