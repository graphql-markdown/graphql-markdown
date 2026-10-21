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
  const publishArgs = ["publish"];
  if (dryRun) {
    publishArgs.push("--dry-run");
  }
  return publishArgs;
};

// Locates the pinned, locally installed `jsr` binary (never fetched from the
// network). Checks the package-level then the root node_modules/.bin; returns
// undefined when absent.
export const resolveJsrBin = (
  repoRoot: string,
  exists: (path: string) => boolean,
): string | undefined => {
  const candidates = [
    `${repoRoot}/packages/tooling-config/node_modules/.bin/jsr`,
    `${repoRoot}/node_modules/.bin/jsr`,
  ];
  return candidates.find((candidate) => exists(candidate));
};

// Locates the pinned, locally installed `deno` binary (the lockfile-pinned
// `deno` npm package), so the jsr CLI never downloads a runtime from
// dl.deno.land. Returns undefined when absent.
export const resolveDenoBin = (
  repoRoot: string,
  exists: (path: string) => boolean,
): string | undefined => {
  const candidates = [
    `${repoRoot}/packages/tooling-config/node_modules/.bin/deno`,
    `${repoRoot}/node_modules/.bin/deno`,
  ];
  return candidates.find((candidate) => exists(candidate));
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
