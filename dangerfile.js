const { danger, fail, warn, schedule } = require("danger");
const Diff = require("diff");
const filter = require("lodash.filter");

const PACKAGE_LOCK = "package-lock.json";
const PACKAGE_JSON = "package.json";
const YARN_LOCK = "yarn.lock";
const BUN_LOCK = "bun.lock";
const LICENSE_FILE = "LICENSE";
const README_FILE = "README.md";
const DANGER_FILE = "dangerfile.js";
const JEST_SNAPSHOT = /^.+\.snap$/;

const packageJson = danger.git.fileMatch(PACKAGE_JSON);
const packageLock = danger.git.fileMatch(PACKAGE_LOCK);
const yarnLock = danger.git.fileMatch(YARN_LOCK);
const bunLock = danger.git.fileMatch(BUN_LOCK);
const licenseFile = danger.git.fileMatch(LICENSE_FILE);
const readmeFile = danger.git.fileMatch(README_FILE);
const dangerFile = danger.git.fileMatch(DANGER_FILE);

const getDiffDependencies = (dependencies) => {
  const diff = Diff.diffJson(dependencies.before, dependencies.after);
  let stringDiff = ``;
  diff.forEach((part) => {
    stringDiff = `${stringDiff} ${part.value}`;
  });
  return stringDiff;
};

const CZ_EMOJI_TYPES = require("./package.json").config["cz-emoji"].types;
// The type whose emoji marks release titles (`🔖 release 1.42.0`).
const RELEASE_TYPE = "tag";
const SEMVER = "\\d+\\.\\d+\\.\\d+(?:-[0-9A-Za-z.-]+)?(?:\\+[0-9A-Za-z.-]+)?";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches an emoji with or without its optional U+FE0F variation selector.
const emojiPattern = (emoji) =>
  `${escapeRegExp(emoji.replace(/️/g, ""))}\\uFE0F?`;

// Checks `<emoji> <name>: <subject>` and `<emoji> <name>(<scope>): <subject>`
// against the cz-emoji types, plus `<release emoji> release <semver>`.
const isValidPrTitle = (title, types) => {
  const alternatives = types.map(
    (type) =>
      `${emojiPattern(type.emoji)} ${escapeRegExp(type.name)}` +
      `(?:\\([^()\\s]+\\))?: \\S.*`,
  );
  const releaseType = types.find((type) => type.name === RELEASE_TYPE);
  if (releaseType) {
    alternatives.push(`${emojiPattern(releaseType.emoji)} release ${SEMVER}`);
  }
  return new RegExp(`^(?:${alternatives.join("|")})$`).test(title.trim());
};

// rule-yarn-lock-detected
if (yarnLock.modified || yarnLock.created) {
  fail(`\`${YARN_LOCK}\` detected, you must used 'bun' for dependencies.`);
}

// rule-npm-lock-deleted
if (packageLock.modified || packageLock.created) {
  fail(`\`${PACKAGE_LOCK}\` detected, you must used 'bun' for dependencies.`);
}

// rule-bun-lock-deleted
if (bunLock.deleted) {
  fail(`This PR deleted the \`${BUN_LOCK}\` file.`);
}

// rule-bun-lock-not-updated
if (packageJson.modified && !(bunLock.modified || bunLock.created)) {
  schedule(async () => {
    const packageDiff = await danger.git.JSONDiffForFile(PACKAGE_JSON);
    if (packageDiff.dependencies) {
      const description =
        "Dependencies changed with no corresponding lockfile changes:";
      fail(`${description}\n${getDiffDependencies(packageDiff.dependencies)}`);
    }
    if (packageDiff.devDependencies) {
      const description =
        "Dev dependencies changed with no corresponding lockfile changes:";
      fail(
        `${description}\n${getDiffDependencies(packageDiff.devDependencies)}`,
      );
    }
  });
}

// rule-license-file-modified
if (licenseFile.modified) {
  warn(`This PR modified the \`${LICENSE_FILE}\` file.`);
}

// rule-license-file-deleted
if (licenseFile.deleted) {
  fail(`This PR deleted the \`${LICENSE_FILE}\` file.`);
}

// rule-readme-file-deleted
if (readmeFile.deleted) {
  fail(`This PR deleted the \`${README_FILE}\` file.`);
}

const jestSnapshots = {
  modified: filter(danger.git.modified_files, (file) =>
    file.match(JEST_SNAPSHOT),
  ),
  deleted: filter(danger.git.deleted_files, (file) =>
    file.match(JEST_SNAPSHOT),
  ),
};

// rule-jest-snapshot-modified
if (jestSnapshots.modified.length > 0) {
  const description = "This PR modified some Jest snapshot file/s:";
  warn(`${description}\n - ${jestSnapshots.modified.join("\n - ")}`);
}

// rule-jest-snapshot-deleted
if (jestSnapshots.deleted.length > 0) {
  const description = "This PR deleted some Jest snapshot file/s:";
  warn(`${description}\n - ${jestSnapshots.deleted.join("\n - ")}`);
}

// rule-danger-file-modified
if (dangerFile.modified) {
  warn(`This PR modified the \`${DANGER_FILE}\` file.`);
}

// rule-pr-title-format
const pr = danger.github.pr;
const isBot = pr.user.type === "Bot" || pr.user.login.endsWith("[bot]");
if (!isBot && !isValidPrTitle(pr.title, CZ_EMOJI_TYPES)) {
  const types = CZ_EMOJI_TYPES.map((type) => `${type.emoji} ${type.name}`);
  fail(
    `PR title \`${pr.title}\` does not follow the commit convention. PR titles become squash-merge commit subjects, so use \`<emoji> <type>: <subject>\` or \`<emoji> <type>(<scope>): <subject>\`.\n` +
      `Examples: \`📝 docs: refresh the README demo screenshots\`, \`👷 ci(changelog): generate per-package changelogs\`, \`🔖 release 1.42.0\`.\n` +
      `Allowed types: ${types.join(", ")}.`,
  );
}

// Flags source changes under `packages/*/src/` that ship without a changeset.
// `.changeset/README.md` is documentation, not a changeset.
const SRC_FILE = /^packages\/[^/]+\/src\//;
const CHANGESET_FILE = /^\.changeset\/(?!README\.md$)[^/]+\.md$/;
const NO_CHANGESET_LABEL = "no-changeset";

const isMissingChangeset = (files) =>
  files.some((file) => SRC_FILE.test(file)) &&
  !files.some((file) => CHANGESET_FILE.test(file));

// rule-missing-changeset
const isReleasePr = new RegExp(
  `^${emojiPattern(
    CZ_EMOJI_TYPES.find((type) => type.name === RELEASE_TYPE).emoji,
  )} release ${SEMVER}$`,
).test(pr.title.trim());
const labels = (danger.github.issue.labels || []).map((label) => label.name);
const changedFiles = [
  ...danger.git.modified_files,
  ...danger.git.created_files,
  ...danger.git.deleted_files,
];
if (
  !isBot &&
  !isReleasePr &&
  !labels.includes(NO_CHANGESET_LABEL) &&
  isMissingChangeset(changedFiles)
) {
  warn(
    `This PR changes package source files but adds no changeset. Run \`bun changeset\` and commit the generated \`.changeset/*.md\` file, or add the \`${NO_CHANGESET_LABEL}\` label if the change does not need a release note.`,
  );
}
