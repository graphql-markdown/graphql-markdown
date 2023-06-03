const { getPrinter } = require("../../src/printer");

describe("generator", () => {
  describe("getPrinter()", () => {
    test("returns Printer object for @graphql-markdown/printer-legacy", () => {
      expect.assertions(1);
      const printer = getPrinter(
        "@graphql-markdown/printer-legacy",
        {
          schema: {},
          baseURL: "/",
          linkRoot: "root",
        },
        {
          groups: {},
          printTypeOptions: {},
        },
      );
      expect(printer).toBeDefined();
    });

    test("throws exception if no printer module set", () => {
      expect.assertions(1);

      expect(() => {
        getPrinter(
          undefined,
          {
            schema: {},
            baseURL: "/",
            linkRoot: "root",
          },
          {
            groups: {},
            printTypeOptions: {},
          },
        );
      }).toThrow(`Invalid printer module name in "printTypeOptions" settings.`);
    });

    test("throws exception if no printer module not found", () => {
      expect.assertions(1);

      expect(() => {
        getPrinter(
          "foobar",
          {
            schema: {},
            baseURL: "/",
            linkRoot: "root",
          },
          {
            groups: {},
            printTypeOptions: {},
          },
        );
      }).toThrow(
        `Cannot find module 'foobar' for @graphql-markdown/core in "printTypeOptions" settings.`,
      );
    });
  });
});
