import type { ApiNavigationNode } from "~/composables/useApiNavigation";

/** Stable `v-for` key; items merged from several sections carry their section title. */
export const itemKey = (
  item: ApiNavigationNode | (ApiNavigationNode & { sectionTitle: string }),
): string => {
  return "sectionTitle" in item
    ? `${item.sectionTitle}-${item.title}`
    : item.title;
};

export const getFirstLeafPath = (
  node: ApiNavigationNode,
): string | undefined => {
  if ("path" in node) return node.path;
  for (const child of node.children) {
    const path = getFirstLeafPath(child);
    if (path) return path;
  }
  return undefined;
};

export const countLeaves = (node: ApiNavigationNode): number => {
  if ("path" in node) return 1;
  return node.children.reduce((sum, child) => {
    return sum + countLeaves(child);
  }, 0);
};
