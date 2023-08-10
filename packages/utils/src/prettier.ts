/* istanbul ignore file */

import { Logger } from "./logger";

const logger = Logger.getInstance();

export async function prettify(
  content: string,
  parser: string,
): Promise<string | undefined> {
  try {
    const { format } = await import("prettier");
    return await format(content, { parser });
  } catch (error: unknown) {
    logger.warn("Prettier is not found");
    return undefined;
  }
}

export async function prettifyMarkdown(
  content: string,
): Promise<string | undefined> {
  return prettify(content, "markdown");
}

export async function prettifyJavascript(
  content: string,
): Promise<string | undefined> {
  return prettify(content, "babel");
}
