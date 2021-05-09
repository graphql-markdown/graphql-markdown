/* istanbul ignore file */
import * as prettier from "prettier";

export function prettifyMarkdown(content: string) {
  return prettier.format(content, { parser: "markdown" });
}

export function prettifyJavascript(content: string) {
  return prettier.format(content, { parser: "babel" });
}
