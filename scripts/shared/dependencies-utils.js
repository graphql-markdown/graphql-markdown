const { chdir } = require("node:process");
const { readdirSync } = require("node:fs");
chdir(__dirname);

const rootDir = "../..";
const {
  workspaces: [packages],
} = require(`${rootDir}/package.json`);

const getWorkspacePackagesMap = () => {
  const packagesPath = `${rootDir}/${packages.slice(0, -2)}`;
  const map = {};
  const folders = readdirSync(packagesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  folders.forEach((packageFolder) => {
    const packageJson = `${packagesPath}/${packageFolder}/package.json`;
    const { name, version, dependencies, peerDependencies } = require(packageJson);

    Object.assign(map, {
      [name]: {
        version,
        dependencies,
        peerDependencies,
      },
    });
  });
  return map;
};

module.exports = { getWorkspacePackagesMap };
