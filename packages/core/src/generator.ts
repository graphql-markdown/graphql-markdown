import type {
  DiffMethodName,
  Options,
  SchemaEntity,
} from "@graphql-markdown/types";

import {
  getCustomDirectives,
  getDocumentLoaders,
  getGroups,
  getSchemaMap,
  loadSchema,
  Logger,
} from "@graphql-markdown/utils";

import { Renderer } from "./renderer";
import { hasChanges } from "./diff";
import { getPrinter } from "./printer";
import { DiffMethod } from "./config";

const NS_PER_SEC = 1e9 as const;
const SEC_DECIMALS = 3 as const;

export type GeneratorOptions = Options & { loggerModule?: string };

export const generateDocFromSchema = async ({
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
}: GeneratorOptions): Promise<void> => {
  const start = process.hrtime.bigint();

  const logger = Logger.setInstance(loggerModule);

  const loaders = loadersList
    ? await getDocumentLoaders(loadersList)
    : undefined;

  if (typeof loaders === "undefined") {
    logger.error(
      `An error occurred while loading GraphQL loader.\nCheck your dependencies and configuration.`,
    );
    return;
  }

  const schema = await loadSchema(schemaLocation as string, loaders);

  if (diffMethod !== DiffMethod.NONE) {
    const changed = await hasChanges(
      schema,
      tmpDir,
      diffMethod as DiffMethodName,
    );
    if (!changed) {
      logger.info(`No changes detected in schema "${schemaLocation}".`);
    }
  }

  const rootTypes = getSchemaMap(schema);
  const customDirectives = getCustomDirectives(rootTypes, customDirective);
  const groups = getGroups(rootTypes, groupByDirective);
  const printer = await getPrinter(
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
      renderer.renderRootTypes(
        typeName as SchemaEntity,
        rootTypes[typeName as SchemaEntity],
      ),
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
