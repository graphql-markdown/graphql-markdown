/**
 * @module
 * Core generator functionality for GraphQL Markdown.
 * This module contains the main entry point for generating documentation from GraphQL schemas.
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
 * Generates Markdown documentation from a GraphQL schema.
 *
 * This function is the main entry point for the documentation generation process.
 * It loads the schema, analyzes it, and generates Markdown files according to the provided options.
 *
 * @param options - Configuration options for the documentation generator
 * @param options.baseURL - Base URL for the documentation links
 * @param options.customDirective - List of custom directives to include in documentation
 * @param options.diffMethod - Method to use for diffing schema changes (from {@link DiffMethodName})
 * @param options.docOptions - Documentation framework specific options
 * @param options.force - Forces regeneration of all files regardless of changes
 * @param options.groupByDirective - Directives used to group schema types
 * @param options.homepageLocation - Location of the homepage content
 * @param options.linkRoot - Root path for generating links
 * @param options.loadersList - List of loaders to use for loading the schema
 * @param options.loggerModule - Logger module to use
 * @param options.mdxParser - MDX parser module to use
 * @param options.metatags - Metadata tags to include in documentation
 * @param options.onlyDocDirective - Only document types with these directives
 * @param options.outputDir - Directory where documentation will be generated
 * @param options.prettify - Whether to prettify the generated output
 * @param options.printerModule - Printer module to use for generating output
 * @param options.printTypeOptions - Options for printing GraphQL types
 * @param options.printTypeOptions.deprecated - Whether to include deprecated types
 * @param options.printTypeOptions.hierarchy - Type hierarchy configuration
 * @param options.schemaLocation - Location of the GraphQL schema
 * @param options.skipDocDirective - Skip documenting types with these directives
 * @param options.tmpDir - Temporary directory for processing
 *
 * @returns Promise that resolves when documentation has been generated successfully. The function performs
 * schema analysis, generates markdown files for all schema entities, and prints a summary of the operation.
 *
 * @example
 * // Basic usage
 * await generateDocFromSchema({
 *   baseURL: "/docs/",
 *   schemaLocation: "./schema.graphql",
 *   outputDir: "./docs",
 *   diffMethod: DiffMethod.NONE,
 *   force: false,
 *   linkRoot: "/docs/",
 *   customDirective: [],
 *   groupByDirective: [],
 *   onlyDocDirective: [],
 *   skipDocDirective: [],
 *   loaders: ["@graphql-tools/json-file-loader"],
 *   printer: "@graphql-markdown/printer-docusaurus",
 *   printTypeOptions: {
 *     deprecated: true,
 *     hierarchy: { enabled: true }
 *   }
 * });
 *
 * @see {@link DiffMethod} - For available diff methods
 * @see {@link GeneratorOptions} - For all available configuration options
 * @see https://graphql-markdown.dev - For more examples and documentation
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

  const mdxModule = await (!mdxParser
    ? undefined
    : import(mdxParser).catch(() => {
        log(
          `An error occurred while loading MDX formatter "${mdxParser}"`,
          LogLevel.warn,
        );
        return undefined;
      }));

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
