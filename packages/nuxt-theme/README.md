# @graphql-markdown/nuxt-theme

A Nuxt layer that turns a GraphQL schema into a browsable API reference site — built on [GraphQL-Markdown](https://graphql-markdown.dev/), [Nuxt Content](https://content.nuxt.com/), and [Nuxt UI](https://ui.nuxt.com/). Extend it from your own Nuxt project and you get the two-column reference layout (prose on the left, schema definitions and examples on the right), navigation, search, and generation wired up — no theme code of your own required to start.

For the CLI that scaffolds a project around this layer in one command, see [`create-graphql-markdown-docs`](../create-graphql-markdown-docs).

## Quick start

```bash
npm install @graphql-markdown/nuxt-theme
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@graphql-markdown/nuxt-theme"],
});
```

Two more files are required in your own project (not provided by the layer — see "Fixed contract" below):

```ts
// content.config.ts
import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({ type: "page", source: "api-reference/**/*.md" }),
  },
});
```

```ts
// generate-docs.ts
import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

export const generate = createGenerateDocs({
  schema: "./schema/your-schema.graphql",
});
```

`npm run dev` / `npm run generate` / `npm run build` — the layer's own `gqlmd-generate` module calls `generate()` at the right point in Nuxt's startup, before Nuxt Content indexes the directory, so this works correctly from a fresh clone with nothing generated yet.

## Customize without swizzling

Everything here is config- or CSS-driven — no file copying, and every value keeps working across layer upgrades.

### `app.config.ts`

```ts
export default defineAppConfig({
  gqlmd: {
    siteTitle: "GraphQL API",   // SiteHeader's link label
    githubUrl: undefined,        // set to show a GitHub button in the header; omitted, the button doesn't render
    shikiTheme: "github-dark",   // Shiki theme for the code column
    baseURL: "api-reference",    // must match content.config.ts's glob prefix and every createGenerateDocs call's baseURL
  },
});
```

| Key | Default | Description |
| --- | --- | --- |
| `gqlmd.siteTitle` | `'GraphQL API'` | Text shown in the header's home link. |
| `gqlmd.githubUrl` | `undefined` | Repository URL for the header's GitHub button. Unset, the button is omitted entirely rather than rendered disabled. |
| `gqlmd.shikiTheme` | `'github-dark'` | [Shiki](https://shiki.style/) theme name used to highlight the schema/example code column. |
| `gqlmd.baseURL` | `'api-reference'` | The shared route prefix navigation, search, and the landing page all resolve against. See "Multi-schema setups" below — this must agree with `content.config.ts`'s glob and every `createGenerateDocs` call's own `baseURL`. |

Your own `app.config.ts` deep-merges over these — Nuxt's built-in behavior across `extends` layers, nothing this package does itself. You can also set `ui.colors.primary`/`ui.colors.neutral` (Nuxt UI's own keys) the same way.

### CSS custom properties

Defined in the layer's `main.css`, overridable from your own project's stylesheet (imported after the layer's, or targeting `:root` directly):

| Property | Default | Controls |
| --- | --- | --- |
| `--gqlmd-sidebar-width` | `20rem` | Reference page sidebar width. |
| `--gqlmd-badge-bg` / `--gqlmd-badge-text` | neutral-tinted | Default schema badge (`scalar`, `object`, `non-null`, …) colors. |
| `--gqlmd-badge-deprecated-bg` / `--gqlmd-badge-deprecated-text` | warning-tinted | The `deprecated` badge specifically. |
| `--gqlmd-callout-deprecated-bg` / `--gqlmd-callout-deprecated-border` | error-tinted | The deprecation notice callout. |
| `--gqlmd-code-text` | `#e4e4e7` | The code column's text color (its background comes from Nuxt UI's own `bg-accented`, not a `--gqlmd-*` token). |

These style the classes the default formatter emits (`gqlmd-mdx-badge-*`, `api-deprecation-callout`) directly in the generated markdown — they don't reach every page, though: `app/utils/api-document.ts` promotes badges and the deprecation callout into `UBadge`/`UAlert` Nuxt UI components before render on the reference page itself, so those two properties style the *generated markdown* as parsed content, while the reference page's own badges/callouts follow Nuxt UI's own `color`/`variant` styling instead. Both code paths exist because the raw classes still matter for anything that renders the markdown directly (search results, raw content queries).

## Customize by swizzling

For changes config and CSS can't reach — different markup, different components entirely — eject a file into your own project with:

```bash
npx gqlmd-swizzle                              # interactive picker
npx gqlmd-swizzle --list                       # list swizzlable components as JSON
npx gqlmd-swizzle --component SiteHeader       # non-interactive
npx gqlmd-swizzle --component SiteHeader --force   # overwrite without prompting
npx gqlmd-swizzle --check                      # warn about swizzled files older than the installed layer version
```

| id | Description |
| --- | --- |
| `SiteHeader` | Top navigation bar. |
| `SiteFooter` | Bottom attribution bar. |
| `SchemaCodeCard` | Highlighted code panel (schema definitions and examples). |
| `ApiOverviewGrid` | Card grid for displaying API reference overview and namespace sections. |
| `ApiNamespaceLanding` | Header and grid for API reference landing pages and namespace chooser. |
| `ApiDocumentContent` | Document content with collapsible sections for API reference pages. |
| `ApiCodeColumn` | Code column sidebar with highlighted schema definitions and examples. |
| `ReferenceLayout` | Sidebar + header chrome around the reference page. |
| `ReferencePage` | The two-column reference page itself. |

A swizzled file is copied into your project at the same relative path (Nuxt's own layer file-resolution then picks it up automatically — no config needed) and stamped with a comment recording the layer version it came from:

```vue
<!-- swizzled from @graphql-markdown/nuxt-theme@0.1.0 -->
```

**A swizzled file stops receiving layer updates.** It's a full copy, not an override hook — if the layer changes that file in a later release, your copy doesn't change with it. Run `npx gqlmd-swizzle --check` after upgrading the layer to see which of your swizzled files have drifted from a newer upstream version, so you know what to review.

## Multi-schema setups

Two or more schemas can share one site as distinct, fully isolated sections —
call `createGenerateDocs` once per schema, each with its own `baseURL`
nested under the same shared prefix:

```ts
// generate-docs.ts
import { createGenerateDocs } from "@graphql-markdown/nuxt-theme/generate";

const generateBilling = createGenerateDocs({
  schema: "./schema/billing.graphql",
  baseURL: "api-reference/billing",
});
const generateInventory = createGenerateDocs({
  schema: "./schema/inventory.graphql",
  baseURL: "api-reference/inventory",
});

export const generate = async () => {
  await generateBilling();
  await generateInventory();
};
```

`content.config.ts` needs no changes — its glob (`api-reference/**/*.md`)
already matches any nesting depth, so one collection covers every schema.
Navigation, search, and the landing page all derive their structure from
however deep each generated page's path actually is under `gqlmd.baseURL`,
so `billing` and `inventory` render as separate top-level sections with their
own section/group levels underneath, not merged or collapsed.

Each schema gets its own landing page automatically (at `/api-reference/billing`,
`/api-reference/inventory`) — there's no extra config for this, every
`createGenerateDocs` call already produces one. The bare shared prefix
(`/api-reference` itself, when nothing is generated directly there) falls
back to a "choose a namespace" page listing every top-level section.

**These three settings are independent by design, not auto-synced — keep
them in agreement yourself:**

| Setting | Where | Purpose |
| --- | --- | --- |
| `createGenerateDocs({ baseURL })` | `generate-docs.ts`, once per schema | Where that schema's files get written. |
| `gqlmd.baseURL` | `app.config.ts` | The shared prefix the UI resolves navigation/search/landing against. |
| `source` glob prefix | `content.config.ts` | What Nuxt Content actually indexes. |

They can't be synced automatically: `content.config.ts`'s glob is evaluated
statically by Nuxt Content, in a context neither the build-time generator nor
the runtime Vue UI can reach. In practice this only matters if you change
`gqlmd.baseURL` away from the default `"api-reference"` — every
`createGenerateDocs` call's `baseURL` still needs to start with whatever you
set it to, and `content.config.ts`'s glob prefix needs to match.

## Fixed contract (not configurable in this version)

Two things remain load-bearing assumptions rather than options, by design for now:

- **`content.config.ts` must exist in your own project**, not just the layer — Nuxt Content scopes each layer's own `content.config.ts` to that layer's directory, so a collection declared only in the layer would never see files your project generates. Copy the snippet under "Quick start" above.
- **The reference page's code-column parsing (`app/utils/api-document.ts`) assumes graphql-markdown's default section/heading structure.** Custom `decorators`/`customSections` with unusual `position` values can render into the wrong column or go missing from it.

## Design notes

`modules/generate.ts` calls `generate()` directly inside its own Nuxt module `setup()`, relying on declared module order (listed before `@nuxt/content` in this layer's own `nuxt.config.ts`) rather than a lifecycle hook — verified against `@nuxt/kit`'s actual module-installation code (`installModules` runs modules sequentially, awaiting each; `resolveModules` processes an extended layer's modules before the consuming app's own). `modules/prerender.ts` walks the generated content directory directly for Nitro's `prerender:routes` hook, because Nitro's crawler-based prerenderer misses pages behind collapsed navigation sections — both are adapted from equivalent fixes already shipping in the `graphql-markdown/docs` repository.

## License

MIT.
