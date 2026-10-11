export type LoaderKind =
  | "code-file"
  | "file-json"
  | "file-sdl"
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
  if (/\.(m?[jt]sx?|cjs|cts)$/i.test(p)) {
    return "code-file";
  }
  return "unknown";
};

/** Classifies a schema pointer; the pointer itself is never returned. */
export const classifyPointer = (
  pointer: unknown,
): LoaderKind | LoaderKind[] => {
  return Array.isArray(pointer)
    ? pointer.map(classifyOne)
    : classifyOne(pointer);
};
