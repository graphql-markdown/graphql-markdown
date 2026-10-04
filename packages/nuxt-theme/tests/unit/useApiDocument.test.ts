import { describe, it, expect } from "vitest";
import * as apiDocument from "../../app/utils/api-document";

const createComputed = (getter: () => unknown) => {
  return {
    get value() {
      return getter();
    },
  };
};

// Nuxt auto-imports used by the composable.
Object.assign(globalThis, {
  computed: createComputed,
  findDeprecationNotice: apiDocument.findDeprecationNotice,
  codeColumnNodeIndexes: apiDocument.codeColumnNodeIndexes,
  withoutDeprecationNotice: apiDocument.withoutDeprecationNotice,
  toRenderableNode: apiDocument.toRenderableNode,
  splitDocumentSections: apiDocument.splitDocumentSections,
});

const { useApiDocument } = await import("../../app/composables/useApiDocument");

const body = (...value: unknown[]) => {
  return { value };
};

describe("useApiDocument", () => {
  it("returns empty results when there is no page", () => {
    const result = useApiDocument({ value: null });

    expect(result.documentBody.value).toEqual([]);
    expect(result.deprecationReason.value).toBeUndefined();
    expect(result.document.value).toEqual({ lead: undefined, sections: [] });
  });

  it("tolerates a page without a body", () => {
    const result = useApiDocument({ value: { title: "T" } });

    expect(result.documentBody.value).toEqual([]);
    expect(result.document.value.lead).toBeUndefined();
  });

  it("splits the body into a lead and h3 sections", () => {
    const page = {
      title: "Query",
      body: body(
        ["pre", { language: "graphql", code: "type A" }],
        ["p", {}, "description"],
        ["h3", { id: "fields" }, "Fields"],
        ["p", {}, "field docs"],
        ["h3", {}, "Other"],
      ),
    };
    const { document, documentBody } = useApiDocument({ value: page });

    expect(documentBody.value).toHaveLength(5);
    expect(document.value.lead?.title).toBe("Query");
    expect(document.value.lead?.body.value).toHaveLength(2);
    expect(
      document.value.sections.map((s) => {
        return s.id;
      }),
    ).toEqual(["fields", "section-1"]);
    expect(document.value.sections[0].title).toBe("Fields");
    expect(document.value.sections[0].document.title).toBe("Query");
    expect(document.value.sections[0].document.body.value).toHaveLength(1);
  });

  it("moves the example section to the code column", () => {
    const page = {
      body: body(
        ["pre", { language: "graphql", code: "type A" }],
        ["h3", { id: "example" }, "Example"],
        ["pre", { language: "graphql", code: "{}" }],
        ["h3", { id: "fields" }, "Fields"],
      ),
    };
    const { document } = useApiDocument({ value: page });

    expect(
      document.value.sections.map((s) => {
        return s.id;
      }),
    ).toEqual(["fields"]);
  });

  it("exposes the deprecation reason", () => {
    const page = {
      body: body(
        ["p", {}, "Replaced by B"],
        ["pre", { language: "graphql", code: "type A" }],
      ),
    };
    const { deprecationReason } = useApiDocument({ value: page });

    expect(deprecationReason.value).toContain("Replaced by");
  });
});
