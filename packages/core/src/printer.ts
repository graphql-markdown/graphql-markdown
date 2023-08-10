import type {
  IPrinter,
  Maybe,
  PackageName,
  Printer,
  PrinterConfig,
  PrinterOptions,
} from "@graphql-markdown/types";

export const getPrinter = async (
  printerModule?: Maybe<PackageName>,
  config?: Maybe<PrinterConfig>,
  options?: Maybe<PrinterOptions>,
): Promise<Printer> => {
  if (typeof printerModule !== "string") {
    throw new Error(
      'Invalid printer module name in "printTypeOptions" settings.',
    );
  }

  if (!config) {
    throw new Error('Invalid printer config in "printTypeOptions" settings.');
  }

  try {
    const { Printer }: { Printer: typeof IPrinter } = await import(
      printerModule
    );

    const { schema, baseURL, linkRoot } = config;
    Printer.init(schema, baseURL, linkRoot, { ...options });

    return Printer;
  } catch (error: unknown) {
    throw new Error(
      `Cannot find module '${printerModule}' defined in "printTypeOptions" settings.`,
    );
  }
};
