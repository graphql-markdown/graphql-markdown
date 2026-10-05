import { codeToHtml } from "shiki";
import type { Ref } from "vue";
import {
  CODE_COLUMN_SECTIONS,
  definitionCode,
  sectionCode,
} from "~/utils/api-document";
import type { MdcNode } from "~/utils/mdc";

/**
 * Object and input examples are JSON payloads, operation examples and every
 * definition are GraphQL. Highlighting JSON with the GraphQL grammar drops
 * every key and string into the theme's comment colour, which is barely
 * legible on the dark card. Exported for `useApiSinglePage`, which highlights
 * the same kind of snippets across every generated page in one pass.
 */
export const detectLanguage = (code: string): "graphql" | "json" => {
  try {
    JSON.parse(code);
    return "json";
  } catch {
    return "graphql";
  }
};

/**
 * Highlights the code column's cards, dropping any the page carries no snippet
 * for: the landing page has no definition, and most types define no example.
 */
const toCards = async (
  cards: { label: string; kind: string; code?: string }[],
  shikiTheme: string,
): Promise<{ label: string; kind: string; code: string; html: string }[]> => {
  return Promise.all(
    cards
      .filter((card): card is typeof card & { code: string } => {
        return Boolean(card.code);
      })
      .map(async (card) => {
        return {
          ...card,
          html: await codeToHtml(card.code, {
            lang: detectLanguage(card.code),
            theme: shikiTheme,
          }),
        };
      }),
  );
};

/**
 * Builds the code column's highlighted cards: the page's own definition (if
 * any) plus any `CODE_COLUMN_SECTIONS` examples the schema defines. Called
 * once with a top-level `await`, not reactively — matches the page's own
 * one-shot data-fetch pattern, since Shiki highlighting isn't cheap enough to
 * redo on every keystroke-level reactivity change.
 */
export const useApiCodeCards = async (
  documentBody: Ref<MdcNode[]>,
  schemaKind: Ref<string>,
  isOperation: Ref<boolean>,
  shikiTheme: string,
): Promise<{
  definitionCard:
    | { label: string; kind: string; code: string; html: string }
    | undefined;
  exampleCards: { label: string; kind: string; code: string; html: string }[];
}> => {
  const [definitionCard] = await toCards(
    [
      {
        label: "SDL",
        kind: schemaKind.value,
        code: definitionCode(documentBody.value),
      },
    ],
    shikiTheme,
  );

  const filteredSections = CODE_COLUMN_SECTIONS.filter((section) => {
    return !section.operationOnly || isOperation.value;
  });

  const exampleCards = await toCards(
    filteredSections.map(({ title, label, kind }) => {
      return {
        label: label ?? title,
        kind: kind ?? schemaKind.value,
        code: sectionCode(documentBody.value, title),
      };
    }),
    shikiTheme,
  );

  return { definitionCard, exampleCards };
};
