import {
  childrenOf,
  findByClass,
  hasClass,
  isElement,
  nodeClasses,
  nodeText,
  type MdcElement,
  type MdcNode,
} from "~/utils/mdc";

/**
 * Reading the generated GraphQL reference: the queries and transforms that turn
 * one `graphql-markdown` page into the parts the reference layout renders.
 */

const SCHEMA_KIND_LABELS: Record<string, string> = {
  directives: "DIRECTIVE",
  mutations: "MUTATION",
  subscriptions: "SUBSCRIPTION",
  queries: "QUERY",
  objects: "OBJECT",
  scalars: "SCALAR",
  enums: "ENUM",
  unions: "UNION",
  inputs: "INPUT",
  interfaces: "INTERFACE",
};

/** Categories whose pages document an operation rather than a schema type. */
const OPERATION_CATEGORIES = ["queries", "mutations", "subscriptions"];

export const isOperationCategory = (category?: string): boolean =>
  Boolean(category && OPERATION_CATEGORIES.includes(category));

/** Badge for a page's schema kind, taken from its category path segment. */
export const schemaKindLabel = (category?: string): string =>
  category
    ? (SCHEMA_KIND_LABELS[category] ?? category.toUpperCase())
    : "GRAPHQL";

/** `create-project` → `Create Project`, for path segments used as labels. */
export const titleCase = (value: string): string =>
  value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

// --- Queries -------------------------------------------------------------

const findSectionIndex = (nodes: MdcNode[], title: string): number =>
  nodes.findIndex(
    (node) => isElement(node, "h3") && nodeText(node).trim() === title,
  );

const findGraphqlCode = (nodes: MdcNode[], from = 0): MdcElement | undefined =>
  nodes
    .slice(from)
    .find(
      (node): node is MdcElement =>
        isElement(node, "pre") && node[1]?.language === "graphql",
    );

/** The type or operation definition, always the page's first code block. */
export const definitionCode = (nodes: MdcNode[]): string | undefined =>
  findGraphqlCode(nodes)?.[1]?.code;

/** The code block below an `### <title>` heading, if the schema defines one. */
export const sectionCode = (
  nodes: MdcNode[],
  title: string,
): string | undefined => {
  const index = findSectionIndex(nodes, title);
  const code =
    index >= 0
      ? findGraphqlCode(nodes, index + 1)?.[1]?.code?.trim()
      : undefined;

  // Types without a schema-defined example still emit an empty `{}` block.
  return code && code !== "{}" ? code : undefined;
};

/**
 * A type retired with `@deprecatedType` states its replacement as prose above
 * the definition rather than through the standard `@deprecated` directive.
 */
export const findDeprecationNotice = (body: any): string | undefined => {
  const nodes: MdcNode[] = body?.value ?? [];
  const definitionIndex = nodes.findIndex((node) => isElement(node, "pre"));
  const metadataNodes =
    definitionIndex >= 0 ? nodes.slice(0, definitionIndex) : [];

  return metadataNodes
    .map(nodeText)
    .find((text) => text.includes("Replaced by"));
};

// --- Transforms ----------------------------------------------------------

/**
 * Sections lifted out of the prose column and rendered as cards in the code
 * column instead, with the badge each card carries — `kind` defaults to the
 * page's own schema kind. Single source of truth for both sides of the move.
 */
export const CODE_COLUMN_SECTIONS: Array<{ title: string; kind?: string }> = [
  { title: "Example" },
  { title: "Example Response", kind: "JSON" },
];

/** Indexes of the moved headings and the code block following each of them. */
export const codeColumnNodeIndexes = (nodes: MdcNode[]): Set<number> => {
  const indexes = new Set<number>();

  for (const { title } of CODE_COLUMN_SECTIONS) {
    const index = findSectionIndex(nodes, title);
    if (index >= 0) indexes.add(index).add(index + 1);
  }

  return indexes;
};

/**
 * On a deprecated type, both the notice itself and the "Directives" section
 * restating it are promoted into the alert above the document.
 */
export const withoutDeprecationNotice = (
  nodes: MdcNode[],
  reason?: string,
): MdcNode[] => {
  if (!reason) return nodes;

  let isInDirectivesSection = false;

  return nodes.filter((node) => {
    if (isElement(node, "h3")) {
      isInDirectivesSection = nodeText(node).trim() === "Directives";
    }

    if (isInDirectivesSection) return false;

    return !nodeText(node).includes(reason);
  });
};

/**
 * Field-level deprecations are emitted as a raw `<aside>`. Swap them for the
 * same UAlert the type-level notice uses so both render identically.
 */
const promoteDeprecationCallout = (node: MdcNode): MdcNode => {
  if (!isElement(node) || !hasClass(node, "api-deprecation-callout"))
    return node;

  const message = findByClass(node, "api-deprecation-message");

  return [
    "UAlert",
    {
      color: "error",
      variant: "subtle",
      icon: "i-lucide-triangle-alert",
      description: nodeText(message ?? node),
      class: "my-4",
    },
  ];
};

const BADGE_STYLES: Record<string, { color: string; variant: string }> = {
  "gqlmd-mdx-badge-deprecated": { color: "error", variant: "subtle" },
  "gqlmd-mdx-badge-non-null": { color: "neutral", variant: "solid" },
};

/**
 * Type metadata is marked with `<mark class="gqlmd-mdx-badge-*">`. Render it as
 * UBadge so it matches the badges used in the sidebar.
 */
const promoteBadges = (node: MdcNode): MdcNode => {
  if (!isElement(node)) return node;

  const classes = nodeClasses(node);
  if (node[0] === "mark" && classes.includes("gqlmd-mdx-badge")) {
    const style = classes.map((name) => BADGE_STYLES[name]).find(Boolean) ?? {
      color: "neutral",
      variant: "subtle",
    };

    return [
      "UBadge",
      { ...style, size: "sm", class: "font-mono align-middle" },
      ...childrenOf(node),
    ];
  }

  return [node[0], node[1], ...childrenOf(node).map(promoteBadges)];
};

/**
 * Headings carry their anchor as a trailing `{#id}` marker; lift it into the
 * element's own id so in-page links resolve.
 */
const normalizeAnchorId = (node: MdcNode): MdcNode => {
  if (!isElement(node) || !/^h[1-6]$/.test(node[0])) return node;

  const lastChild = node.at(-1);
  const anchorMatch =
    typeof lastChild === "string" && lastChild.match(/\s*\{#([^}]+)\}\s*$/);
  if (!anchorMatch) return node;

  const children = node.slice(2, -1) as MdcNode[];
  const remainingText = lastChild.replace(anchorMatch[0], "");
  if (remainingText) children.push(remainingText);

  return [node[0], { ...node[1], id: anchorMatch[1] }, ...children];
};

/** Every generated-markup fixup the reference layout applies to a node. */
export const toRenderableNode = (node: MdcNode): MdcNode =>
  promoteBadges(promoteDeprecationCallout(normalizeAnchorId(node)));
