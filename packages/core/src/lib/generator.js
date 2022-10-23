const { getSchemaMap, loadSchema, getDocumentLoaders } =
  require("@graphql-markdown/utils").graphql;
const { getGroups } = require("./group-info");
const Renderer = require("./renderer");

const time = process.hrtime();

const hasChanges = async (schema, tmpDir, diffMethod) => {
  if (typeof diffMethod == "undefined" || diffMethod == null) {
    return false;
  }

  try {
    const { checkSchemaChanges } = require("@graphql-markdown/diff");
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch (e) {
    console.warn(e.message ?? "@graphql-markdown/diff not found");
  }

  return false;
};

const getPrinter = (schema, baseURL, linkRoot, groups, printTypeOptions) => {
  if (typeof printTypeOptions.printer != "string") {
    throw new Error(
      "Invalid printer module name in printTypeOptions settings.",
    );
  }

  try {
    const Printer = require(printTypeOptions.printer);
    return Printer(schema, baseURL, linkRoot, {
      groups,
      printTypeOptions,
    });
  } catch (e) {
    throw new Error(
      `${printTypeOptions.printer} not found\nCheck printTypeOptions settings.`,
    );
  }
};

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

  if (await hasChanges((schema, tmpDir, diffMethod))) {
    const rootTypes = getSchemaMap(schema);
    const groups = new getGroups(rootTypes, groupByDirective);
    const printer = getPrinter(
      schema,
      baseURL,
      linkRoot,
      groups,
      printTypeOptions,
    );
    const renderer = new Renderer(
      printer,
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
