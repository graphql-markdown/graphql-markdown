// Logger with default export (e.g., @docusaurus/logger pattern)
module.exports = {
  default: {
    debug: () => "Debug via default",
    error: () => "Error via default",
    info: () => "Info via default",
    log: () => "Log via default",
    warn: () => "Warn via default",
  },
};
