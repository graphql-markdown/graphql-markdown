import {
  getSchemaMap,
  loadSchema,
  getDocumentLoaders,
  GraphQLSchema,
  RelationType,
} from "@graphql-markdown/utils/graphql";

import { getGroups } from "./groupInfo";
import Renderer from "./renderer";
import {
  ConfigOptions,
  DiffMethodType,
  IPrinter,
  PrintTypeOptions,
} from "./type";

const time = process.hrtime();

export const hasChanges = async (
  schema: GraphQLSchema,
  tmpDir: string,
  schemaDiff: DiffMethodType
): Promise<boolean> => {
  return await schemaDiff.diff(schema, tmpDir);
};

export const getPrinter = async (
  schema: GraphQLSchema,
  baseURL: string,
  linkRoot: string,
  groups: Record<string, unknown> | undefined,
  printTypeOptions: PrintTypeOptions,
  printerModule: string,
  skipDocDirective: string | undefined
): Promise<IPrinter> => {
  try {
    const Printer = await import(printerModule);
    return new Printer(schema, baseURL, linkRoot, {
      groups,
      printTypeOptions,
      skipDocDirective,
    });
  } catch (error) {
    throw new Error(
      `Cannot find module '${printerModule}' from @graphql-markdown/core in printTypeOptions settings.`
    );
  }
};

export const generateDocFromSchema = async ({
  baseURL,
  schema: schemaLocation,
  outputDir,
  linkRoot,
  homepage: homepageLocation,
  schemaDiff,
  tmpDir,
  loaders: loadersList,
  groupByDirective,
  pretty: prettify,
  docOptions,
  printTypeOptions,
  printer: printerModule,
  skipDocDirective,
}: ConfigOptions): Promise<void> => {
  const { loaders, loaderOptions } = await getDocumentLoaders(loadersList);
  const schema = await loadSchema(schemaLocation, {
    ...loaderOptions,
    loaders,
  });

  const changed = await hasChanges(schema, tmpDir, schemaDiff);
  if (!changed) {
    console.info(`No changes detected in schema "${schemaLocation}".`);
  }

  const rootTypes = getSchemaMap(schema);
  const groups = getGroups(rootTypes, groupByDirective);
  const printer = await getPrinter(
    schema,
    baseURL,
    linkRoot,
    groups,
    printTypeOptions,
    printerModule,
    skipDocDirective
  );
  const renderer = new Renderer(
    printer,
    outputDir,
    baseURL,
    groups,
    prettify,
    docOptions,
    skipDocDirective
  );

  const pages = await Promise.all(
    (Object.keys(rootTypes) as RelationType[]).map((typeName) =>
      renderer.renderRootTypes(typeName, rootTypes[typeName])
    )
  );

  await renderer.renderHomepage(homepageLocation);

  const sidebarPath = await renderer.renderSidebar();

  const [sec, msec] = process.hrtime(time);
  const duration = (sec + msec / 1e9).toFixed(3);
  console.info(
    `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`
  );
  console.log(
    `${
      pages.flat().length
    } pages generated in ${duration}s from schema "${schemaLocation}".`
  );
  console.info(
    `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`
  );
};

export default generateDocFromSchema;
