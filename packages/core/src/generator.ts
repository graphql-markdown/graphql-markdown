import type {
  DiffMethodName,
  DirectiveName,
  GeneratorOptions,
  GraphQLDirective,
  Maybe,
  PackageName,
  SchemaEntity,
  TypeHierarchyObjectType,
} from "@graphql-markdown/types";

import Logger, { log } from "@graphql-markdown/logger";

import {
  getCustomDirectives,
  getDocumentLoaders,
  getGroups,
  getSchemaMap,
  loadSchema,
} from "@graphql-markdown/graphql";

import { toString } from "@graphql-markdown/utils";

import { DiffMethod } from "./config";
import { hasChanges } from "./diff";
import { getPrinter } from "./printer";
import type { Renderer } from "./renderer";
import { getRenderer } from "./renderer";

const NS_PER_SEC = 1e9 as const;
const SEC_DECIMALS = 3 as const;

export const generateDocFromSchema = async ({
  baseURL,
  customDirective,
  diffMethod,
  docOptions,
  force,
  groupByDirective,
  homepageLocation,
  linkRoot,
  loaders: loadersList,
  loggerModule,
  mdxParser,
  metatags,
  onlyDocDirective,
  outputDir,
  prettify,
  printer: printerModule,
  printTypeOptions,
  schemaLocation,
  skipDocDirective,
  tmpDir,
}: GeneratorOptions): Promise<void> => {
  const start = process.hrtime.bigint();

  const hasMDXSupport = mdxParser ? true : false;

  await Logger(loggerModule);

  const loaders = await getDocumentLoaders(loadersList);

  if (!loaders) {
    log(
      `An error occurred while loading GraphQL loader.\nCheck your dependencies and configuration.`,
      "error",
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
      log(`No changes detected in schema "${toString(schemaLocation)}".`);
    }
  }

  const [onlyDocDirectives, skipDocDirectives] = [
    onlyDocDirective,
    skipDocDirective,
  ].map((directiveList: DirectiveName[]) => {
    return directiveList
      .map((name: string) => {
        return schema.getDirective(name);
      })
      .filter((directive: Maybe<GraphQLDirective>) => {
        return typeof directive !== "undefined";
      }) as GraphQLDirective[];
  });

  const rootTypes = getSchemaMap(schema);
  const customDirectives = getCustomDirectives(rootTypes, customDirective);
  const groups = getGroups(rootTypes, groupByDirective);
  const printer = await getPrinter(
    // module mandatory
    printerModule,

    // config mandatory
    {
      baseURL,
      linkRoot,
      schema,
    },

    // options
    {
      customDirectives,
      groups,
      meta: {
        generatorFrameworkName: docOptions?.generatorFrameworkName,
        generatorFrameworkVersion: docOptions?.generatorFrameworkVersion,
      },
      metatags,
      onlyDocDirectives,
      printTypeOptions,
      skipDocDirectives,
    },
    mdxParser as PackageName,
  );
  const renderer = await getRenderer(
    printer,
    outputDir,
    baseURL,
    groups,
    prettify,
    {
      ...docOptions,
      deprecated: printTypeOptions?.deprecated,
      force,
      hierarchy: printTypeOptions?.hierarchy as TypeHierarchyObjectType,
    },
    hasMDXSupport,
  );

  const pages = await Promise.all(
    Object.keys(rootTypes).map(async (name) => {
      const typeName = name as SchemaEntity;
      return renderer.renderRootTypes(
        typeName,
        rootTypes[typeName],
      ) as ReturnType<Renderer["renderRootTypes"]>;
    }),
  );

  await renderer.renderHomepage(homepageLocation);

  const duration = (
    Number(process.hrtime.bigint() - start) / NS_PER_SEC
  ).toFixed(SEC_DECIMALS);

  log(
    `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`,
    "success",
  );
  log(
    `${
      pages.flat().length
    } pages generated in ${duration}s from schema "${toString(schemaLocation)}".`,
  );
};
