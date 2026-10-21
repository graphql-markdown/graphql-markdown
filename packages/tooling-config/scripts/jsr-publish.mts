// Pure helpers for the JSR phase of publish-release.mts, kept free of side
// effects so they can be unit-tested. Erasable syntax only (Node type
// stripping).

export type Registry = "npm" | "jsr" | "all";

const REGISTRIES = new Set<string>(["npm", "jsr", "all"]);

// Extracts `--registry <value>` / `--registry=<value>` from argv. Returns the
// remaining args (without the flag and its value) so positional parsing is not
// confused by the value. An invalid value yields `error`.
export const parseRegistryArg = (
  args: string[],
): { registry: Registry; rest: string[]; error?: string } => {
  const rest: string[] = [];
  let registry: string = "all";
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--registry") {
      registry = args[++i] ?? "";
    } else if (arg.startsWith("--registry=")) {
      registry = arg.slice("--registry=".length);
    } else {
      rest.push(arg);
    }
  }
  if (!REGISTRIES.has(registry)) {
    return {
      registry: "all",
      rest,
      error: `invalid --registry "${registry}" (expected npm, jsr or all)`,
    };
  }
  return { registry: registry as Registry, rest };
};

export const jsrMetaUrl = (name: string): string => {
  return `https://jsr.io/${name}/meta.json`;
};

// True when `meta` (the parsed JSR meta.json) lists `version`.
export const metaHasVersion = (meta: unknown, version: string): boolean => {
  const versions = (meta as { versions?: Record<string, unknown> } | null)
    ?.versions;
  return (
    typeof versions === "object" &&
    versions !== null &&
    Object.hasOwn(versions, version)
  );
};

export const jsrPublishArgs = (dryRun: boolean): string[] => {
  const publishArgs = ["jsr", "publish"];
  if (dryRun) {
    publishArgs.push("--dry-run");
  }
  return publishArgs;
};

// Fetches meta.json directly (not via npm/safe-chain). 404 means unpublished.
export const isPublishedOnJsr = async (
  name: string,
  version: string,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> => {
  try {
    const response = await fetchFn(jsrMetaUrl(name), {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      return false;
    }
    return metaHasVersion(await response.json(), version);
  } catch {
    return false;
  }
};
