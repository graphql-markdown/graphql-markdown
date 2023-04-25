const {
  graphql: { getSchemaMap, loadSchema, getDocumentLoaders },
  group: { getGroups },
  directive: { getCustomDirectives },
} = require("@graphql-markdown/utils");
const Renderer = require("./renderer");

const NS_PER_SEC = 1e9;
const SEC_DECIMALS = 3;

const hasChanges = async (
  schema,
  tmpDir,
  diffMethod,
  diffModule = "@graphql-markdown/diff",
) => {
  if (
    typeof diffMethod === "undefined" ||
    diffMethod == null ||
    typeof diffModule === "undefined" ||
    diffModule == null
  ) {
    return true;
  }

  try {
    const { checkSchemaChanges } = require(diffModule);
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch (error) {
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
  skipDocDirective,
  customDirectives,
) => {
  let Printer = undefined;

  if (typeof printerModule !== "string") {
    throw new Error(
      'Invalid printer module name in "printTypeOptions" settings.',
    );
  }

  try {
    Printer = require(printerModule);
  } catch (error) {
    throw new Error(
      `Cannot find module '${printerModule}' for @graphql-markdown/core in "printTypeOptions" settings.`,
    );
  }

  Printer.init(schema, baseURL, linkRoot, {
    groups,
    printTypeOptions,
    skipDocDirective,
    customDirectives,
  });

  return Printer;
};

const generateDocFromSchema = async ({
  baseURL,
  schemaLocation,
  outputDir,
  linkRoot,
  homepageLocation,
  diffMethod,
  tmpDir,
  loaders: loadersList,
  groupByDirective,
  prettify,
  docOptions,
  printTypeOptions,
  printer: printerModule,
  skipDocDirective,
  customDirective,
}) => {
  const start = process.hrtime.bigint();

  const loaders = getDocumentLoaders(loadersList);
  const schema = await loadSchema(schemaLocation, loaders);

  const changed = await hasChanges(schema, tmpDir, diffMethod);
  if (!changed) {
    console.info(`No changes detected in schema "${schemaLocation}".`);
  }

  const rootTypes = getSchemaMap(schema);
  const customDirectives = getCustomDirectives(rootTypes, customDirective);
  const groups = new getGroups(rootTypes, groupByDirective);
  const printer = getPrinter(
    schema,
    baseURL,
    linkRoot,
    groups,
    printTypeOptions,
    printerModule,
    skipDocDirective,
    customDirectives,
  );
  const renderer = new Renderer(printer, outputDir, baseURL, groups, prettify, {
    ...docOptions,
    deprecated: printTypeOptions.deprecated,
  });

  const pages = await Promise.all(
    Object.keys(rootTypes).map((typeName) =>
      renderer.renderRootTypes(typeName, rootTypes[typeName]),
    ),
  );

  await renderer.renderHomepage(homepageLocation);

  const sidebarPath = await renderer.renderSidebar();

  const duration = (
    Number(process.hrtime.bigint() - start) / NS_PER_SEC
  ).toFixed(SEC_DECIMALS);

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
