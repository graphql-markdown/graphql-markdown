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

const getBuildDependency = () => {
  const packagesMap = getWorkspacePackagesMap();
  /**
   * @type {string[]}
   */
  const buildSequence = [];
  const visited = new Set();
  const visiting = new Set();

  const shouldSkipVisit = (packageName) => {
    if (visited.has(packageName)) {
      return true;
    }
    const packageMeta = packagesMap[packageName];
    return !packageMeta || packageMeta.private;
  };

  const visit = (packageName) => {
    if (shouldSkipVisit(packageName)) {
      return;
    }
    if (visiting.has(packageName)) {
      throw new Error(
        `Circular @graphql-markdown workspace dependency detected involving "${packageName}"`,
      );
    }

    const packageMeta = packagesMap[packageName];
    visiting.add(packageName);
    for (const dependencyName of getWorkspaceBuildNeeds(packageMeta)) {
      visit(dependencyName);
    }
    visiting.delete(packageName);

    visited.add(packageName);
    buildSequence.push(packageName);
  };

  for (const packageName of Object.keys(packagesMap)) {
    visit(packageName);
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
