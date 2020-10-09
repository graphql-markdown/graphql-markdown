import { danger, fail, warn, schedule } from "danger";
require("colors");
const Diff = require("diff");

const packageLock = danger.git.fileMatch("package-lock.json");
const packageJson = danger.git.fileMatch("package.json");
const yarnLock = danger.git.fileMatch("yarn.lock");
const licenseFile = danger.git.fileMatch("LICENSE");

const getDiffDependencies = (dependencies) => {
  const diff = Diff.diffJson(dependencies.before, dependencies.after);
  let colorDiff = ``;
  diff.forEach((part) => {
    // green for additions, red for deletions
    // grey for common parts
    const color = part.added ? "green" : part.removed ? "red" : "grey";
    colorDiff = `${colorDiff} ${part.value[color]}`;
  });
  return colorDiff;
};

if (packageLock.modified || packageLock.created) {
  fail("'package-lock.json' detected, you must used 'yarn' for dependencies.");
}

if (packageJson.modified && !(yarnLock.modified || yarnLock.created)) {
  schedule(async () => {
    const packageDiff = await danger.git.JSONDiffForFile("package.json");
    if (packageDiff.dependencies) {
      fail(
        `Dependencies changes with no corresponding lockfile changes:\n${getDiffDependencies(
          packageDiff.dependencies,
        )}`,
      );
    }
    if (packageDiff.devDependencies) {
      fail(
        `Dev dependencies changes with no corresponding lockfile changes:\n${getDiffDependencies(
          packageDiff.devDependencies,
        )}`,
      );
    }
  });
}

if (licenseFile.modified) {
  warn("This PR modified the LICENSE file.");
}
