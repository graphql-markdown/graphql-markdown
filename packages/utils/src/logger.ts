/* eslint-disable @typescript-eslint/no-var-requires, no-var */

import type { LoggerType, Maybe } from "@graphql-markdown/types";

declare global {
  var logger: Maybe<LoggerType>;
}

export const Logger = {
  setInstance: (module?: string): LoggerType => {
    if (typeof module !== "string") {
      global.logger = global.console as unknown as LoggerType;
    } else {
      global.logger = require(module) as unknown as LoggerType;
    }

    if (typeof global.logger.log === "undefined") {
      global.logger.log = (...args: unknown[]) =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.success === "undefined") {
      global.logger.success = (...args: unknown[]) =>
        global.logger!.info.apply(null, args);
    }

    if (typeof global.logger.debug === "undefined") {
      global.logger.debug = (...args: unknown[]) =>
        global.logger!.info.apply(null, args);
    }

    return global.logger;
  },
  getInstance: (module?: string): LoggerType => {
    if (typeof global.logger === "undefined" || logger === null) {
      return Logger.setInstance(module);
    }
    return global.logger as LoggerType;
  },
};

export default Logger;
