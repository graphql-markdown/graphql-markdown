const fs = require("fs");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.js";
const pluginGroupConfigFilename =
  "docusaurus2-graphql-doc-generator-groups.config.js";

// eslint-disable-next-line node/no-missing-require
const docusaurusConfig = require.resolve(`./docusaurus.config.js`);

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
          // eslint-disable-next-line node/no-missing-require
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    ["@graphql-markdown/docusaurus", "@config1@"],
    ["@graphql-markdown/docusaurus", "@config2@"],
  ],
};

const configExportString = `const path = require("path");
module.exports = ${JSON.stringify(config)};\n`
  .replace(
    `"@config1@"`,
    `require(path.resolve(__dirname, "data/${pluginConfigFilename}"))`,
  )
  .replace(
    `"@config2@"`,
    `require(path.resolve(__dirname, "data/${pluginGroupConfigFilename}"))`,
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
const { existsSync } = require("fs");

let sidebar = {};

const basicSchema = require(path.resolve(__dirname, "data/${pluginConfigFilename}"));
const basicSidebarFile = path.resolve(__dirname, basicSchema.rootPath, basicSchema.baseURL, "sidebar-schema.js");
if (existsSync(basicSidebarFile)) {
  const { schemaSidebar } = require(basicSidebarFile);
  sidebar = { ...sidebar, basic: schemaSidebar };
}

const groupSchema = require(path.resolve(__dirname, "data/${pluginGroupConfigFilename}"));
const groupBySidebarFile = path.resolve(__dirname, groupSchema.rootPath, groupSchema.baseURL, "sidebar-schema.js");
if (existsSync(groupBySidebarFile)) {
  const { schemaSidebar } = require(groupBySidebarFile);
  sidebar = { ...sidebar, group: schemaSidebar };
}

module.exports = sidebar;
\n`;

fs.writeFile(sidebarConfig, sidebarConfigString, (err) => {
  if (err) {
    console.log(`Error updating '${sidebarConfig}'`, err);
  } else {
    console.log(`Successfully updated '${sidebarConfig}'`);
  }
});
