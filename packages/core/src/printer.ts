import type {
  DirectiveName,
  CustomDirectiveMap,
  PackageName,
  SchemaEntitiesGroupMap,
  GraphQLSchema,
} from "@graphql-markdown/utils";

import type { ConfigPrintTypeOptions, TypeDeprecatedOption } from "./config";

export interface IPrinter {
  init(
    schema: GraphQLSchema,
    baseURL: string,
    linkRoot: string,
    options: PrinterOptions,
  ): void;
  printHeader(
    id: string,
    title: string,
    options: PrinterOptions & PrinterConfig,
  ): string;
  printDescription(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
    noText: string,
  ): string;
  printCode(type: unknown, options: PrinterOptions & PrinterConfig): string;
  printCustomDirectives(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  printCustomTags(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  printTypeMetadata(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  printRelations(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  printType(
    name: string,
    type: unknown,
    options: Partial<PrinterOptions & PrinterConfig>,
  ): string;
}

export type PrinterConfig = {
  schema: GraphQLSchema;
  baseURL: string;
  linkRoot: string;
};

export type PrinterOptions = {
  customDirectives?: CustomDirectiveMap;
  deprecated?: TypeDeprecatedOption;
  groups?: SchemaEntitiesGroupMap;
  printTypeOptions?: ConfigPrintTypeOptions;
  skipDocDirective?: DirectiveName[];
};

export const getPrinter = async (
  printerModule?: PackageName,
  config?: PrinterConfig,
  options?: PrinterOptions,
): Promise<IPrinter> => {
  if (typeof printerModule !== "string") {
    throw new Error(
      'Invalid printer module name in "printTypeOptions" settings.',
    );
  }

  if (typeof config === "undefined") {
    throw new Error('Invalid printer config in "printTypeOptions" settings.');
  }

  try {
    const Printer = await import(printerModule);

    const { schema, baseURL, linkRoot } = config;
    Printer.init(schema, baseURL, linkRoot, { ...options });

    return Printer;
  } catch (error) {
    throw new Error(
      `Cannot find module '${printerModule}' defined in "printTypeOptions" settings.`,
    );
  }
};
