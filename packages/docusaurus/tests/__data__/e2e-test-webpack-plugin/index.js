/* eslint-disable no-unused-vars */
module.exports = function (_context, _options) {
  return {
    name: "e2e-test-webpack-plugin",
    configureWebpack(_config, _isServer) {
      return {
        plugins: [
          {
            apply: (_compiler) => {
              const originalStderrWrite = process.stderr.write;
              process.stderr.write = function (chunk, ...args) {
                if (
                  typeof chunk === "string" &&
                  chunk.includes("webpack.cache.PackFileCacheStrategy")
                ) {
                  return true; // Suppress this message
                }
                return originalStderrWrite.apply(this, [chunk, ...args]);
              };
            },
          },
        ],
      };
    },
  };
};
