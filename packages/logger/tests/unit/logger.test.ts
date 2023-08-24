import { Logger, log } from "../../src";

describe("logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    global.logger = undefined;
  });

  describe("Logger()", () => {
    test("returns a NodeJS.console object is no module passed", async () => {
      expect.hasAssertions();

      const spy = jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      log("test");

      expect(spy).toHaveLastReturnedWith("Mocked Console");
      expect(global.logger).toBeDefined();
    });

    test.each([[undefined], [""]])(
      "returns a NodeJS.console object is module is '%s'",
      async (moduleName) => {
        expect.hasAssertions();

        const spy = jest
          .spyOn(global.console, "info")
          .mockImplementation(() => "Mocked Console");

        Logger(moduleName);
        log("test");

        expect(spy).toHaveLastReturnedWith("Mocked Console");
        expect(global.logger).toBeDefined();
      },
    );

    test("instantiates a logger", () => {
      expect.hasAssertions();

      Logger();

      expect(global.logger?.instance).toEqual(
        expect.objectContaining({
          debug: expect.any(Function),
          error: expect.any(Function),
          info: expect.any(Function),
          log: expect.any(Function),
          warn: expect.any(Function),
        }),
      );
    });

    test("returns module passed", () => {
      expect.hasAssertions();

      Logger(require.resolve("../__data__/dummy_logger"));

      expect(global.logger).toBeDefined();
      expect(global.logger?.instance).toEqual(
        expect.objectContaining({
          info: expect.any(Function),
        }),
      );
    });

    test("overrides current logger", async () => {
      expect.hasAssertions();

      const spyConsole = jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      Logger();
      expect(global.logger).toBeDefined();

      Logger(require.resolve("../__data__/dummy_logger"));

      const spyLogger = jest.spyOn(global.logger!, "_log");

      log("test");

      expect(spyConsole).not.toHaveBeenCalled();
      expect(spyLogger).toHaveBeenCalledWith("test", "info");
    });
  });
});
