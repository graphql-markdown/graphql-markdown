// @ts-check

import { getWorkspacePackagesMap } from "./shared/dependencies-utils.mjs";

const orgName = "@graphql-markdown";
const packagesMap = getWorkspacePackagesMap();

const getBuildDependency = () => {
  /**
   * @type {string[]}
   */
  const buildSequence = [];
  for (const [packageName, packageMeta] of Object.entries(packagesMap)) {
    if (packageMeta?.private) {
      continue;
    }

    const buildNeed = Object.keys({
      ...packageMeta?.dependencies,
      ...packageMeta?.peerDependencies,
    }).filter((dependencyName) => {
      return dependencyName.startsWith(orgName);
    });

    const idx = buildSequence.indexOf(packageName);

    if (buildNeed.length === 0) {
      if (idx === -1) {
        buildSequence.unshift(packageName);
      }
      continue;
    }

    if (idx > -1) {
      buildSequence.splice(idx, 1);
    }

    const position = buildNeed.reduce((index, dependency) => {
      const pos = buildSequence.indexOf(dependency);
      if (pos === -1) {
        buildSequence.push(dependency);
        return buildSequence.length - 1;
      }
      return Math.max(pos, index);
    }, 0);
    buildSequence.splice(position + 1, 0, packageName);
  }

  return buildSequence;
};

for (const packageName of getBuildDependency()) {
  console.log(packageName.slice(orgName.length + 1));
}
