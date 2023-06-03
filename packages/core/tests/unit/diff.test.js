const { hasChanges } = require("../../src/diff");

describe("diff", () => {
  describe("hasChanges()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test.each([[undefined], [null]])(
      "returns true if diffMethod not set",
      async (value) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(global.logger, "warn");

        await expect(hasChanges({}, "", value)).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test.each([[undefined], [null]])(
      "returns true if diffModule not set",
      async (value) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(global.logger, "warn");

        await expect(hasChanges({}, "", "NONE", value)).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test("returns true if diff module package not resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(global.logger, "warn");

      await expect(hasChanges({}, "", "NONE", "foobar")).resolves.toBeTruthy();
      expect(logSpy).toHaveBeenCalledWith(
        "Cannot find module 'foobar' from @graphql-markdown/core!",
      );
    });

    test("returns boolean if diff module package resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(global.logger, "warn");

      const result = await hasChanges({}, "", "FORCE");

      expect(typeof result === "boolean").toBeTruthy();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
