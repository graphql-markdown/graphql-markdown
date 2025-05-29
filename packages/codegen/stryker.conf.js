module.exports = {
  mutate: ["src/**/*.ts", "!src/**/*.d.ts"],
  testRunner: "jest",
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "off",
};
