const snapshotOS = require("os").platform() === "win32" ? "windows" : "unix";
const snapshotsFolder = `__snapshots__/${snapshotOS}/`;

module.exports = {
  testPathForConsistencyCheck: "some/tests/example.test.js",

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(
      /(\w+)\.(test|spec)\.([tj]sx?)/,
      `${snapshotsFolder}$1.$2.$3${snapshotExtension}`,
    ),

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace(snapshotsFolder, "")
      .replace(snapshotExtension, ""),
};
