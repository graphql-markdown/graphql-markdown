import type { GraphQLSchema } from "graphql/type/schema";

import type { DirectiveName, CustomDirectiveMap, PackageName } from "@graphql-markdown/utils";

import type { ConfigPrintTypeOptions, TypeDeprecatedOption } from "./config";

export abstract class IPrinter {
  abstract init(schema: GraphQLSchema, baseURL: string, linkRoot: string, options: PrinterOptions): void
  abstract printHeader(id: string, title: string, options: PrinterOptions): string
  abstract printDescription(type: unknown, options: PrinterOptions, noText: string): string
  abstract printCode(type: unknown, options: PrinterOptions): string
  abstract printCustomDirectives(type: unknown, options: PrinterOptions): string
  abstract printCustomTags(type: unknown, options: PrinterOptions): string
  abstract printTypeMetadata(type: unknown, options: PrinterOptions): string
  abstract printRelations(type: unknown, options: PrinterOptions): string
  abstract printType(name: string, type: unknown, options: PrinterOptions): string
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

export const getPrinter = async (printerModule?: PackageName, config?: PrinterConfig, options?: PrinterOptions): Promise<IPrinter> => {
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
    const Printer = await import(printerModule);

    const { schema, baseURL, linkRoot } = config;
    Printer.init(schema, baseURL, linkRoot, { ...options });

    return Printer;
  } catch(error) {
    throw new Error(
      `Cannot find module '${printerModule}' defined in "printTypeOptions" settings.`,
    );
  }

}
