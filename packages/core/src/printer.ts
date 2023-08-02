import {
  IPrinter,
  PackageName,
  PrinterConfig,
  PrinterOptions,
} from "@graphql-markdown/types";

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
  } catch (error: unknown) {
    throw new Error(
      `Cannot find module '${printerModule}' defined in "printTypeOptions" settings.`,
    );
  }
};
