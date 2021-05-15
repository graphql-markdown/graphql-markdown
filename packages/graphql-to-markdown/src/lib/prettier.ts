/* istanbul ignore file */
import * as prettier from "prettier";

export function prettifyMarkdown(content: string): string {
  return prettier.format(content, { parser: "markdown" });
}

export function prettifyJavascript(content: string): string {
  return prettier.format(content, { parser: "babel" });
}
