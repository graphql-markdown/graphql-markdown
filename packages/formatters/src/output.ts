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
 * Adapters a failed read-back has already been reported for.
 *
 * A destination that cannot read back its own writes fails on every page, so
 * reporting each one would bury the run in identical errors. Keyed by adapter
 * rather than a flag, so the report is per destination and does not leak into
 * another run in the same process.
 */
const readBackReported = new WeakSet<OutputAdapter>();

/**
 * Reads back a page the renderer has written, through its output destination.
 *
 * The page was just written, so nothing coming back means the destination
 * cannot be read - a write-only adapter, a stubbed `readFile`, or a store that
 * is not read-your-writes consistent. Post-processing cannot run without it,
 * which is reported rather than silently skipped.
 *
 * @param filePath - Path of the generated page
 * @param outputAdapter - Adapter carried by the hook event, if any
 * @returns The page content, or `undefined` if it cannot be read back
 * @throws An error the first time a page cannot be read back, so the skipped
 * post-processing surfaces once instead of once per page.
 */
export const readOutput = async (
  filePath: string,
  outputAdapter: Maybe<OutputAdapter>,
): Promise<string | undefined> => {
  const adapter = getOutputAdapter(outputAdapter);
  const content = await adapter.readFile(filePath);

  if (typeof content === "string") {
    return content;
  }

  if (!readBackReported.has(adapter)) {
    readBackReported.add(adapter);
    throw new Error(
      `Cannot read back "${filePath}" from the output destination: the formatter cannot post-process what it wrote, so internal links are left unresolved for this run.`,
    );
  }

  return undefined;
};

/**
 * Reads a file the formatter maintains itself, where absence is expected.
 *
 * Unlike {@link readOutput} this reports nothing when there is no content: a
 * navigation or metadata file legitimately does not exist until the formatter
 * creates it on the first page of a directory.
 *
 * @param filePath - Path of the file to read
 * @param outputAdapter - Adapter carried by the hook event, if any
 * @returns The file content, or `undefined` when there is none
 */
export const readOptionalOutput = async (
  filePath: string,
  outputAdapter: Maybe<OutputAdapter>,
): Promise<string | undefined> => {
  return getOutputAdapter(outputAdapter).readFile(filePath);
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
