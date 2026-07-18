// @ts-check

import { pathToFileURL } from "node:url";

import { getWorkspacePackagesMap } from "./shared/dependencies-utils.mjs";

const orgName = "@graphql-markdown";

const getWorkspaceBuildNeeds = (packageMeta = {}) => {
  return Object.keys({
    ...packageMeta.dependencies,
    ...packageMeta.peerDependencies,
  }).filter((dependencyName) => {
    return dependencyName.startsWith(orgName);
  });
};

const ensureDependencyOrder = (buildSequence, dependencyNames) => {
  return dependencyNames.reduce((index, dependencyName) => {
    const pos = buildSequence.indexOf(dependencyName);
    if (pos === -1) {
      buildSequence.push(dependencyName);
      return buildSequence.length - 1;
    }
    return Math.max(pos, index);
  }, 0);
};

const insertPackageAfterDependencies = (
  buildSequence,
  packageName,
  dependencyNames,
) => {
  const idx = buildSequence.indexOf(packageName);
  if (idx > -1) {
    buildSequence.splice(idx, 1);
  }

  if (dependencyNames.length === 0) {
    buildSequence.unshift(packageName);
    return;
  }

  const position = ensureDependencyOrder(buildSequence, dependencyNames);
  buildSequence.splice(position + 1, 0, packageName);
};

const getBuildDependency = () => {
  const packagesMap = getWorkspacePackagesMap();
  /**
   * @type {string[]}
   */
  const buildSequence = [];
  for (const [packageName, packageMeta] of Object.entries(packagesMap)) {
    if (packageMeta?.private) {
      continue;
    }

    const buildNeeds = getWorkspaceBuildNeeds(packageMeta);
    insertPackageAfterDependencies(buildSequence, packageName, buildNeeds);
  }

  return buildSequence;
};

/**
 * Publishable workspace package short names (org prefix stripped), ordered so
 * each package's `@graphql-markdown/*` dependencies are built before it.
 * @returns {string[]}
 */
const getBuildSequence = () => {
  return getBuildDependency().map((packageName) => {
    return packageName.slice(orgName.length + 1);
  });
};

export { getBuildSequence };

// When run directly (`node build-packages.mjs`), print one package name per line
// so shell tooling can consume the build order.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  for (const packageName of getBuildSequence()) {
    console.log(packageName);
  }
}
