const getPrinter = (printerModule, config, options) => {
  let Printer = undefined;

  if (typeof printerModule !== "string") {
    throw new Error(
      'Invalid printer module name in "printTypeOptions" settings.',
    );
  }

  try {
    Printer = require(printerModule);
  } catch (error) {
    throw new Error(
      `Cannot find module '${printerModule}' for @graphql-markdown/core in "printTypeOptions" settings.`,
    );
  }

  const { schema, baseURL, linkRoot } = config;
  Printer.init(schema, baseURL, linkRoot, { ...options });

  return Printer;
};

module.exports = { getPrinter };
