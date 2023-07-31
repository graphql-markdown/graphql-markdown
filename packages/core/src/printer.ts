import type { GraphQLSchema } from "graphql/type/schema";

import type { DirectiveName, CustomDirectiveMap, PackageName } from "@graphql-markdown/utils";

import type { ConfigPrintTypeOptions, TypeDeprecatedOption } from "./config";

export interface Printer {
  init: (schema: GraphQLSchema, baseURL: string, linkRoot: string, options: PrinterOptions) => void
  printHeader: (id: string, title: string, options: PrinterOptions) => string
  printDescription: (type: unknown, options: PrinterOptions, noText: string) => string
  printCode: (type: unknown, options: PrinterOptions) => string
  printCustomDirectives: (type: unknown, options: PrinterOptions) => string
  printCustomTags: (type: unknown, options: PrinterOptions) => string
  printTypeMetadata: (type: unknown, options: PrinterOptions) => string
  printRelations: (type: unknown, options: PrinterOptions) => string
  printType: (name: string, type: unknown, options: PrinterOptions) => string
}

export type PrinterConfig = {
  schema: GraphQLSchema
  baseURL: string
  linkRoot: string
}

export type PrinterOptions = {
  groups?: Record<string, any>,
  printTypeOptions?: ConfigPrintTypeOptions
  skipDocDirective?: DirectiveName[]
  customDirectives?: CustomDirectiveMap,
  deprecated?: TypeDeprecatedOption
}

export const getPrinter = async (printerModule?: PackageName, config?: PrinterConfig, options?: PrinterOptions): Promise<Printer> => {
  let Printer: Printer;

  if (typeof printerModule !== "string") {
    throw new Error(
      'Invalid printer module name in "printTypeOptions" settings.',
    );
  }

  if (typeof config === "undefined") {
    throw new Error(
      'Invalid printer config in "printTypeOptions" settings.',
    );
  }

  try {
    Printer = await import (printerModule);
  } catch (error) {
    throw new Error(
      `Cannot find module '${printerModule}' for @graphql-markdown/core in "printTypeOptions" settings.`,
    );
  }

  const { schema, baseURL, linkRoot } = config;
  Printer.init(schema, baseURL, linkRoot, { ...options });

  return Printer;
};
