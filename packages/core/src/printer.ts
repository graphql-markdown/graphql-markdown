/**
 * @module printer
 *
 * This module provides the functionality to load and initialize a printer for GraphQL schema documentation.
 * It dynamically imports a printer module and configures it with the provided schema and options.
 */
import type {
  IPrinter,
  Maybe,
  PackageName,
  Printer,
  PrinterConfig,
  PrinterOptions,
} from "@graphql-markdown/types";

/**
 * Loads and initializes a printer module for GraphQL schema documentation.
 *
 * This function dynamically imports the specified printer module and initializes it
 * with the provided configuration and options. The printer is responsible for rendering
 * GraphQL schema documentation in the desired format.
 *
 * @param printerModule - The name/path of the printer module to load
 * @param config - Configuration for the printer including schema, baseURL, and linkRoot
 * @param options - Additional options for customizing the printer's behavior
 * @param mdxModule - Optional MDX module for MDX-specific functionality
 *
 * @returns A promise that resolves to the initialized Printer instance
 *
 * @throws Will throw an error if printerModule is not a string
 * @throws Will throw an error if config is not provided
 * @throws Will throw an error if the module specified by printerModule cannot be found
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
  mdxModule?: unknown,
): Promise<Printer> => {
  if (typeof printerModule !== "string") {
    throw new TypeError("Invalid printer module name.");
  }

  if (!config) {
    throw new Error("Invalid printer config.");
  }

  try {
    const { Printer }: { Printer: typeof IPrinter } = await import(
      printerModule
    );

    const { schema, baseURL, linkRoot } = config;
    await Printer.init(schema, baseURL, linkRoot, { ...options }, mdxModule);

    return Printer;
  } catch {
    throw new Error(`Cannot find module '${printerModule}'.`);
  }
};
