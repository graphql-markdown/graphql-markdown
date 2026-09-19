import { codeToHtml } from "shiki";
import type { Ref } from "vue";

/**
 * Object and input examples are JSON payloads, operation examples and every
 * definition are GraphQL. Highlighting JSON with the GraphQL grammar drops
 * every key and string into the theme's comment colour, which is barely
 * legible on the dark card.
 */
const detectLanguage = (code: string) => {
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
async function toCards(
  cards: Array<{ label: string; kind: string; code?: string }>,
  shikiTheme: string,
) {
  return Promise.all(
    cards
      .filter((card): card is typeof card & { code: string } => Boolean(card.code))
      .map(async (card) => ({
        ...card,
        html: await codeToHtml(card.code, {
          lang: detectLanguage(card.code),
          theme: shikiTheme,
        }),
      })),
  );
}

/**
 * Builds the code column's highlighted cards: the page's own definition (if
 * any) plus any `CODE_COLUMN_SECTIONS` examples the schema defines. Called
 * once with a top-level `await`, not reactively — matches the page's own
 * one-shot data-fetch pattern, since Shiki highlighting isn't cheap enough to
 * redo on every keystroke-level reactivity change.
 */
export async function useApiCodeCards(
  documentBody: Ref<MdcNode[]>,
  schemaKind: Ref<string>,
  shikiTheme: string,
) {
  const [definitionCard] = await toCards(
    [{ label: "Schema", kind: schemaKind.value, code: definitionCode(documentBody.value) }],
    shikiTheme,
  );

  const exampleCards = await toCards(
    CODE_COLUMN_SECTIONS.map(({ title, kind }) => ({
      label: title,
      kind: kind ?? schemaKind.value,
      code: sectionCode(documentBody.value, title),
    })),
    shikiTheme,
  );

  return { definitionCard, exampleCards };
}
