// Pure helpers for the JSR phase of publish-release.mts, kept free of side
// effects so they can be unit-tested. Erasable syntax only (Node type
// stripping).

export type Registry = "npm" | "jsr" | "all";

const REGISTRIES = new Set<string>(["npm", "jsr", "all"]);

const argAt = (args: string[], index: number): string => args[index] ?? "";

type RegistryOption = { value: string; consumed: number };

const parseRegistryOption = (
  args: string[],
  index: number,
): RegistryOption | undefined => {
  const arg = argAt(args, index);
  if (arg === "--registry") {
    return { value: argAt(args, index + 1), consumed: 2 };
  }
  if (arg.startsWith("--registry=")) {
    return { value: arg.slice("--registry=".length), consumed: 1 };
  }
  return undefined;
};

const validateRegistry = (
  registry: string,
  rest: string[],
): { registry: Registry; rest: string[]; error?: string } => {
  if (REGISTRIES.has(registry)) {
    return { registry: registry as Registry, rest };
  }
  return {
    registry: "all",
    rest,
    error: `invalid --registry "${registry}" (expected npm, jsr or all)`,
  };
};

// Extracts `--registry <value>` / `--registry=<value>` from argv. Returns the
// remaining args (without the flag and its value) so positional parsing is not
// confused by the value. An invalid value yields `error`.
export const parseRegistryArg = (
  args: string[],
): { registry: Registry; rest: string[]; error?: string } => {
  const rest: string[] = [];
  let registry: string = "all";
  for (let i = 0; i < args.length; i++) {
    const option = parseRegistryOption(args, i);
    if (option === undefined) {
      rest.push(argAt(args, i));
      continue;
    }
    registry = option.value;
    i += option.consumed - 1;
  }
  return validateRegistry(registry, rest);
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

// Locates a pinned, locally installed binary (`jsr`, or the lockfile-pinned
// `deno` npm package so the jsr CLI never downloads a runtime from
// dl.deno.land). Never fetched from the network. Checks the package-level then
// the root node_modules/.bin; returns undefined when absent.
export const resolveLocalBin = (
  repoRoot: string,
  name: string,
  exists: (path: string) => boolean,
): string | undefined => {
  const candidates = [
    `${repoRoot}/packages/tooling-config/node_modules/.bin/${name}`,
    `${repoRoot}/node_modules/.bin/${name}`,
  ];
  return candidates.find((candidate) => exists(candidate));
};

// `jsr publish` (without --allow-dirty) aborts on uncommitted changes, so a
// dirty tree must stop the run before npm publishes when a real JSR publish
// will follow.
export const dirtyTreeIsFatal = (options: {
  dirty: boolean;
  runJsr: boolean;
  dryRun: boolean;
}): boolean => {
  return options.dirty && options.runJsr && !options.dryRun;
};

// Contents of the temporary root deno.json used for the dry-run rehearsal: a
// workspace of all JSR packages, so sibling `jsr:` imports resolve locally
// instead of against the live registry.
export const jsrWorkspaceJson = (pkgs: string[]): string => {
  return JSON.stringify(
    {
      workspace: pkgs.map((pkg) => `./packages/${pkg}`),
      nodeModulesDir: "none",
    },
    null,
    2,
  );
};

// Arguments for the workspace rehearsal. --allow-dirty is safe: nothing is
// published, and the temporary deno.json itself dirties the tree.
export const denoRehearsalArgs = (): string[] => {
  return ["publish", "--dry-run", "--allow-dirty"];
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
