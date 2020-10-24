const fs = require("fs");

const pluginConfigFilename = "docusaurus2-graphql-doc-generator.config.json";

const docusaurusConfig = require.resolve(
  `${process.cwd()}/docusaurus.config.js`,
);

let config = require(docusaurusConfig);

config = {
  ...config,
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
