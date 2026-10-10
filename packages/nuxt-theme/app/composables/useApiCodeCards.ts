import { codeToHtml } from "shiki";
import type { Ref } from "vue";
import {
  CODE_COLUMN_SECTIONS,
  definitionCode,
  sectionCode,
} from "~/utils/api-document";
import type { MdcNode } from "~/utils/mdc";

/** One highlighted card of the code column. */
export interface CodeCard {
  label: string;
  kind: string;
  code: string;
  html: string;
  /** Example variables stacked under the card's snippet. */
  variables?: { code: string; html: string };
}

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

const highlight = async (code: string, shikiTheme: string): Promise<string> => {
  return codeToHtml(code, { lang: detectLanguage(code), theme: shikiTheme });
};

/**
 * Builds one page's highlighted cards: the SDL definition (if any) plus every
 * `CODE_COLUMN_SECTIONS` card the page carries code for. Sections with
 * `attachTo` become the `variables` of the card they attach to instead of
 * cards of their own. Shared by `useApiCodeCards` and `useApiSinglePage`.
 */
export const buildCodeCards = async (
  documentBody: MdcNode[],
  kindLabel: string,
  isOperation: boolean,
  shikiTheme: string,
): Promise<{ definitionCard?: CodeCard; exampleCards: CodeCard[] }> => {
  const definition = definitionCode(documentBody);
  const definitionCard: CodeCard | undefined = definition
    ? {
        label: "SDL",
        kind: kindLabel,
        code: definition,
        html: await highlight(definition, shikiTheme),
      }
    : undefined;

  const sections = CODE_COLUMN_SECTIONS.filter((section) => {
    return !section.operationOnly || isOperation;
  });

  const cardEntries = await Promise.all(
    sections
      .filter((section) => {
        return !section.attachTo;
      })
      .map(async (section) => {
        const code = sectionCode(documentBody, section.title);
        if (!code) return undefined;
        const card: CodeCard = {
          label: section.label ?? section.title,
          kind: section.kind ?? kindLabel,
          code,
          html: await highlight(code, shikiTheme),
        };
        return { title: section.title, card };
      }),
  );
  const built = cardEntries.filter((entry) => {
    return entry !== undefined;
  });

  await Promise.all(
    sections
      .filter((section) => {
        return section.attachTo;
      })
      .map(async (section) => {
        const code = sectionCode(documentBody, section.title);
        const target = built.find((entry) => {
          return entry.title === section.attachTo;
        });
        if (!code || !target) return;
        target.card.variables = {
          code,
          html: await highlight(code, shikiTheme),
        };
      }),
  );

  return {
    definitionCard,
    exampleCards: built.map((entry) => {
      return entry.card;
    }),
  };
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
  definitionCard: CodeCard | undefined;
  exampleCards: CodeCard[];
}> => {
  const { definitionCard, exampleCards } = await buildCodeCards(
    documentBody.value,
    schemaKind.value,
    isOperation.value,
    shikiTheme,
  );
  return { definitionCard, exampleCards };
};
