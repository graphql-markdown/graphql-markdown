const Logger = {
  setInstance: (module) => {
    if (typeof module !== "string") {
      global.logger = global.console;
    } else {
      global.logger = require(module);
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
  getInstance: (module) => {
    if (typeof global.logger === "undefined") {
      return Logger.setInstance(module);
    }
    return global.logger;
  },
};

module.exports = Logger;
