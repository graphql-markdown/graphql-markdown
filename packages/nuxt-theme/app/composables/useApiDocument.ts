import type { Ref } from "vue";

/**
 * Splits a queried content document's body into the always-visible lead
 * (everything before the first `h3`) and the collapsible sections after each
 * `h3` — the shape `[...slug].vue`'s template renders as a `ContentRenderer`
 * lead plus one `UCollapsible` per section.
 */
export function useApiDocument(page: Ref<Record<string, any> | null | undefined>) {
  const documentBody = computed<MdcNode[]>(() => page.value?.body?.value ?? []);

  const deprecationReason = computed(() => findDeprecationNotice(page.value?.body));

  /**
   * The prose column: generated markup fixed up for Nuxt UI, minus everything
   * already shown by the code column and the deprecation alert.
   */
  const documentNodes = computed(() => {
    const inCodeColumn = codeColumnNodeIndexes(documentBody.value);

    return withoutDeprecationNotice(
      documentBody.value.filter((_, index) => !inCodeColumn.has(index)),
      deprecationReason.value,
    ).map(toRenderableNode);
  });

  const asDocument = (nodes: MdcNode[]) => ({
    ...page.value,
    body: { ...page.value?.body, value: nodes },
  });

  /**
   * The document is split at its `h3` boundaries so each schema section
   * ("Arguments", "Fields", …) can collapse behind its own heading. The nodes
   * before the first heading are the type description and stay always visible.
   */
  const document = computed(() => {
    const lead: MdcNode[] = [];
    const sections: Array<{ id: string; title: string; nodes: MdcNode[] }> = [];

    for (const node of documentNodes.value) {
      if (isElement(node, "h3")) {
        sections.push({
          id: node[1]?.id ?? `section-${sections.length}`,
          title: nodeText(node).trim(),
          nodes: [],
        });
        continue;
      }

      (sections.at(-1)?.nodes ?? lead).push(node);
    }

    return {
      lead: lead.length ? asDocument(lead) : undefined,
      sections: sections.map(({ nodes, ...section }) => ({
        ...section,
        document: asDocument(nodes),
      })),
    };
  });

  return { documentBody, deprecationReason, document };
}
