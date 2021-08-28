const snapshotOS = require("os").platform() === 'win32' ? '.windows' : '.unix'
const snapshotsFolder = "__snapshots__/";

module.exports = {
  testPathForConsistencyCheck: 'some/tests/example.test.js',

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/(\w+)\.(test|spec)\.([tj]sx?)/, `${snapshotsFolder}$1.$2.$3${snapshotOS}${snapshotExtension}`),

  resolveTestPath: (snapshotFilePath, snapshotExtension) => 
    snapshotFilePath
        .replace(`__snapshots__/`, '')
        .replace(`${snapshotOS}${snapshotExtension}`, ''),

};