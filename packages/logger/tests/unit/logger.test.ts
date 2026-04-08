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

  describe("hasLogMethod()", () => {
    test("returns true for object with log method", () => {
      expect.hasAssertions();

      const loggerObj = {
        info: () => {
          return "info";
        },
      };

      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.info)).toBe(true);
    });

    test("returns false for object without log method", () => {
      expect.hasAssertions();

      const loggerObj = {
        debug: () => {
          return "debug";
        },
      };

      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.info)).toBe(false);
    });

    test("returns false for null or non-object", () => {
      expect.hasAssertions();

      expect(Logger.hasLogMethod(null, Logger.LogLevel.info)).toBe(false);
      expect(Logger.hasLogMethod(undefined, Logger.LogLevel.info)).toBe(false);
      expect(Logger.hasLogMethod("string", Logger.LogLevel.info)).toBe(false);
      expect(Logger.hasLogMethod(123, Logger.LogLevel.info)).toBe(false);
    });

    test("works with each log level", () => {
      expect.hasAssertions();

      const loggerObj = {
        debug: () => {
          return "debug";
        },
        error: () => {
          return "error";
        },
        info: () => {
          return "info";
        },
        log: () => {
          return "log";
        },
        success: () => {
          return "success";
        },
        warn: () => {
          return "warn";
        },
      };

      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.debug)).toBe(true);
      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.error)).toBe(true);
      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.info)).toBe(true);
      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.log)).toBe(true);
      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.success)).toBe(
        true,
      );
      expect(Logger.hasLogMethod(loggerObj, Logger.LogLevel.warn)).toBe(true);
    });

    test("works with string log level names", () => {
      expect.hasAssertions();

      const loggerObj = {
        info: () => {
          return "info";
        },
      };

      expect(Logger.hasLogMethod(loggerObj, "info")).toBe(true);
      expect(Logger.hasLogMethod(loggerObj, "error")).toBe(false);
    });
  });

  describe("resolveLoggerInstance()", () => {
    test("returns direct logger instance", () => {
      expect.hasAssertions();

      const loggerObj = {
        info: () => {
          return "info";
        },
      };

      const resolved = Logger.resolveLoggerInstance(loggerObj);

      expect(resolved).toEqual(loggerObj);
    });

    test("returns undefined for object without log methods", () => {
      expect.hasAssertions();

      const obj = { foo: "bar" };

      const resolved = Logger.resolveLoggerInstance(obj);

      expect(resolved).toBeUndefined();
    });

    test("resolves default export pattern", () => {
      expect.hasAssertions();

      // Simulate default export pattern: { default: { info: fn, ... } }
      const simulatedDefaultExport = {
        default: {
          debug: () => {
            return "Debug via default";
          },
          error: () => {
            return "Error via default";
          },
          info: () => {
            return "Info via default";
          },
          log: () => {
            return "Log via default";
          },
          warn: () => {
            return "Warn via default";
          },
        },
      };

      const resolved = Logger.resolveLoggerInstance(simulatedDefaultExport);

      expect(resolved).toEqual(simulatedDefaultExport.default);
      expect(resolved).toHaveProperty("info");
      expect(typeof resolved?.info).toBe("function");
    });

    test("resolves named logger export pattern", () => {
      expect.hasAssertions();

      // Simulate named logger export pattern: { logger: { info: fn, ... } }
      const simulatedNamedExport = {
        logger: {
          debug: () => {
            return "Debug via logger";
          },
          error: () => {
            return "Error via logger";
          },
          info: () => {
            return "Info via logger";
          },
          log: () => {
            return "Log via logger";
          },
          warn: () => {
            return "Warn via logger";
          },
        },
      };

      const resolved = Logger.resolveLoggerInstance(simulatedNamedExport);

      expect(resolved).toEqual(simulatedNamedExport.logger);
      expect(resolved).toHaveProperty("info");
      expect(typeof resolved?.info).toBe("function");
    });

    test("returns undefined for null or non-object", () => {
      expect.hasAssertions();

      expect(Logger.resolveLoggerInstance(null)).toBeUndefined();
      expect(Logger.resolveLoggerInstance(undefined)).toBeUndefined();
      expect(Logger.resolveLoggerInstance("string")).toBeUndefined();
      expect(Logger.resolveLoggerInstance(123)).toBeUndefined();
    });

    test("resolves incomplete logger (with some methods)", () => {
      expect.hasAssertions();

      // Incomplete logger with only some methods
      const incompleteLogger = {
        info: () => {
          return "Incomplete info";
        },
        warn: () => {
          return "Incomplete warn";
        },
      };

      const resolved = Logger.resolveLoggerInstance(incompleteLogger);

      expect(resolved).toEqual(incompleteLogger);
      expect(resolved).toHaveProperty("info");
      expect(resolved).toHaveProperty("warn");
    });

    test("prioritizes direct instance over nested patterns", () => {
      expect.hasAssertions();

      // Module with both direct methods and nested default export
      const nestedModule = {
        info: () => {
          return "direct";
        },
        default: {
          info: () => {
            return "default";
          },
        },
      };

      const resolved = Logger.resolveLoggerInstance(nestedModule);

      // Should resolve to the module itself (which has the direct methods)
      expect(resolved?.info()).toBe("direct");
      // And should not resolve to the default export
      expect(resolved).not.toEqual(nestedModule.default);
    });
  });
});
