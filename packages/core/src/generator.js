const {
  graphql: { getSchemaMap, loadSchema, getDocumentLoaders },
  group: { getGroups },
  directive: { getCustomDirectives },
} = require("@graphql-markdown/utils");

const { logger: Logger } = require("@graphql-markdown/utils");
const Renderer = require("./renderer");
const { hasChanges } = require("./diff");
const { getPrinter } = require("./printer");

const NS_PER_SEC = 1e9;
const SEC_DECIMALS = 3;

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
  loggerModule,
}) => {
  const start = process.hrtime.bigint();

  const logger = Logger.setInstance(loggerModule);

  const loaders = getDocumentLoaders(loadersList);
  const schema = await loadSchema(schemaLocation, loaders);

  const changed = await hasChanges(schema, tmpDir, diffMethod);
  if (!changed) {
    logger.info(`No changes detected in schema "${schemaLocation}".`);
  }

  const rootTypes = getSchemaMap(schema);
  const customDirectives = getCustomDirectives(rootTypes, customDirective);
  const groups = getGroups(rootTypes, groupByDirective);
  const printer = getPrinter(
    // module mandatory
    printerModule,

    // config mandatory
    {
      schema,
      baseURL,
      linkRoot,
    },

    // options
    {
      groups,
      printTypeOptions,
      skipDocDirective,
      customDirectives,
    },
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

  logger.success(
    `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`,
  );
  logger.info(
    `${
      pages.flat().length
    } pages generated in ${duration}s from schema "${schemaLocation}".`,
  );
  logger.info(
    `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`,
  );
};

module.exports = { generateDocFromSchema };
