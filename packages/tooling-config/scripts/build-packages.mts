// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { pathToFileURL } from "node:url";

import { getWorkspacePackagesMap } from "./shared/dependencies-utils.mts";
import { ORG_NAME, shortName } from "./shared/package-names.mts";

type PackageMeta = {
  private?: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const getWorkspaceBuildNeeds = (packageMeta: PackageMeta = {}): string[] => {
  return Object.keys({
    ...packageMeta.dependencies,
    ...packageMeta.peerDependencies,
  }).filter((dependencyName) => {
    return dependencyName.startsWith(ORG_NAME);
  });
};

const getBuildDependency = (): string[] => {
  const packagesMap = getWorkspacePackagesMap();
  const buildSequence: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const shouldSkipVisit = (packageName: string): boolean => {
    if (visited.has(packageName)) {
      return true;
    }
    const packageMeta = packagesMap[packageName];
    return !packageMeta || Boolean(packageMeta.private);
  };

  const visit = (packageName: string) => {
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

// Publishable workspace package short names (org prefix stripped where the
// package is actually scoped under it — a deliberately unscoped package like
// `create-graphql-markdown-docs` has no prefix to strip and is returned as
// is), ordered so each package's `@graphql-markdown/*` dependencies are built
// before it.
const getBuildSequence = (): string[] => {
  return getBuildDependency().map(shortName);
};

export { getBuildSequence };

// When run directly (`node build-packages.mts`), print one package name per
// line so shell tooling can consume the build order.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  for (const packageName of getBuildSequence()) {
    console.log(packageName);
  }
}
