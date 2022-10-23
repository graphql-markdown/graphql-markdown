const { getSchemaMap, loadSchema, getDocumentLoaders } =
  require("@graphql-markdown/utils").graphql;
const { getGroups } = require("./group-info");
const Renderer = require("./renderer");

const time = process.hrtime();

const hasChanges = async (
  schema,
  tmpDir,
  diffMethod,
  diffModule = "@graphql-markdown/diff",
) => {
  if (typeof diffMethod == "undefined" || diffMethod == null) {
    return true;
  }

  try {
    const { checkSchemaChanges } = require(diffModule);
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch (e) {
    console.warn(
      `Cannot find module '${diffModule}' from @graphql-markdown/core!`,
    );
  }

  return true;
};

const getPrinter = (
  schema,
  baseURL,
  linkRoot,
  groups,
  printTypeOptions,
  printerModule,
) => {
  if (typeof printerModule != "string") {
    throw new Error(
      "Invalid printer module name in printTypeOptions settings.",
    );
  }

  try {
    const Printer = require(printerModule);
    return new Printer(schema, baseURL, linkRoot, {
      groups,
      printTypeOptions,
    });
  } catch (e) {
    throw new Error(
      `Cannot find module '${printerModule}' from @graphql-markdown/core in printTypeOptions settings.`,
    );
  }
};

const generateDocFromSchema = async ({
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
  printer: printerModule,
}) => {
  const schema = await loadSchema(schemaLocation, getDocumentLoaders(loaders));

  const changed = await hasChanges(schema, tmpDir, diffMethod);
  if (!changed) {
    console.info(`No changes detected in schema "${schemaLocation}".`);
  }

  const rootTypes = getSchemaMap(schema);
  const groups = new getGroups(rootTypes, groupByDirective);
  const printer = getPrinter(
    schema,
    baseURL,
    linkRoot,
    groups,
    printTypeOptions,
    printerModule,
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
};

module.exports = { getPrinter, hasChanges, generateDocFromSchema };
