/* eslint-disable @typescript-eslint/no-var-requires, no-var */

import type { LoggerType } from "@graphql-markdown/types";

declare global {
  var logger: LoggerType | undefined;
}

export const Logger = {
  setInstance: (module?: string): LoggerType => {
    if (typeof module !== "string") {
      global.logger = global.console as unknown as LoggerType;
    } else {
      global.logger = require(module) as unknown as LoggerType;
    }

    if (typeof global.logger.log === "undefined") {
      global.logger.log = global.logger.info;
    }

    if (typeof global.logger.success === "undefined") {
      global.logger.success = global.logger.info;
    }

    if (typeof global.logger.debug === "undefined") {
      global.logger.debug = global.logger.info;
    }

    return global.logger;
  },
  getInstance: (module?: string): LoggerType => {
    if (typeof global.logger === "undefined") {
      return Logger.setInstance(module);
    }
    return global.logger;
  },
};

export default Logger;
