/**
 * Output helpers for formatter lifecycle hooks.
 *
 * Hooks post-process pages the renderer has already written, so they must go
 * through the same destination the renderer used. Reaching for the filesystem
 * directly works only as long as the default adapter is in play, and silently
 * misses every page when the output is redirected elsewhere.
 *
 * @packageDocumentation
 */

import type { Maybe, OutputAdapter } from "@graphql-markdown/types";
import { fsOutputAdapter } from "@graphql-markdown/utils";

/**
 * Resolves the destination a hook must use, falling back to the filesystem.
 *
 * @param outputAdapter - Adapter carried by the hook event, if any
 * @returns The adapter to read from and write to
 */
const getOutputAdapter = (
  outputAdapter: Maybe<OutputAdapter>,
): OutputAdapter => {
  return outputAdapter ?? fsOutputAdapter;
};

/**
 * Reads back a page the renderer has written, through its output destination.
 *
 * @param filePath - Path of the generated page
 * @param outputAdapter - Adapter carried by the hook event, if any
 * @returns The page content, or `undefined` if it does not exist
 * @throws An error if the configured adapter cannot read back what it wrote,
 * so the skipped post-processing is reported rather than silently dropped.
 */
export const readOutput = async (
  filePath: string,
  outputAdapter: Maybe<OutputAdapter>,
): Promise<string | undefined> => {
  const adapter = getOutputAdapter(outputAdapter);

  if (typeof adapter.readFile !== "function") {
    throw new Error(
      `Cannot post-process "${filePath}": the configured outputAdapter does not implement readFile().`,
    );
  }

  return adapter.readFile(filePath);
};

/**
 * Writes a file through the output destination, creating its directory first.
 *
 * @param filePath - Path of the file to write
 * @param content - File content
 * @param outputAdapter - Adapter carried by the hook event, if any
 */
export const writeOutput = async (
  filePath: string,
  content: string,
  outputAdapter: Maybe<OutputAdapter>,
  dirPath?: string,
): Promise<void> => {
  const adapter = getOutputAdapter(outputAdapter);

  if (typeof dirPath === "string") {
    await adapter.ensureDir?.(dirPath);
  }

  await adapter.writeFile(filePath, content);
};
