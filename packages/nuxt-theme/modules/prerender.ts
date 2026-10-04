import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

import { defineNuxtModule, useNuxt } from "@nuxt/kit";
import { DEFAULT_BASE_URL } from "../constants";

/**
 * Enumerates every generated content route for the prerenderer.
 *
 * Nitro's `crawlLinks` only reaches a page if something links to it. The
 * reference layout uses `UContentNavigation` with collapsible sections, so
 * nested pages never appear in the server-rendered HTML the crawler reads.
 * Relying on crawlLinks alone silently drops most nested API pages — the site
 * generates successfully but serves 404s for entire branches of the reference.
 *
 * This module walks the generated content directory and extracts all routes
 * directly, registering them with Nitro's prerenderer to ensure nothing gets
 * missed.
 *
 * The mapping from file to route is the same one \@nuxt/content applies, so the
 * directory can be walked directly rather than queried:
 *
 *   content/api-reference/queries/user.md -\> /api-reference/queries/user
 *   content/api-reference/types/objects/user.md -\> /api-reference/types/objects/user
 */

export const walk = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        out.push(...(await walk(full)));
      } else if (entry.name.endsWith(".md")) {
        out.push(full);
      }
    }
  } catch {
    // Directory does not exist yet; that's ok.
  }
  return out;
};

/**
 * Maps a content file path to its final route.
 * Special case: any `.../generated.md` becomes the route for its own
 * directory — `content/api-reference/generated.md` -\> `/api-reference`, and
 * for a multi-schema namespace, `content/api-reference/schema-a/generated.md`
 * -\> `/api-reference/schema-a`, with no assumption about how many segments
 * precede `generated`. "generated" is only ever emitted once per
 * `createGenerateDocs` call, at that call's own baseURL root, so "drop the
 * trailing `generated` segment" is correct regardless of nesting depth — a
 * strict generalization of the old exactly-2-segments check, which is why
 * the existing single-schema fixture test still passes unmodified against
 * this version.
 */
export const routeFor = (
  contentDir: string,
  file: string,
): string | undefined => {
  const relativePath = relative(contentDir, file);
  const segments = relativePath.replace(/\.md$/, "").split(sep);

  if (segments.at(-1) === "generated") {
    return `/${segments.slice(0, -1).join("/")}`;
  }

  // All other pages: map directly
  return `/${segments.join("/")}`;
};

export default defineNuxtModule({
  meta: {
    name: "gqlmd-prerender",
  },
  setup() {
    const nuxt = useNuxt();

    nuxt.hook("nitro:init", (nitro) => {
      nitro.hooks.hook("prerender:routes", async (routes) => {
        // The content root where generated markdown lives
        const contentRoot = join(nuxt.options.rootDir, "content");

        for (const file of await walk(contentRoot)) {
          const route = routeFor(contentRoot, file);
          if (route) routes.add(route);
        }

        // The bare shared-prefix root (e.g. `/api-reference`) has no backing
        // content file when every schema is generated under a nested baseURL
        // (a multi-schema setup) — [...slug].vue's namespace-selector
        // fallback still needs to be reachable there. A no-op/duplicate add
        // for the default single-schema case, since that route is already
        // registered by the walk above via its own `generated.md`.
        const appConfig = nuxt.options.appConfig as {
          gqlmd?: { baseURL?: string };
        };
        const baseURL = appConfig.gqlmd?.baseURL ?? DEFAULT_BASE_URL;
        routes.add(`/${baseURL}`);
      });
    });
  },
});
