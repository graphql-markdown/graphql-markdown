/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, no-var */

import type { LoggerType, Maybe } from "@graphql-markdown/types";

declare global {
  var logger: Maybe<LoggerType>;
}

export const Logger = {
  setInstance: (moduleName?: string): LoggerType => {
    if (typeof moduleName !== "string" || moduleName === "") {
      global.logger = global.console as unknown as LoggerType;
    } else {
      global.logger = require(moduleName) as unknown as LoggerType;
    }

    if (typeof global.logger.log === "undefined") {
      global.logger.log = (...args: unknown[]): void =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.success === "undefined") {
      global.logger.success = (...args: unknown[]): void =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.debug === "undefined") {
      global.logger.debug = (...args: unknown[]): void =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.warn === "undefined") {
      global.logger.warn = (...args: unknown[]): void =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.error === "undefined") {
      global.logger.error = (...args: unknown[]): void =>
        global.logger!.info.apply(null, args);
    }

    return global.logger;
  },
  getInstance: (moduleName?: string): LoggerType => {
    if (!global.logger) {
      return Logger.setInstance(moduleName);
    }
    return global.logger;
  },
};

export default Logger;
