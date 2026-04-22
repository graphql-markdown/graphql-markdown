/**
 * Printer loader helpers for bootstrapping GraphQL-Markdown renderers.
 *
 * @packageDocumentation
 */
/**
 * @module printer
 *
 * This module provides the functionality to load and initialize a printer for GraphQL schema documentation.
 * It resolves a supported printer module and configures it with the provided schema and options.
 */
import type {
  Formatter,
  Maybe,
  PackageName,
  Printer,
  PrinterConfig,
  PrinterEventEmitter,
  PrinterOptions,
} from "@graphql-markdown/types";
import { Printer as LegacyPrinter } from "@graphql-markdown/printer-legacy";

const PRINTER_LEGACY_PACKAGE = "@graphql-markdown/printer-legacy";

/**
 * Loads and initializes a printer module for GraphQL schema documentation.
 *
 * This function resolves the specified printer module and initializes it
 * with the provided configuration and options. The printer is responsible for rendering
 * GraphQL schema documentation in the desired format.
 *
 * @param printerModule - The name/path of the printer module to load
 * @param config - Configuration for the printer including schema, baseURL, and linkRoot
 * @param options - Additional options for customizing the printer's behavior
 * @param formatter - Optional formatter functions for customizing output format (e.g., MDX)
 *
 * @returns A promise that resolves to the initialized Printer instance
 *
 * @throws Will throw an error if printerModule is not a string
 * @throws Will throw an error if config is not provided
 * @throws Will throw an error if printerModule is not supported
 *
 * @example
 * ```typescript
 * import { getPrinter } from '@graphql-markdown/core';
 * import { buildSchema } from 'graphql';
 *
 * const schema = buildSchema(`
 *   type Query {
 *     hello: String
 *   }
 * `);
 *
 * const printer = await getPrinter(
 *   '@graphql-markdown/printer-legacy',
 *   {
 *     schema,
 *     baseURL: '/docs',
 *     linkRoot: 'graphql'
 *   },
 *   {
 *     printTypeOptions: { includeDeprecationReasons: true }
 *   }
 * );
 *
 * const output = printer.printSchema();
 * ```
 */
export const getPrinter = async (
  printerModule?: Maybe<PackageName>,
  config?: Maybe<PrinterConfig>,
  options?: Maybe<PrinterOptions>,
  formatter?: Partial<Formatter>,
  mdxDeclaration?: Maybe<string>,
  eventEmitter?: Maybe<PrinterEventEmitter>,
): Promise<Printer> => {
  if (typeof printerModule !== "string") {
    throw new TypeError("Invalid printer module name.");
  }

  if (!config) {
    throw new Error("Invalid printer config.");
  }

  if (printerModule !== PRINTER_LEGACY_PACKAGE) {
    throw new Error(`Unsupported printer module '${printerModule}'.`);
  }

  const printer = LegacyPrinter as unknown as Printer;
  const normalizedOptions = options ?? undefined;

  const { schema, baseURL, linkRoot } = config;
  await printer.init(
    schema,
    baseURL,
    linkRoot,
    normalizedOptions,
    formatter,
    mdxDeclaration,
    eventEmitter,
  );

  return printer;
};
