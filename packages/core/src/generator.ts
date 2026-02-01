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
  GraphQLSchema,
  LoaderOption,
  Maybe,
  PackageName,
  SchemaEntity,
  TypeDiffMethod,
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
import { getRenderer } from "./renderer";
import { getEvents } from "./event-emitter";
import {
  SchemaEvent,
  SchemaEvents,
  DiffCheckEvent,
  DiffEvents,
  RenderRootTypesEvent,
  RenderRootTypesEvents,
  RenderHomepageEvent,
  RenderHomepageEvents,
} from "./events";
import { registerMDXEventHandlers } from "./event-handlers";

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
 * Asynchronously loads an MDX module dynamically.
 *
 * @param mdxParser - The MDX parser package name or path to import. Can be null or undefined.
 * @returns A promise that resolves to the imported module, or undefined if:
 *   - The mdxParser parameter is null or undefined
 *   - An error occurs during import (logs a warning and returns undefined)
 *
 * @internal
 */
export const loadMDXModule = async (
  mdxParser: Maybe<PackageName | string>,
): Promise<unknown> => {
  return mdxParser !== undefined && mdxParser !== null
    ? import(mdxParser as string).catch(() => {
        log(
          `An error occurred while loading MDX formatter "${mdxParser}"`,
          LogLevel.warn,
        );
        return undefined;
      })
    : undefined;
};

/**
 * Loads a GraphQL schema from the specified location using configured document loaders.
 *
 * @param schemaLocation - The location/path of the GraphQL schema to load (e.g., file path, URL, or glob pattern).
 * @param loadersList - Optional loader configuration for customizing how the schema is loaded.
 *
 * @returns A promise that resolves to the loaded GraphQL schema, or undefined if:
 *   - The loaders cannot be initialized
 *   - An error occurs during schema loading
 *
 * @internal
 */
export const loadGraphqlSchema = async (
  schemaLocation: string,
  loadersList: Maybe<LoaderOption>,
): Promise<Maybe<GraphQLSchema>> => {
  const loaders = await getDocumentLoaders(loadersList);

  if (!loaders) {
    log(
      `An error occurred while loading GraphQL loader.\nCheck your dependencies and configuration.`,
      "error",
    );
    return undefined;
  }

  return loadSchema(schemaLocation, loaders);
};

/**
 * Checks if there are differences in the GraphQL schema compared to a previous version.
 *
 * @param schema - The GraphQL schema to check for differences.
 * @param schemaLocation - The location/path of the schema file for logging purposes.
 * @param diffMethod - The method to use for detecting differences. If set to `NONE`, changes detection is skipped.
 * @param tmpDir - The temporary directory path used for storing and comparing schema versions.
 *
 * @returns A promise that resolves to `true` if changes are detected or if diff method is `NONE`,
 *          or `false` if no changes are detected.
 *
 * @remarks
 * When no changes are detected, a log message is generated indicating that the schema is unchanged.
 */
export const checkSchemaDifferences = async (
  schema: GraphQLSchema,
  schemaLocation: string,
  diffMethod: Maybe<TypeDiffMethod>,
  tmpDir: string,
): Promise<boolean> => {
  let changed = true;

  if (diffMethod !== DiffMethod.NONE) {
    changed = await hasChanges(schema, tmpDir, diffMethod as DiffMethodName);
    if (!changed) {
      log(`No changes detected in schema "${toString(schemaLocation)}".`);
    }
  }

  return changed;
};

/**
 * Resolves and retrieves GraphQL directive objects from the schema based on their names.
 *
 * Takes two lists of directive names (for "only" and "skip" documentation directives),
 * looks them up in the provided GraphQL schema, and returns the resolved directive objects.
 *
 * @param onlyDocDirective - A directive name or array of directive names for "only" documentation filtering
 * @param skipDocDirective - A directive name or array of directive names for "skip" documentation filtering
 * @param schema - The GraphQL schema to resolve directives from
 *
 * @returns A tuple containing two arrays: the first with resolved "only" directives,
 *          the second with resolved "skip" directives. Only defined directives are included.
 */
