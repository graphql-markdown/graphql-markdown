const { writeFile } = require("node:fs");
const { resolve } = require("node:path");

/** @type {import('@graphql-markdown/types').ConfigOptions} */
const pluginConfig = require(
  resolve(__dirname, "data", "docusaurus2-graphql-doc-generator.config.js"),
);
/** @type {import('@graphql-markdown/types').ConfigOptions} */
const pluginGroupConfig = require(
  resolve(
    __dirname,
    "data",
    "docusaurus2-graphql-doc-generator-groups.config.js",
  ),
);
/** @type {import('@graphql-markdown/types').ConfigOptions} */
const pluginGraphqlrcConfig = require(
  resolve(
    __dirname,
    "data",
    "docusaurus2-graphql-doc-generator-tweets.graphqlrc.js",
  ),
);

const docusaurusConfigFilepath = require.resolve("./docusaurus.config.js");

/** @type {import('@docusaurus/types').Config} */
const config = {
  url: "https://graphql-markdown.github.io",
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
          sidebarPath: "sidebars.js",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    ["@graphql-markdown/docusaurus", pluginConfig],
    ["@graphql-markdown/docusaurus", pluginGroupConfig],
    ["@graphql-markdown/docusaurus", pluginGraphqlrcConfig],
  ],
};

const configExportString = `module.exports = ${JSON.stringify(config)};`;

writeFile(docusaurusConfigFilepath, configExportString, (err) => {
  if (err) {
    console.log(`Error updating '${docusaurusConfigFilepath}'`, err);
  } else {
    console.log(`Successfully updated '${docusaurusConfigFilepath}'`);
  }
});

const sidebarConfig = require.resolve(`${process.cwd()}/sidebars.js`);

const sidebarConfigString = `
const { resolve } = require("node:path");
const { existsSync } = require("node:fs");

const sidebarFile = "sidebar-schema.js"
let sidebar = {};

const basicSidebarFile = resolve(__dirname, ${pluginConfig.rootPath}, ${pluginConfig.baseURL}, sidebarFile);
if (existsSync(basicSidebarFile)) {
  const { schemaSidebar } = require(basicSidebarFile);
  sidebar = { ...sidebar, basic: schemaSidebar };
}

const groupBySidebarFile = resolve(__dirname, ${pluginGroupConfig.rootPath}, ${pluginGroupConfig.baseURL}, sidebarFile);
if (existsSync(groupBySidebarFile)) {
  const { schemaSidebar } = require(groupBySidebarFile);
  sidebar = { ...sidebar, group: schemaSidebar };
}

module.exports = sidebar;
\n`;

writeFile(sidebarConfig, sidebarConfigString, (err) => {
  if (err) {
    console.log(`Error updating '${sidebarConfig}'`, err);
  } else {
    console.log(`Successfully updated '${sidebarConfig}'`);
  }
});
