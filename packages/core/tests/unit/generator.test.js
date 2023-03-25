const { hasChanges, getPrinter } = require("../../src/generator");

describe("generator", () => {
  describe("hasChanges()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test.each([[undefined], [null]])(
      "returns true if diffMethod not set",
      async (value) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(console, "warn");

        await expect(hasChanges({}, "", value)).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test.each([[undefined], [null]])(
      "returns true if diffModule not set",
      async (value) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(console, "warn");

        await expect(hasChanges({}, "", "NONE", value)).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test("returns true if diff module package not resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");

      await expect(hasChanges({}, "", "NONE", "foobar")).resolves.toBeTruthy();
      expect(logSpy).toHaveBeenCalledWith(
        "Cannot find module 'foobar' from @graphql-markdown/core!",
      );
    });

    test("returns boolean if diff module package resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");

      const result = await hasChanges({}, "", "FORCE");

      expect(typeof result === "boolean").toBeTruthy();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe("getPrinter()", () => {
    test("returns Printer object for @graphql-markdown/printer-legacy", () => {
      expect.assertions(1);
      const printer = getPrinter(
        {},
        "/",
        "root",
        {},
        {},
        "@graphql-markdown/printer-legacy",
      );
      expect(printer).toBeDefined();
    });

    test("throws exception if no printer module set", () => {
      expect.assertions(1);

      expect(() => {
        getPrinter({}, "/", "root", {}, {}, undefined);
      }).toThrow(`Invalid printer module name in "printTypeOptions" settings.`);
    });

    test("throws exception if no printer module not found", () => {
      expect.assertions(1);

      expect(() => {
        getPrinter({}, "/", "root", {}, {}, "foobar");
      }).toThrow(
        `Cannot find module 'foobar' for @graphql-markdown/core in "printTypeOptions" settings.`,
      );
    });
  });
});
