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
  IPrinter,
  Maybe,
  PrinterConfig,
  PrinterEventEmitter,
  PrinterOptions,
} from "@graphql-markdown/types";
import { Printer } from "@graphql-markdown/printer-legacy";

/**
 * Loads and initializes a printer module for GraphQL schema documentation.
 *
 * This function resolves the specified printer module and initializes it
 * with the provided configuration and options. The printer is responsible for rendering
 * GraphQL schema documentation in the desired format.
 *
 * @param config - Configuration for the printer including schema, baseURL, and linkRoot
 * @param options - Additional options for customizing the printer's behavior
 * @param formatter - Optional formatter functions for customizing output format (e.g., MDX)
 *
 * @returns A promise that resolves to the initialized Printer instance
 *
 * @throws Will throw an error if config is not provided
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
 *   {
 *     schema,
 *     baseURL: '/docs',
 *     linkRoot: 'graphql'
 *   },
 *   {
 *     printTypeOptions: { deprecated: 'group' }
 *   }
 * );
 *
 * const queryType = schema.getQueryType();
 * if (queryType) {
 *   const output = await printer.printType('Query', queryType);
 * }
 * ```
 */
export const getPrinter = async (
  config?: Maybe<PrinterConfig>,
  options?: Maybe<PrinterOptions>,
  formatter?: Partial<Formatter>,
  mdxDeclaration?: Maybe<string>,
  eventEmitter?: Maybe<PrinterEventEmitter>,
): Promise<typeof IPrinter> => {
  if (!config) {
    throw new Error("Invalid printer config.");
  }

  const { schema, baseURL, linkRoot } = config;
  await Printer.init(
    schema,
    baseURL,
    linkRoot,
    options ?? undefined,
    formatter,
    mdxDeclaration,
    eventEmitter,
  );

  return Printer;
};
