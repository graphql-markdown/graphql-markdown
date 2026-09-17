// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chdir } from "node:process";
import { fileURLToPath } from "node:url";

type PackageMeta = {
  version?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type PackagesMap = Record<string, PackageMeta>;

const currentDir = fileURLToPath(new URL(".", import.meta.url));
chdir(currentDir);

const rootDir = resolve(currentDir, "../../../../");
const rootPackageJson = JSON.parse(
  readFileSync(resolve(rootDir, "package.json"), "utf-8"),
);
const {
  workspaces: {
    packages: [packages],
  },
} = rootPackageJson;

const getWorkspacePackagesMap = (): PackagesMap => {
  const packagesPath = `${rootDir}/${packages.slice(0, -2)}`;
  const map: PackagesMap = {};
  const folders = readdirSync(packagesPath, { withFileTypes: true })
    .filter((dirent) => {
      return dirent.isDirectory();
    })
    .map((dirent) => {
      return dirent.name;
    });
  folders.forEach((packageFolder) => {
    const packageJson = JSON.parse(
      readFileSync(`${packagesPath}/${packageFolder}/package.json`, "utf-8"),
    );
    const {
      name,
      version,
      private: isPrivate,
      dependencies,
      peerDependencies,
    } = packageJson;

    Object.assign(map, {
      [name]: {
        version,
        private: isPrivate,
        dependencies,
        peerDependencies,
      },
    });
  });
  return map;
};

export { getWorkspacePackagesMap };
