// @ts-check

import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const PLUGIN_FILENAMES = {
  config1: "graphql-doc-generator.config.mjs",
  config2: "graphql-doc-generator-groups.config.mjs",
  config3: "graphql-doc-generator-tweets.graphqlrc.mjs",
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

const createPluginImportString = (filename) =>
  `await importConfig("${filename}")`;

const configExportTemplate = `
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const importConfig = async (filename) => {
  const moduleUrl = pathToFileURL(path.resolve(__dirname, "data", filename)).href;
  const moduleExports = await import(moduleUrl);
  return moduleExports.default;
};

export default async function createConfigAsync() {
  return ${JSON.stringify(config)};
}\n`

const configExportString = PLUGIN_PLACEHOLDER_ENTRIES.reduce(
  (output, [placeholder, filename]) =>
    output.replace(
      `"@${placeholder}@"`,
      createPluginImportString(filename),
    ),
  configExportTemplate,
);

try {
  await writeFile(docusaurusConfigFilepath, configExportString);
  console.log(`Successfully updated '${docusaurusConfigFilepath}'`);
} catch (error) {
  console.log(`Error updating '${docusaurusConfigFilepath}'`, error);
}
