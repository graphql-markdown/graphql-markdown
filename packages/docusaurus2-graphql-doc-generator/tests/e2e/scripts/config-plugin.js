const fs = require("fs");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.json";

const docusaurusConfig = require.resolve(
  `${process.cwd()}/docusaurus.config.js`
);

let config = require(docusaurusConfig);

config = {
  ...config,
  title: "GraphQL to Doc",
  tagline: "Markdown documentation from a GraphQL schema.",
  organizationName: "edno",
  projectName: "docusaurus2-graphql-doc",
  themeConfig: {
    ...config.themeConfig,
    navbar: {
      ...config.themeConfig.navbar,
      items: [
        {
          to: "/docs/schema",
          label: "Schema",
          position: "left",
        },
      ],
    },
  },
  plugins: [["@edno/docusaurus2-graphql-doc-generator", "@config@"]],
};

const configExportString = `const path = require("path");
module.exports = ${JSON.stringify(config)};\n`.replace(
  `"@config@"`,
  `require(path.resolve(__dirname, "${pluginConfigFilename}"))`
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
const pluginConfig = require(path.resolve(__dirname, "${pluginConfigFilename}"));
module.exports = require(path.resolve(__dirname, pluginConfig.rootPath, pluginConfig.baseURL, "sidebar-schema.js"));
\n`;

fs.writeFile(sidebarConfig, sidebarConfigString, (err) => {
  if (err) {
    console.log(`Error updating '${sidebarConfig}'`, err);
  } else {
    console.log(`Successfully updated '${sidebarConfig}'`);
  }
});
