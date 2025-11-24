/* eslint "no-control-regex": "off" */

import * as Logger from "../../src";

describe("logger", () => {
  beforeEach(() => {
    jest.spyOn(globalThis.console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    globalThis.logger = undefined;
  });

  describe("log()", () => {
    test("instantiates Logger", async () => {
      expect.hasAssertions();

      const spy = jest.spyOn(Logger, "Logger");

      expect(globalThis.logger).toBeUndefined();

      Logger.log("test");

      expect(spy).toHaveBeenCalled();
      expect(globalThis.logger).toBeDefined();
    });

    test("uses fallback log method if level not supported", async () => {
      expect.hasAssertions();

      const spy = jest.spyOn(globalThis.console, "info");

      Logger.log("test", "success");

      expect(spy).toHaveBeenCalledWith("test");
    });
  });

  describe("Logger()", () => {
    test("returns a NodeJS.console object is no module passed", async () => {
      expect.hasAssertions();

      const spy = jest
        .spyOn(globalThis.console, "info")
        .mockImplementation(() => {
          return "Mocked Console";
        });

      Logger.log("test");

      expect(spy).toHaveLastReturnedWith("Mocked Console");
      expect(globalThis.logger).toBeDefined();
    });

    test.each([[undefined], [""]])(
      "returns a NodeJS.console object is module is '%s'",
      async (moduleName) => {
        expect.hasAssertions();

        const spy = jest
          .spyOn(globalThis.console, "info")
          .mockImplementation(() => {
            return "Mocked Console";
          });

        await Logger.Logger(moduleName);
        Logger.log("test");

        expect(spy).toHaveBeenCalledWith("test");
        expect(spy).toHaveLastReturnedWith("Mocked Console");
        expect(globalThis.logger).toBeDefined();
      },
    );

    test("instantiates a logger", async () => {
      expect.hasAssertions();

      await Logger.Logger();

      expect(globalThis.logger?.instance).toEqual(
        expect.objectContaining({
          debug: expect.any(Function),
          error: expect.any(Function),
          info: expect.any(Function),
          log: expect.any(Function),
          warn: expect.any(Function),
        }),
      );
    });

    test("returns module passed", async () => {
      expect.hasAssertions();

      await Logger.Logger(require.resolve("../__data__/dummy_logger"));

      expect(globalThis.logger).toBeDefined();
      expect(globalThis.logger?.instance).toEqual(
        expect.objectContaining({
          info: expect.any(Function),
        }),
      );
    });

    test("overrides current logger", async () => {
      expect.hasAssertions();

      const spyConsole = jest
        .spyOn(globalThis.console, "info")
        .mockImplementation(() => {
          return "Mocked Console";
        });

      await Logger.Logger();
      expect(globalThis.logger).toBeDefined();

      await Logger.Logger(require.resolve("../__data__/dummy_logger"));

      const spyLogger = jest.spyOn(globalThis.logger!, "_log");

      Logger.log("test");

      expect(spyConsole).not.toHaveBeenCalled();
      expect(spyLogger).toHaveBeenCalledWith("test", "info");
    });

    test("overrides current logger with Docusaurus", async () => {
      expect.hasAssertions();

      const spyConsole = jest
        .spyOn(globalThis.console, "info")
        .mockImplementation(() => {
          return "Mocked Console";
        });

      await Logger.Logger("@docusaurus/logger");

      Logger.log("test");

      const outputNoColor = spyConsole.mock.lastCall![0].replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        "",
      );

      expect(outputNoColor).toBe("[INFO] test");
    });
  });
});
