import { beforeAll, describe, expect, test } from "vitest";

import Logger, { log } from "../../src";

const MESSAGE_COUNT = 100;

// Discards messages so the benchmark measures dispatching rather than output.
const memoryLogger = {
  info: (): void => {},
  warn: (): void => {},
};

describe("@graphql-markdown/logger", () => {
  beforeAll(async () => {
    await Logger(memoryLogger);
  });

  test("log", async ({ bench }) => {
    expect(() => {
      log("Generating documentation page", "info");
    }).not.toThrow();

    await bench.compare(
      bench("log 100 info messages", () => {
        for (let index = 0; index < MESSAGE_COUNT; index++) {
          log("Generating documentation page", "info");
        }
      }),
      // `error` is not implemented by the logger, so it falls back to `info`.
      bench("log 100 messages with fallback level", () => {
        for (let index = 0; index < MESSAGE_COUNT; index++) {
          log("Generating documentation page", "error");
        }
      }),
    );
  });

  test("Logger", async ({ bench }) => {
    await expect(Logger(memoryLogger)).resolves.toBeUndefined();

    await bench("Logger from module object", async () => {
      await Logger(memoryLogger);
    }).run();
  });
});
