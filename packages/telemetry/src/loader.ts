export type LoaderKind =
  | "code-file"
  | "file-json"
  | "file-sdl"
  | "git"
  | "github"
  | "glob"
  | "inline-sdl"
  | "unknown"
  | "url";

const classifyOne = (pointer: unknown): LoaderKind => {
  if (typeof pointer !== "string") {
    return "unknown";
  }
  const p = pointer.trim();
  if (/^https?:\/\//i.test(p)) {
    return "url";
  }
  if (/^github:/i.test(p)) {
    return "github";
  }
  if (/^git:/i.test(p)) {
    return "git";
  }
  if (
    /\b(type|schema|interface|enum|input|union|scalar|extend|directive)\b[^\n]*[{@]/.test(
      p,
    ) &&
    /\s/.test(p)
  ) {
    return "inline-sdl";
  }
  if (/[*?{}[\]!]/.test(p)) {
    return "glob";
  }
  if (/\.json$/i.test(p)) {
    return "file-json";
  }
  if (/\.(graphqls?|gql|sdl)$/i.test(p)) {
    return "file-sdl";
  }
  if (/\.(m?[jt]sx?|cjs|cts|vue|svelte|astro)$/i.test(p)) {
    return "code-file";
  }
  return "unknown";
};

const classifyEntry = (pointer: unknown): LoaderKind[] => {
  if (
    typeof pointer === "object" &&
    pointer !== null &&
    !Array.isArray(pointer)
  ) {
    // Object form `{ "<pointer>": { headers, ... } }`: options are ignored.
    return Object.keys(pointer).map(classifyOne);
  }
  return [classifyOne(pointer)];
};

/** Classifies a schema pointer; the pointer itself is never returned. */
export const classifyPointer = (
  pointer: unknown,
): LoaderKind | LoaderKind[] => {
  if (Array.isArray(pointer)) {
    return pointer.flatMap(classifyEntry);
  }
  const kinds = classifyEntry(pointer);
  return kinds.length === 1 ? kinds[0] : kinds;
};

const MASKS: Record<LoaderKind, string> = {
  url: "<url>",
  git: "<git>",
  github: "<github>",
  "file-sdl": "<file:sdl>",
  "file-json": "<file:json>",
  "code-file": "<file:code>",
  glob: "<glob>",
  "inline-sdl": "<inline-sdl>",
  unknown: "<unknown>",
};

/** Classifies a schema pointer into mask token(s) for the config slot. */
export const maskPointer = (pointer: unknown): string[] | string => {
  const kinds = classifyPointer(pointer);
  return Array.isArray(kinds)
    ? kinds.map((k) => {
        return MASKS[k];
      })
    : MASKS[kinds];
};
