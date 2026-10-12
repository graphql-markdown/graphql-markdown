import { homedir } from "node:os";
import { join } from "node:path";

const nonEmpty = (value: string | undefined): string | undefined => {
  return value === undefined || value === "" ? undefined : value;
};

/**
 * Resolves the OS config directory, like `env-paths` without the dependency.
 *
 * @param platform - Node platform, defaults to `process.platform`.
 * @param env - Environment variables, defaults to `process.env`.
 * @param home - Home directory, defaults to `os.homedir()`.
 */
export const resolveConfigDir = (
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env,
  home: string = homedir(),
): string => {
  let base: string;
  if (platform === "win32") {
    base = nonEmpty(env.APPDATA) ?? join(home, "AppData", "Roaming");
  } else if (platform === "darwin") {
    base = join(home, "Library", "Preferences");
  } else {
    base = nonEmpty(env.XDG_CONFIG_HOME) ?? join(home, ".config");
  }
  return join(base, "graphql-markdown");
};
