/**
 * Alias `path.posix` to normalize URL handling on Windows.
 *
 * @packageDocumentation
 */

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
  outputDir: string;
  targetUrlPath: string;
}

const normalizeRelativePath = (path: string): string => {
  const normalizedPath = path.replaceAll("\\", "/");
  return normalizedPath.startsWith(".")
    ? normalizedPath
    : `./${normalizedPath}`;
};

/**
 * Converts a generated absolute GraphQL-Markdown doc URL into a page-relative file path.
 * Returns `undefined` when the target URL does not belong to the configured `baseURL`.
 */
export const toRelativeGeneratedDocLink = ({
  baseURL,
  currentFilePath,
  extension = ".md",
  outputDir,
  targetUrlPath,
}: RelativeGeneratedDocLinkOptions): string | undefined => {
  const normalizedBaseURL = baseURL.replace(/^\/+/, "").replace(/\/+$/, "");
  const basePrefix = `/${normalizedBaseURL}/`;

  if (!targetUrlPath.startsWith(basePrefix)) {
    return undefined;
  }

  const relativeDocPath = targetUrlPath.slice(basePrefix.length);
  const docPathWithExt = relativeDocPath.endsWith(extension)
    ? relativeDocPath
    : `${relativeDocPath}${extension}`;
  const targetFilePath = resolveFs(outputDir, docPathWithExt);

  return normalizeRelativePath(
    relativeFs(dirname(currentFilePath), targetFilePath),
  );
};
