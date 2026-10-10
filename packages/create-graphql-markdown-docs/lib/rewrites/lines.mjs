/** One nesting level in the templates' YAML and TS files. */
export const INDENT_STEP = "  ";

/** Escapes `value` for literal use inside a RegExp. */
function escapeRegExp(value) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Finds the line whose trimmed content is `content`, so rewrites follow the
 * template's own indentation instead of hardcoding it. Returns the full
 * `line` and its leading `indent`, or `undefined` when no line matches.
 */
export function findIndentedLine(text, content) {
  const match = new RegExp(`^([ \\t]*)${escapeRegExp(content)}$`, "m").exec(
    text,
  );
  return match ? { line: match[0], indent: match[1] } : undefined;
}
