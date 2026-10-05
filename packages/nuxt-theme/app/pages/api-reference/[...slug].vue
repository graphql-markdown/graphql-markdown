<!-- fallow-ignore-file complexity -->
<template>
  <main
    v-if="page"
    class="grid flex-1 grid-cols-1"
    :class="{ 'lg:grid-cols-2': !isLandingPage }"
  >
    <section
      class="api-document max-w-none overflow-y-auto p-8 lg:px-16 lg:py-20"
      :class="{ 'border-r border-default': !isLandingPage }"
    >
      <UBreadcrumb
        :items="breadcrumbs"
        class="mb-8 -mt-12 font-mono"
        :ui="{ list: 'flex-wrap', linkLabel: 'truncate-none' }"
      />

      <UAlert
        v-if="deprecationReason"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :description="deprecationReason"
        class="mb-8"
      />

      <template v-if="isLandingPage">
        <template v-if="isFlat">
          <ApiSinglePageSection
            v-for="bucket in buckets"
            :key="bucket.id"
            :bucket="bucket"
          />
        </template>
        <ApiNamespaceLanding
          v-else
          title="Schema Documentation"
          description="Browse the workspace API by operation or schema type. Every page includes its definition, related fields, and examples when available."
          :items="overviewGroups"
        />
      </template>
      <ApiDocumentContent v-else :document="document" />
    </section>

    <ApiCodeColumn
      v-if="!isLandingPage"
      :definition-card="definitionCard"
      :example-cards="exampleCards"
    />
  </main>
  <main v-else-if="isNamespaceChooser" class="grid flex-1 grid-cols-1">
    <section
      class="api-document max-w-none overflow-y-auto p-8 lg:px-16 lg:py-20"
    >
      <UBreadcrumb
        :items="[{ label: 'API Reference' }]"
        class="mb-8 -mt-12 font-mono"
        :ui="{ list: 'flex-wrap', linkLabel: 'truncate-none' }"
      />

      <ApiNamespaceLanding
        title="Choose a Namespace"
        description="Select a schema namespace to browse the API documentation."
        :items="sections"
      />
    </section>
  </main>
  <div v-else class="flex-1 p-12 text-center text-muted">
    Loading documentation endpoint…
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "reference" });

const {
  route,
  baseURLPath,
  page,
  isLandingPage,
  isNamespaceChooser,
  isFlat,
  buckets,
  sections,
  overviewGroups,
  breadcrumbs,
  deprecationReason,
  document,
  definitionCard,
  exampleCards,
} = await useApiReferencePage();
</script>

<style>
/* Everything below styles rendered content only. Scoping to
   `.markdown-text-body` — the ContentRenderer wrapper — keeps it away from the
   hand-written landing markup that shares the `.api-document` column. */
/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body :is(h1, h2, h3) {
  color: var(--ui-text-highlighted);
  font-family: var(--font-serif);
  font-weight: 600;
  letter-spacing: 0;
}

.markdown-text-body h2 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 2.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--ui-border-accented);
}

.markdown-text-body h3 {
  font-size: 1.5rem;
  margin-top: 2.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--ui-border-muted);
}

/* The section heading carries the separator, so the first entry beneath it
   must not draw a second one. */
/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body h3 + h4 {
  border-top: 0;
  padding-top: 0.5rem;
}

.markdown-text-body h4 {
  color: var(--ui-primary);
  font-family: var(--font-mono);
  font-size: 1rem;
  margin-top: 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ui-border-muted);
}

.markdown-text-body p {
  color: var(--ui-text);
  font-size: 1rem;
  line-height: 1.5rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

/* The type/operation description renders in its own block above the collapsible
   sections and reads as a lead paragraph; everything inside a section is body
   copy, which `.markdown-text-body p` already sizes. */
.markdown-lead > p {
  font-size: 1.2rem;
  line-height: 1.75rem;
}

/* The section heading is now a collapsible trigger, so it carries the rule and
   spacing the `h3` used to draw. */
.section-trigger {
  justify-content: space-between;
  margin-top: 2.75rem;
  padding: 0 0 0.75rem;
  border-bottom: 1px solid var(--ui-border-muted);
  border-radius: 0;
}

.section-trigger:hover {
  background: transparent;
}

/* The trigger carries the separator, so the first entry beneath it must not
   draw a second one. */
.markdown-text-body > h4:first-child {
  border-top: 0;
  padding-top: 1rem;
}

.markdown-text-body a {
  color: var(--ui-primary);
  text-decoration: none;
}

/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body a[href^="/"]:not([href^="#"]) {
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--ui-primary);
  text-decoration-style: dotted;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body a[href^="/"]:not([href^="#"]):hover {
  background: color-mix(in oklch, var(--ui-primary) 20%, transparent);
  border-radius: 3px;
}

/* Nuxt UI hovers code-in-link via `&>code`, but generated entity links wrap the
   chip in a `.gqlmd-mdx-entity` span — the chip is a grandchild, so that never
   matches and the opaque chip also hides the anchor's own hover. Re-apply it
   for that shape, on links that actually navigate somewhere. */
/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body a:not([href^="#"]) > .gqlmd-mdx-entity > code {
  border-style: dashed;
  transition:
    color 0.15s,
    border-color 0.15s;
}

/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body a:not([href^="#"]):hover > .gqlmd-mdx-entity > code {
  border-color: var(--ui-primary);
  color: var(--ui-primary);
}

/* Self-anchors (`Folder.id`) only mark the field they head — nothing to follow,
   so they stay inert, including Nuxt UI's own underline-on-hover. */
/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body a[href^="#"]:hover {
  background: none;
  border-bottom-color: transparent;
}

/* The GraphQL definition is rendered separately in the code column. Hiding the
   `<pre>` alone leaves the ProsePre wrapper behind, whose absolutely-positioned
   copy button then floats over the prose — so the whole block goes. */
/* fallow-ignore-next-line css-selector-complexity -- targets generated markdown content */
.markdown-text-body div:has(> pre),
.markdown-text-body pre,
.markdown-text-body .code-block,
.markdown-text-body code::before,
.markdown-text-body code::after {
  display: none !important;
}
</style>
