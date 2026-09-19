/**
 * Nuxt Content compiles Markdown into a compact AST: every element is
 * `[tag, props, ...children]` and every text run is a plain string. These
 * helpers are the only place that shape is unpacked, so the pages and
 * composables above them never index into raw tuples.
 */
export type MdcNode = string | MdcElement;

export type MdcElement = [
  tag: string,
  props: Record<string, any>,
  ...children: MdcNode[],
];

export const isElement = (node: unknown, tag?: string): node is MdcElement =>
  Array.isArray(node) && (tag === undefined || node[0] === tag);

export const childrenOf = (node: MdcNode): MdcNode[] =>
  isElement(node) ? (node.slice(2) as MdcNode[]) : [];

/**
 * Flattened text of a node. Inline markup such as ``Replaced by `Project` ``
 * splits a single sentence across several children, so prose has to be read
 * from the flattened text rather than from any one child.
 */
export const nodeText = (node: MdcNode): string =>
  typeof node === "string" ? node : childrenOf(node).map(nodeText).join("");

export const nodeClasses = (node: MdcNode): string[] => {
  const className = isElement(node)
    ? (node[1]?.className ?? node[1]?.class ?? "")
    : "";

  return Array.isArray(className) ? className : String(className).split(" ");
};

export const hasClass = (node: MdcNode, className: string): boolean =>
  nodeClasses(node).includes(className);

/** Depth-first search for the first descendant (or `node` itself) with a class. */
export const findByClass = (
  node: MdcNode,
  className: string,
): MdcElement | undefined => {
  if (!isElement(node)) return undefined;
  if (hasClass(node, className)) return node;

  return childrenOf(node)
    .map((child) => findByClass(child, className))
    .find(Boolean);
};
