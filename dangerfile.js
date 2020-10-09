import { danger, fail, warn } from "danger";

const packageLock = danger.git.fileMatch("package-lock.json");
const packageJson = danger.git.fileMatch("package.json");
const yarnLock = danger.git.fileMatch("yarn.lock");
const licenseFile = danger.git.fileMatch("LICENSE");

if (packageLock.modified || packageLock.created) {
  fail("'package-lock.json' detected, you must used 'yarn' for dependencies.");
}

if (packageJson.modified && !(yarnLock.modified || yarnLock.created)) {
  fail("This PR modified package.json, but not the lockfile");
}

if (licenseFile.modified) {
  warn("This PR modified the LICENSE file.");
}
