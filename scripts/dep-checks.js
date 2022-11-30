const process = require("node:process");

process.chdir(__dirname);

const rootDir = "..";

const { dependencies: packages } = require(`${rootDir}/package.json`);

(() => {
  const packagesMap = (() => {
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
  })();

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

  const reportDep = Object.entries(packagesMap)
    .map(([packageName, { dependencies }]) => {
      return checkPackage(packageName, dependencies);
    })
    .flat();

  if (reportDep.length > 0) {
    console.error(
      `${reportDep.length} workspace dependencies error${
        reportDep.length > 1 ? "s" : ""
      }:`,
    );
    reportDep.forEach((log) => console.warn(`. ${log}`));
  }

  const reportPeerDep = Object.entries(packagesMap)
    .map(([packageName, { peerDependencies }]) => {
      return checkPackage(packageName, peerDependencies);
    })
    .flat();

  if (reportPeerDep.length > 0) {
    console.error(
      `${reportPeerDep.length} workspace peerDependencies error${
        reportPeerDep.length > 1 ? "s" : ""
      }:`,
    );
    reportPeerDep.forEach((log) => console.warn(`. ${log}`));
  }

  const code = reportDep.length + reportPeerDep.length ? 1 : 0;
  if (code === 0) {
    console.log("No error reported.");
  }
  // eslint-disable-next-line no-process-exit
  process.exit(code);
})();
