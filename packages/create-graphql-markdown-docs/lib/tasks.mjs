import { spawn } from "node:child_process";

import * as prompts from "@clack/prompts";
import { resolveCommand } from "package-manager-detector/commands";

/**
 * Package managers supported by the scaffolder.
 */
export const SUPPORTED_PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];

function resolveOrNpm(packageManager, intent, args) {
  const agent = SUPPORTED_PACKAGE_MANAGERS.includes(packageManager)
    ? packageManager
    : "npm";
  const resolved = resolveCommand(agent, intent, args);
  if (!resolved) {
    throw new Error(`Unsupported ${intent} command for ${agent}`);
  }
  return [resolved.command, resolved.args];
}

function addDevArgs(packageManager, packages, { workspaceRoot = false } = {}) {
  const rootFlag = workspaceRoot
    ? ({ pnpm: ["-w"], yarn: ["-W"] }[packageManager] ?? [])
    : [];
  return resolveOrNpm(packageManager, "add", ["-D", ...rootFlag, ...packages]);
}

/**
 * Run a command in a shell.
 */
export function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    proc.on("error", (err) => {
      reject(
        err?.code === "ENOENT"
          ? new Error(`${command} is not installed or not on your PATH`)
          : err,
      );
    });
  });
}

/** Whether `git` is installed and runnable. */
export async function isGitAvailable() {
  return runCommand("git", ["--version"], { stdio: "ignore" }).then(
    () => true,
    () => false,
  );
}

/**
 * Install dependencies for a project using the specified package manager.
 * Logs info, runs the install command and logs success; throws on failure.
 */
export async function installDependencies(packageManager, projectDir) {
  prompts.log.info(`Installing dependencies with ${packageManager}...`);
  const [command, args] = resolveOrNpm(packageManager, "install", []);
  await runCommand(command, args, { cwd: projectDir });
  prompts.log.success("Dependencies installed!");
}

/**
 * Command line that adds packages as dev dependencies, e.g. "bun add -D a b".
 * @param {string} packageManager
 * @param {string[]} packages
 * @returns {string}
 */
export function addDevCommand(packageManager, packages, options = {}) {
  const [command, args] = addDevArgs(packageManager, packages, options);
  return [command, ...args].join(" ");
}

/**
 * Add packages as dev dependencies using the specified package manager.
 * Logs info, runs the add command and logs success; throws on failure.
 */
export async function addDevDependencies(
  packageManager,
  projectDir,
  packages,
  options = {},
) {
  prompts.log.info(`Adding ${packages.join(", ")} with ${packageManager}...`);
  const [command, args] = addDevArgs(packageManager, packages, options);
  await runCommand(command, args, { cwd: projectDir });
  prompts.log.success("Dev dependencies added!");
}

/**
 * Initialize a git repository in the project directory.
 * Skips when already inside a git work tree (no nested repos) and resolves to
 * `false`; otherwise runs git init, git add, and git commit with an initial
 * commit message and resolves to `true`. Throws on failure (after stopping the
 * spinner).
 */
export async function initGitRepo(projectDir) {
  // Git output is silenced (stdio "ignore") so it doesn't garble the prompt UI.
  const options = { cwd: projectDir, stdio: "ignore" };

  // A nested repo inside an existing one is almost never wanted.
  const insideRepo = await runCommand(
    "git",
    ["rev-parse", "--is-inside-work-tree"],
    options,
  ).then(
    () => true,
    () => false,
  );
  if (insideRepo) {
    prompts.log.info("Already inside a git repository — skipping git init.");
    return false;
  }

  const spinner = prompts.spinner();
  spinner.start("Initializing git repository...");
  try {
    await runCommand("git", ["init"], options);
    await runCommand("git", ["add", "."], options);
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    throw error;
  }
  try {
    await runCommand("git", ["commit", "-m", "Initial commit"], options);
    spinner.stop("Git repository initialized!");
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    throw new Error(
      `${error.message} (the commit can fail when git user.name / user.email are not configured).`,
      { cause: error },
    );
  }
  return true;
}