export const resolveSkipAndOnlyDirectives = (
  onlyDocDirective: Maybe<DirectiveName | DirectiveName[]>,
  skipDocDirective: Maybe<DirectiveName | DirectiveName[]>,
  schema: GraphQLSchema,
): GraphQLDirective[][] => {
  return [onlyDocDirective, skipDocDirective].map(
    (directive: Maybe<DirectiveName | DirectiveName[]>) => {
      // Normalize to array and filter out null/undefined
      let directiveList: DirectiveName[];
      if (Array.isArray(directive)) {
        directiveList = directive;
      } else if (directive) {
        directiveList = [directive];
      } else {
        directiveList = [];
      }

      return directiveList
        .map((name: string) => {
          return schema.getDirective(name);
        })
        .filter((directive): directive is GraphQLDirective => {
          return directive !== undefined;
        });
    },
  );
};

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

  const events = getEvents();

  await Logger(loggerModule);

  const mdxModule = await loadMDXModule(mdxParser);
  // Register MDX event handlers if mdxModule loaded successfully
  registerMDXEventHandlers(mdxModule);

  await events.emitAsync(
    SchemaEvents.BEFORE_LOAD,
    new SchemaEvent({
      schemaLocation: schemaLocation as string,
    }),
  );
  const schema = await loadGraphqlSchema(schemaLocation as string, loadersList);
  await events.emitAsync(
    SchemaEvents.AFTER_LOAD,
    new SchemaEvent({
      schemaLocation: schemaLocation as string,
      schema,
    }),
  );
  if (!schema) {
    log(
      `Failed to load GraphQL schema from location "${toString(
        schemaLocation,
      )}".`,
      "error",
    );
    return;
  }

  await events.emitAsync(
    DiffEvents.BEFORE_CHECK,
    new DiffCheckEvent({
      schema,
      outputDir: tmpDir,
    }),
  );
  const schemaHasChanges = await checkSchemaDifferences(
    schema,
    schemaLocation as string,
    diffMethod,
    tmpDir,
  );
  await events.emitAsync(
    DiffEvents.AFTER_CHECK,
    new DiffCheckEvent({ schemaHasChanges }),
  );

  const [onlyDocDirectives, skipDocDirectives] = resolveSkipAndOnlyDirectives(
    onlyDocDirective,
    skipDocDirective,
    schema,
  );

  events.emit(SchemaEvents.BEFORE_MAP, new SchemaEvent({ schema }));
  const rootTypes = getSchemaMap(schema);
  events.emit(SchemaEvents.AFTER_MAP, new SchemaEvent({ schema, rootTypes }));

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

  const beforeRenderRootTypesEvent = new RenderRootTypesEvent({
    rootTypes,
  });
  await events.emitAsync(
    RenderRootTypesEvents.BEFORE_RENDER,
    beforeRenderRootTypesEvent,
  );

  const pages = await Promise.all(
    Object.keys(rootTypes).map(async (name) => {
      const typeName = name as SchemaEntity;
      return renderer.renderRootTypes(typeName, rootTypes[typeName]);
    }),
  );

  const afterRenderRootTypesEvent = new RenderRootTypesEvent({
    rootTypes,
  });
  await events.emitAsync(
    RenderRootTypesEvents.AFTER_RENDER,
    afterRenderRootTypesEvent,
  );

  const beforeRenderHomepageEvent = new RenderHomepageEvent({
    outputDir,
  });
  await events.emitAsync(
    RenderHomepageEvents.BEFORE_RENDER,
    beforeRenderHomepageEvent,
  );

  await renderer.renderHomepage(homepageLocation);

  const afterRenderHomepageEvent = new RenderHomepageEvent({
    outputDir,
  });
  await events.emitAsync(
    RenderHomepageEvents.AFTER_RENDER,
    afterRenderHomepageEvent,
  );

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
