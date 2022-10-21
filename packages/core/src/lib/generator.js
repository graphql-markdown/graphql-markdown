const { getSchemaMap, loadSchema, getDocumentLoaders } =
  require("@graphql-markdown/utils").graphql;
const { getGroups } = require("./group-info");
const Renderer = require("./renderer");
const Printer = require("@graphql-markdown/printer-legacy");
const { checkSchemaChanges } = require("@graphql-markdown/diff");

const time = process.hrtime();

module.exports = async function generateDocFromSchema({
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
  docOptions,
  printTypeOptions,
}) {
  const { loaders: documentLoaders, loaderOptions } =
    getDocumentLoaders(loaders);
  const schema = await loadSchema(schemaLocation, {
    loaders: documentLoaders,
    ...loaderOptions,
  });

  const hasChanged = await checkSchemaChanges(schema, tmpDir, diffMethod);

  if (hasChanged) {
    const rootTypes = getSchemaMap(schema);
    const groups = new getGroups(rootTypes, groupByDirective);
    const renderer = new Renderer(
      new Printer(schema, baseURL, linkRoot, {
        groups,
        printTypeOptions,
      }),
      outputDir,
      baseURL,
      groups,
      prettify,
      docOptions,
    );
    const pages = await Promise.all(
      Object.keys(rootTypes).map((typeName) =>
        renderer.renderRootTypes(typeName, rootTypes[typeName]),
      ),
    );
    await renderer.renderHomepage(homepageLocation);
    const sidebarPath = await renderer.renderSidebar();

    const [sec, msec] = process.hrtime(time);
    const duration = (sec + msec / 1e9).toFixed(3);
    console.info(
      `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`,
    );
    console.log(
      `${
        pages.flat().length
      } pages generated in ${duration}s from schema "${schemaLocation}".`,
    );
    console.info(
      `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`,
    );
  } else {
    console.info(`No changes detected in schema "${schemaLocation}".`);
  }
};
