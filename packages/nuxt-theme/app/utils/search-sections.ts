import { extractAnchor } from "./api-document";

/** The subset of a `queryCollectionSearchSections` item this helper touches. */
export interface SearchSection {
  [key: string]: unknown;
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
}

const stripAnchorMarker = (value: string): string => {
  const anchor = extractAnchor(value);
  return anchor ? anchor.text.trim() : value;
};

/**
 * Removes Shiki theme CSS (`html .shiki span {...}`) that leaks into indexed
 * content. Plain index scanning rather than a regex, so there is no
 * backtracking risk.
 */
export const stripShikiCss = (content: string): string => {
  let result = content;
  let from = 0;
  for (;;) {
    const marker = result.indexOf(".shiki", from);
    if (marker === -1) break;
    const open = result.indexOf("{", marker);
    const close = open === -1 ? -1 : result.indexOf("}", open);
    if (close === -1) break;
    let start = result.lastIndexOf("html", marker);
    if (start === -1 || result.slice(start, marker).includes("}")) {
      start = marker;
    }
    result = `${result.slice(0, start)} ${result.slice(close + 1)}`;
    from = start;
  }
  return result.split(/\s+/).filter(Boolean).join(" ");
};

const anchorFromId = (id: string): string => {
  const base = id.split("#")[0] ?? id;
  return base.split("/").findLast(Boolean) ?? base;
};

/**
 * Cleans search sections and, in flat (single-page) mode, points every
 * section at its entry's `#<anchorId>` so it matches the single-page
 * sidebar's leaf paths (Nuxt UI buckets files by `id.split("#")[0]`, which
 * is empty for a bare hash id and falls back to the whole id).
 */
export const toSinglePageSearchSections = <T extends SearchSection>(
  files: readonly T[],
  isFlat: boolean,
): T[] => {
  return files.map((file) => {
    const cleaned = {
      ...file,
      title: stripAnchorMarker(file.title),
      titles: file.titles.map(stripAnchorMarker),
      content: stripShikiCss(file.content),
    };
    return isFlat ? { ...cleaned, id: `#${anchorFromId(file.id)}` } : cleaned;
  });
};

/**
 * Gives every top-level navigation branch without a `path` a synthetic one so
 * Nuxt UI's UContentSearch (which keys each CommandPalette group by
 * `group.path` and silently drops groups without an `id`) keeps its results.
 * Returns a shallow copy; the input is not mutated.
 */
export const withSearchGroupIds = <
  T extends { title?: string; path?: string; children?: unknown[] },
>(
  navigation: readonly T[],
): T[] => {
  return navigation.map((node, index) => {
    if (!node.children || node.path) {
      return { ...node };
    }
    const slug =
      (node.title ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      String(index);
    return { ...node, path: `search-group-${slug}` };
  });
};
