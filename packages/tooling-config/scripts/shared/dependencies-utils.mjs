//ts-check

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chdir } from "node:process";
import { fileURLToPath } from "node:url";

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

const getWorkspacePackagesMap = () => {
  const packagesPath = `${rootDir}/${packages.slice(0, -2)}`;
  const map = {};
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
