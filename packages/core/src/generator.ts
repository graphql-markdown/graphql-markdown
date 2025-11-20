/**
 * Core generator functionality for GraphQL Markdown documentation.
 *
 * This module contains the main functionality for generating markdown documentation
 * from GraphQL schemas. It handles schema loading, processing, and markdown generation
 * through appropriate printers and renderers.
 *
 * @packageDocumentation
 */
import type {
  DiffMethodName,
  DirectiveName,
  GeneratorOptions,
  GraphQLDirective,
  Maybe,
  SchemaEntity,
  TypeHierarchyObjectType,
} from "@graphql-markdown/types";

import Logger, { log, LogLevel } from "@graphql-markdown/logger";

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

/**
 * Constant representing nanoseconds per second.
 *
 * This constant is used for high-precision time measurements and conversions
 * between seconds and nanoseconds.
 *
 */
const NS_PER_SEC = 1e9 as const;
/**
 * The number of decimal places to display when reporting times in seconds.
 *
 */
const SEC_DECIMALS = 3 as const;

/**
 * Main entry point for generating Markdown documentation from a GraphQL schema.
 *
 * This function coordinates the entire documentation generation process:
 * - Loads and validates the schema
 * - Checks for schema changes if diffing is enabled
 * - Processes directives and groups
 * - Initializes printers and renderers
 * - Generates markdown files
 *
 * @param options - Complete configuration for the documentation generation
 * @returns Promise that resolves when documentation is fully generated
 */
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

  const mdxModule = await (mdxParser !== undefined && mdxParser !== null
    ? import(mdxParser as string).catch(() => {
        log(
          `An error occurred while loading MDX formatter "${mdxParser}"`,
          LogLevel.warn,
        );
        return undefined;
      })
    : undefined);

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
    mdxModule,
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
    mdxModule,
  );

  // Pre-collect all categories before rendering to ensure consistent positions
  renderer.preCollectCategories(Object.keys(rootTypes));

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
