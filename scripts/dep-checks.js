const process = require("node:process");

process.chdir(__dirname);

const rootDir = "..";

const { dependencies: packages } = require(`${rootDir}/package.json`);

const getWorkspacePackagesMap = () => {
  const map = {};
  Object.entries(packages).forEach(([packageName, packagePath]) => {
    const packageJson =
      packagePath.replace("file:", `${rootDir}/`) + "/package.json";
    const { version, dependencies, peerDependencies } = require(packageJson);

    Object.assign(map, {
      [packageName]: { version, dependencies, peerDependencies },
    });
  });
  return map;
};

const packagesMap = getWorkspacePackagesMap();

const checkPackage = (packageName, dependencies) => {
  const report = [];
  if (typeof dependencies === "undefined") {
    return [];
  }

  Object.entries(dependencies).map(([depName, version]) => {
    if (!depName.startsWith("@graphql-markdown")) {
      return [];
    }

    if (typeof packagesMap[depName] === "undefined") {
      report.push(
        `${packageName} declares unknown workspace package ${depName}`,
      );
    } else if (
      version.localeCompare(`^${packagesMap[depName].version}`) !== 0
    ) {
      report.push(
        `${packageName} uses ${depName} "${version}" instead of "^${packagesMap[depName].version}"`,
      );
    }
  });

  return report;
};

const generateReport = (packagesMap, type) => {
  return Object.entries(packagesMap)
    .map(([packageName, packageInfo]) => {
      if (typeof packageInfo[type] === "undefined") return [];
      return checkPackage(packageName, packageInfo[type]);
    })
    .flat();
};

(() => {
  let errorCount = 0;

  const types = ["dependencies", "peerDependencies"];
  types.forEach((type) => {
    const report = generateReport(packagesMap, type);
    errorCount += report.length;
    if (report.length > 0) {
      console.error(
        `${report.length} workspace ${type} error${
          report.length > 1 ? "s" : ""
        }:`,
      );
      report.forEach((log) => console.warn(`. ${log}`));
    }
  });

  const code = errorCount ? 1 : 0;
  if (code === 0) {
    console.log("No error reported.");
  }
  // eslint-disable-next-line no-process-exit
  process.exit(code);
})();
