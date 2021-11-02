const pico = require("picocolors");

const { getSchemaMap, loadSchema, getDocumentLoaders } = require("./graphql");
const Renderer = require("./renderer");
const Printer = require("./printer");
const {
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
} = require("./diff");
const groupingInfo = require("./grouping-info");

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
    const groupingInfo = new groupingInfo(
      rootTypes,
      linkRoot,
      baseURL,
      groupByDirective,
    );
    const renderer = new Renderer(
      new Printer(schema, baseURL, linkRoot, groupingInfo),
      outputDir,
      baseURL,
      groupingInfo,
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
      pico.green(
        `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`,
      ),
    );
    console.log(
      pico.blue(
        `${
          pages.flat().length
        } pages generated in ${duration}s from schema "${schemaLocation}".`,
      ),
    );
    console.info(
      pico.blue(
        pico.bold(
          `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`,
        ),
      ),
    );

    // create references for checkSchemaChanges
    await saveSchemaHash(schema, tmpDir);
    await saveSchemaFile(schema, tmpDir);
  } else {
    console.info(
      pico.blue(`No changes detected in schema "${schemaLocation}".`),
    );
  }
};
