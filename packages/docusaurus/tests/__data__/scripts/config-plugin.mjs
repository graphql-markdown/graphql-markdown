import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const PLUGIN_FILENAMES = {
  config1: "docusaurus2-graphql-doc-generator.config.js",
  config2: "docusaurus2-graphql-doc-generator-groups.config.js",
  config3: "docusaurus2-graphql-doc-generator-tweets.graphqlrc.js",
};

const PLUGIN_PLACEHOLDER_ENTRIES = Object.entries(PLUGIN_FILENAMES);

const docusaurusConfigFilepath = require.resolve("./docusaurus.config.js");

/** @type {import('@docusaurus/types').Config} */
const config = {
  url: "https://graphql-markdown.dev",
  baseUrl: "/",
  onBrokenLinks: "warn",
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

const createPluginRequireString = (filename) =>
  `require(path.resolve(__dirname, "data/${filename}"))`;

const configExportTemplate = `
const path = require("path");

module.exports = ${JSON.stringify(config)};\n`

const configExportString = PLUGIN_PLACEHOLDER_ENTRIES.reduce(
  (output, [placeholder, filename]) =>
    output.replace(
      `"@${placeholder}@"`,
      createPluginRequireString(filename),
    ),
  configExportTemplate,
);

try {
  await writeFile(docusaurusConfigFilepath, configExportString);
  console.log(`Successfully updated '${docusaurusConfigFilepath}'`);
} catch (error) {
  console.log(`Error updating '${docusaurusConfigFilepath}'`, error);
}
