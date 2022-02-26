const path = require("path");
const GroupInfo = require("../../lib/group-info");

function mergeConfigWithCLIOptions(config, cli) {
  const baseURL = cli.base ?? config.baseURL;
  const schemaLocation = cli.schema ?? config.schema;
  const root = cli.root ?? config.rootPath;
  const outputDir = path.join(root, baseURL);
  const linkRoot = cli.link ?? config.linkRoot;
  const homepageLocation = cli.homepage ?? config.homepage;
  const diff = cli.diff ?? config.diffMethod;
  const diffMethod = cli.force ? "FORCE" : diff;
  const tmpDir = cli.tmp ?? config.tmpDir;
  const loaders = config.loaders;
  const groupByDirective =
    GroupInfo.parseOption(cli.groupByDirective) || config.groupByDirective;
  const prettify = cli.pretty ?? config.pretty;

  return {
    baseURL,
    schemaLocation,
    outputDir,
    linkRoot,
    homepageLocation,
    diffMethod,
    tmpDir,
    loaders,
    groupByDirective,
    prettify,
  };
}

const pluginConfigs = [];

module.exports = { mergeConfigWithCLIOptions, pluginConfigs };
