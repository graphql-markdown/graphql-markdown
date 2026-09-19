import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineNuxtModule, useNuxt } from "@nuxt/kit";

/**
 * Generates GraphQL API documentation before @nuxt/content indexes the
 * content directory.
 *
 * The generation itself is an ordinary function call into the generator — the
 * programmatic entry point the layer advertises, and consuming projects' own
 * dogfooding of it. What has to be deliberate is *when* it runs.
 *
 * On a cold build (fresh clone, no generated files yet), a `build:before` hook
 * is too late: @nuxt/content parses the content directory during its own module
 * setup, so the collection is indexed from a directory that does not exist yet
 * and the generated pages 404. It only appears to work once a previous run has
 * left the files behind.
 *
 * FIX: run generation directly in this module's own `setup()`, awaited, and
 * list this module before "@nuxt/content" in the layer's `nuxt.config.ts`
 * `modules` array. Nuxt's `installModules` (in @nuxt/kit) installs modules
 * sequentially in a plain `for...of` loop with `await` on each one — verified
 * by reading `installModules`' source directly (node_modules/@nuxt/kit/dist/
 * index.mjs) — so a module earlier in the resolved list is fully installed,
 * setup() included, before the next one starts. Layer modules are also
 * confirmed to resolve before the consuming app's own modules: `resolveModules`
 * (in the `nuxt` package) builds the modules Map from `nuxt.options._layers
 * .map(l => l.config).reverse()`, so an extended layer's config (later in
 * `_layers`) is processed first and its modules land earlier in the Map's
 * insertion order, which `installModules` then honors.
 *
 * An earlier version of this module tried registering a `nuxt.hook("modules:
 * before", ...)` listener instead, reasoning that hook fires "before any
 * module's setup". That is true, but backwards for a module trying to listen
 * for it FROM one of its own setup() calls: `modules:before` is called once,
 * before `resolveModules`/`installModules` even run — so by the time this
 * module's own `setup()` executes (which is inside `installModules`), the
 * `modules:before` hook has already fired and the listener registered here
 * would never run. This was caught by actually running the fixture's cold
 * build and finding `content/` was never created — the hook design looked
 * more "correct" on paper but was empirically wrong; the plain direct-call
 * design below is what `graphql-markdown-docs/modules/demo.ts` (the reference
 * implementation this was adapted from) actually does, and it works.
 *
 * A consuming project provides a `generate-docs.ts` export at its root (or a
 * custom path via `nuxt.config.ts`'s `gqlmdGenerate.entry` option) with a
 * `generate()` function. This module invokes it at the right time in the
 * lifecycle.
 */
export default defineNuxtModule<{ entry?: string }>({
  meta: { name: "gqlmd-generate", configKey: "gqlmdGenerate" },
  defaults: { entry: "./generate-docs.ts" },
  async setup(options) {
    const nuxt = useNuxt();
    const entryPath = resolve(nuxt.options.rootDir, options.entry!);

    // Editing generate-docs.ts itself restarts the dev server and
    // regenerates. This module has no way to know which schema file(s) the
    // consumer's generate-docs.ts points at, so it cannot watch those too —
    // a consumer whose workflow depends on schema-file-triggered restarts
    // still needs their own `watch` entry for it, same as before this
    // module existed.
    nuxt.options.watch.push(entryPath);

    // Verified in T5's fixture cold-build test: plain dynamic import() of a
    // .ts file works here because nuxi's own process bootstraps through
    // jiti, which installs Node loader hooks for the whole process — not
    // something this module sets up itself.
    const { generate } = await import(pathToFileURL(entryPath).href);
    await generate();
  },
});
