/* istanbul ignore file */

import { Logger } from "./logger"

const logger = Logger.getInstance();

export async function prettify(content: string, parser: string) {
  try {
    const { format } = require("prettier");
    return await format(content, { parser });
  } catch (error) {
    logger.warn("Prettier is not found");
  }
}

export async function prettifyMarkdown(content: string) {
  return await prettify(content, "markdown");
}

export async function prettifyJavascript(content: string) {
  return await prettify(content, "babel");
}

module.exports = { prettifyMarkdown, prettifyJavascript };
