describe("logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    global.logger = undefined;
  });

  describe("setInstance()", () => {
    test("returns a NodeJS.console object is no module passed", () => {
      expect.hasAssertions();

      jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      const Logger = require("../../src/logger").setInstance();

      expect(Logger.info()).toBe("Mocked Console");
    });

    test("returns logger with aliased methods", () => {
      expect.hasAssertions();

      const Logger = require("../../src/logger").setInstance();

      expect(Logger).toEqual(
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

      const Logger = require("../../src/logger").setInstance(
        require.resolve("../__data__/dummy_logger"),
      );

      expect(Logger.info()).toBe("Dummy logger");
    });
  });

  describe("getInstance()", () => {
    test("returns module passed as logger", () => {
      expect.hasAssertions();

      const Logger = require("../../src/logger");
      Logger.setInstance(require.resolve("../__data__/dummy_logger"));

      expect(Logger.getInstance().info()).toBe("Dummy logger");
    });

    test("returns a NodeJS.console object if not logger set", () => {
      expect.hasAssertions();

      jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      const Logger = require("../../src/logger");

      expect(Logger.getInstance().info()).toBe("Mocked Console");
    });
  });
});
