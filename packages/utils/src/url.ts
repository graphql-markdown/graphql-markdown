/**
 * Alias `path.posix` to normalize URL handling on Windows.
 *
 * @packageDocumentation
 */

import { existsSync } from "node:fs";
import {
  dirname,
  relative as relativeFs,
  resolve as resolveFs,
} from "node:path";

export { join, resolve } from "node:path/posix";

export interface RelativeGeneratedDocLinkOptions {
  baseURL: string;
  currentFilePath: string;
  extension?: string;
  /** Optional URL prefix (e.g. `/docs`) the printer puts before generated paths. */
  linkRoot?: string;
  /** Root-level generated doc paths (without extensions), known before they are written. */
  knownDocPaths?: ReadonlySet<string>;
  outputDir: string;
  targetUrlPath: string;
}

const normalizeRelativePath = (path: string): string => {
  const normalizedPath = path.replaceAll("\\", "/");
  return normalizedPath.startsWith(".")
    ? normalizedPath
    : `./${normalizedPath}`;
};

// Manual scan instead of a trailing `\/+$` regex, which is unanchored at the
// start and so retries at every position with polynomial worst-case time.
const stripTrailingSlashes = (value: string): string => {
  let end = value.length;
  while (end > 0 && value[end - 1] === "/") {
    end--;
  }
  return value.slice(0, end);
};

// Folders the renderer always creates at the root of the output directory.
const GENERATED_ROOT_FOLDERS = new Set(["operations", "types"]);

const firstSegment = (path: string): string =>
  path.split("/").find(Boolean) ?? "";

// With a root baseURL every absolute URL starts with "/", so a page link can
// only be told apart from `/guides/auth` or `/img/logo.png` by its first
// segment: a built-in root folder, a folder already present in the output
// directory, or the folder of the page being rewritten (group folders).
const isGeneratedRootPath = (
  docPath: string,
  currentFilePath: string,
  outputDir: string,
  extension: string,
  knownDocPaths?: ReadonlySet<string>,
): boolean => {
  const segment = firstSegment(docPath);
  if (segment === "") return false;
  if (GENERATED_ROOT_FOLDERS.has(segment)) return true;
  // flat hierarchy: pages live directly at the root
  if (
    knownDocPaths?.has(docPath) ||
    existsSync(resolveFs(outputDir, `${docPath}${extension}`))
  ) {
    return true;
  }
  const currentRelative = relativeFs(outputDir, currentFilePath).replaceAll(
    "\\",
    "/",
  );
  if (
    !currentRelative.startsWith("..") &&
    currentRelative.includes("/") &&
    firstSegment(currentRelative) === segment
  ) {
    return true;
  }
  return existsSync(resolveFs(outputDir, segment));
};

/**
 * Converts a generated absolute GraphQL-Markdown doc URL into a page-relative file path.
 * Returns `undefined` when the target URL does not belong to the configured `baseURL`.
 */
export const toRelativeGeneratedDocLink = ({
  baseURL,
  currentFilePath,
  extension = ".md",
  linkRoot,
  knownDocPaths,
  outputDir,
  targetUrlPath,
}: RelativeGeneratedDocLinkOptions): string | undefined => {
  const normalizedBaseURL = stripTrailingSlashes(
    baseURL.replaceAll(/^\/+/g, ""),
  );
  // A "." (or empty) baseURL means docs are generated at the root, and their
  // URLs carry no base segment.
  const basePrefix =
    normalizedBaseURL === "" || normalizedBaseURL === "."
      ? "/"
      : `/${normalizedBaseURL}/`;

  // Protocol-relative URLs are never generated pages.
  if (targetUrlPath.startsWith("//")) {
    return undefined;
  }

  const normalizedLinkRoot = stripTrailingSlashes(linkRoot ?? "");
  const urlPath =
    normalizedLinkRoot !== "" &&
    (targetUrlPath === normalizedLinkRoot ||
      targetUrlPath.startsWith(`${normalizedLinkRoot}/`))
      ? targetUrlPath.slice(normalizedLinkRoot.length) || "/"
      : targetUrlPath;

  if (!urlPath.startsWith(basePrefix)) {
    return undefined;
  }

  const relativeDocPath = urlPath.slice(basePrefix.length);

  if (
    basePrefix === "/" &&
    !isGeneratedRootPath(
      relativeDocPath,
      currentFilePath,
      outputDir,
      extension,
      knownDocPaths,
    )
  ) {
    return undefined;
  }

  const docPathWithExt = relativeDocPath.endsWith(extension)
    ? relativeDocPath
    : `${relativeDocPath}${extension}`;
  const targetFilePath = resolveFs(outputDir, docPathWithExt);

  return normalizeRelativePath(
    relativeFs(dirname(currentFilePath), targetFilePath),
  );
};
