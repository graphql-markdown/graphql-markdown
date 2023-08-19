import Logger from "../../src";

describe("logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    global.logger = undefined;
  });

  describe("Logger()", () => {
    test("returns a NodeJS.console object is no module passed", async () => {
      expect.hasAssertions();

      jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      expect(Logger().info()).toBe("Mocked Console");
    });

    test.each([[undefined], [""]])(
      "returns a NodeJS.console object is module is '%s'",
      async (moduleName) => {
        expect.hasAssertions();

        jest
          .spyOn(global.console, "info")
          .mockImplementation(() => "Mocked Console");

        expect(Logger(moduleName).info()).toBe("Mocked Console");
      },
    );

    test("returns logger with aliased methods", () => {
      expect.hasAssertions();

      expect(Logger()).toEqual(
        expect.objectContaining({
          debug: expect.any(Function),
          error: expect.any(Function),
          info: expect.any(Function),
          log: expect.any(Function),
          success: expect.any(Function),
          warn: expect.any(Function),
        }),
      );
    });

    test("returns module passed as logger", () => {
      expect.hasAssertions();

      const logger = Logger(require.resolve("../__data__/dummy_logger"));

      expect(logger.info()).toBe("Dummy logger");

      expect(logger).toEqual(
        expect.objectContaining({
          debug: expect.any(Function),
          error: expect.any(Function),
          info: expect.any(Function),
          log: expect.any(Function),
          success: expect.any(Function),
          warn: expect.any(Function),
        }),
      );
    });
  });
});
