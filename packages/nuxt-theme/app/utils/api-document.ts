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

export const isOperationCategory = (category?: string): boolean => {
  return Boolean(category && OPERATION_CATEGORIES.includes(category));
};

/** Badge for a page's schema kind, taken from its category path segment. */
export const schemaKindLabel = (category?: string): string => {
  return category
    ? (SCHEMA_KIND_LABELS[category] ?? category.toUpperCase())
    : "GRAPHQL";
};

/** `create-project` → `Create Project`, for path segments used as labels. */
export const titleCase = (value: string): string => {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => {
    return letter.toUpperCase();
  });
};

// --- Queries -------------------------------------------------------------

const findSectionIndex = (nodes: MdcNode[], title: string): number => {
  return nodes.findIndex((node) => {
    return isElement(node, "h3") && nodeText(node).trim() === title;
  });
};

const findGraphqlCode = (
  nodes: MdcNode[],
  from = 0,
): MdcElement | undefined => {
  return nodes.slice(from).find((node): node is MdcElement => {
    return isElement(node, "pre") && node[1].language === "graphql";
  });
};

/** The type or operation definition, always the page's first code block. */
export const definitionCode = (nodes: MdcNode[]): string | undefined => {
  return findGraphqlCode(nodes)?.[1]?.code;
};

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
export const findDeprecationNotice = (
  body: { value?: MdcNode[] } | null | undefined,
): string | undefined => {
  const nodes: MdcNode[] = body?.value ?? [];
  const definitionIndex = nodes.findIndex((node) => {
    return isElement(node, "pre");
  });
  const metadataNodes =
    definitionIndex >= 0 ? nodes.slice(0, definitionIndex) : [];

  return metadataNodes.map(nodeText).find((text) => {
    return text.includes("Replaced by");
  });
};

// --- Transforms ----------------------------------------------------------

/**
 * Sections lifted out of the prose column and rendered as cards in the code
 * column instead, with the badge each card carries — `kind` defaults to the
 * page's own schema kind. Single source of truth for both sides of the move.
 */
export const CODE_COLUMN_SECTIONS: {
  title: string;
  label?: string;
  kind?: string;
  operationOnly?: boolean;
}[] = [
  { title: "Example" },
  {
    title: "Example Response",
    label: "Response",
    kind: "JSON",
    operationOnly: true,
  },
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
    const style = classes
      .map((name) => {
        return BADGE_STYLES[name];
      })
      .find(Boolean) ?? {
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
    typeof lastChild === "string" && /\s*\{#([^}]+)\}\s*$/.exec(lastChild);
  if (!anchorMatch) return node;

  const children = node.slice(2, -1) as MdcNode[];
  const remainingText = lastChild.replace(anchorMatch[0], "");
  if (remainingText) children.push(remainingText);

  return [node[0], { ...node[1], id: anchorMatch[1] }, ...children];
};

/** Every generated-markup fixup the reference layout applies to a node. */
export const toRenderableNode = (node: MdcNode): MdcNode => {
  return promoteBadges(promoteDeprecationCallout(normalizeAnchorId(node)));
};

interface DocumentSection {
  id: string;
  title: string;
  nodes: MdcNode[];
}

export interface SplitDocument {
  lead: MdcNode[];
  sections: DocumentSection[];
}

/**
 * Splits a document's fixed-up node list at its `h3` boundaries, so each
 * schema section ("Arguments", "Fields", …) can be rendered on its own. The
 * nodes before the first heading are the type/operation description and
 * always stay together as `lead`. Shared by `useApiDocument` (one reactive
 * page) and `useApiSinglePage` (many pages fetched at once), which is why
 * this lives here as a plain function rather than inside either composable.
 */
export const splitDocumentSections = (nodes: MdcNode[]): SplitDocument => {
  const lead: MdcNode[] = [];
  const sections: DocumentSection[] = [];

  for (const node of nodes) {
    if (isElement(node, "h3")) {
      sections.push({
        id: node[1].id ?? `section-${sections.length}`,
        title: nodeText(node).trim(),
        nodes: [],
      });
      continue;
    }

    (sections.at(-1)?.nodes ?? lead).push(node);
  }

  return { lead, sections };
};
