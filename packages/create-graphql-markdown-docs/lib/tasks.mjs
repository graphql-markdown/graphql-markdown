import { spawn } from "node:child_process";

import * as prompts from "@clack/prompts";

/**
 * Maps each package manager to its install command and arguments.
 * Each entry is [command, args] to be passed to spawn().
 */
export const INSTALL_COMMANDS = {
  npm: ["npm", ["install"]],
  pnpm: ["pnpm", ["install"]],
  yarn: ["yarn", []],
  bun: ["bun", ["install"]],
};

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
 * Logs info, runs the install command, logs success, and catches+logs errors.
 * Resolves to whether the install succeeded.
 */
export async function installDependencies(packageManager, projectDir) {
  prompts.log.info(`Installing dependencies with ${packageManager}...`);
  try {
    const [command, args] =
      INSTALL_COMMANDS[packageManager] ?? INSTALL_COMMANDS.npm;
    await runCommand(command, args, { cwd: projectDir });
    prompts.log.success("Dependencies installed!");
    return true;
  } catch (error) {
    prompts.log.error(`Failed to install dependencies: ${error.message}`);
    return false;
  }
}

/**
 * Initialize a git repository in the project directory.
 * Skips when already inside a git work tree (no nested repos); otherwise runs
 * git init, git add, and git commit with an initial commit message.
 * Logs success and catches+logs errors.
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
    return;
  }

  const spinner = prompts.spinner();
  spinner.start("Initializing git repository...");
  try {
    await runCommand("git", ["init"], options);
    await runCommand("git", ["add", "."], options);
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    prompts.log.warn(`Could not initialize git: ${error.message}`);
    return;
  }
  try {
    await runCommand("git", ["commit", "-m", "Initial commit"], options);
    spinner.stop("Git repository initialized!");
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    prompts.log.warn(
      `Could not initialize git: ${error.message} (the commit can fail when git user.name / user.email are not configured).`,
    );
  }
}
