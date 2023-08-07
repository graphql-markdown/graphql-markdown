import Logger from "../../src/logger";

describe("logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    global.logger = undefined;
  });

  describe("setInstance()", () => {
    test("returns a NodeJS.console object is no module passed", async () => {
      expect.hasAssertions();

      jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      expect(Logger.setInstance().info()).toBe("Mocked Console");
    });

    test("returns logger with aliased methods", () => {
      expect.hasAssertions();

      expect(Logger.setInstance()).toEqual(
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

      const logger = Logger.setInstance(
        require.resolve("../__data__/dummy_logger"),
      );

      expect(logger.info()).toBe("Dummy logger");
    });
  });

  describe("getInstance()", () => {
    test("returns module passed as logger", () => {
      expect.hasAssertions();

      Logger.setInstance(require.resolve("../__data__/dummy_logger"));

      expect(Logger.getInstance().info()).toBe("Dummy logger");
    });

    test("returns a NodeJS.console object if not logger set", () => {
      expect.hasAssertions();

      jest
        .spyOn(global.console, "info")
        .mockImplementation(() => "Mocked Console");

      expect(Logger.getInstance().info()).toBe("Mocked Console");
    });
  });
});
