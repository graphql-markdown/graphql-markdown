const { chdir } = require("node:process");
chdir(__dirname);

const rootDir = "../..";
const { peerDependencies: packages } = require(`${rootDir}/package.json`);

const getWorkspacePackagesMap = (orgName) => {
  const map = {};
  Object.entries(packages).forEach(([packageName, packagePath]) => {
    if (!packageName.startsWith(orgName)) {
      return;
    }

    const packageJson =
      packagePath.replace("file:", `${rootDir}/`) + "/package.json";
    const { version, dependencies, peerDependencies } = require(packageJson);

    Object.assign(map, {
      [packageName]: {
        version,
        dependencies,
        peerDependencies,
      },
    });
  });
  return map;
};

module.exports = { getWorkspacePackagesMap };
