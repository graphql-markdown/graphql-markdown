import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { defineNuxtConfig } from "nuxt/config";
import type { Component } from "nuxt/schema";

const layerDir = fileURLToPath(new URL(".", import.meta.url));

const MDC_INJECTED_COMPONENTS = new Set(["UBadge", "UAlert"]);

export default defineNuxtConfig({
  modules: [
    join(layerDir, "modules/generate"),
    "@nuxt/content",
    "@nuxt/ui",
    join(layerDir, "modules/prerender"),
  ],
  css: [join(layerDir, "app/assets/css/main.css")],
  content: {},
  hooks: {
    // api-document.ts injects these into rendered markdown at runtime, so
    // Nuxt Content never sees them in the content manifest; production builds
    // only bundle manifest or global components, leaving raw <UBadge>/<UAlert>.
    "components:extend": (components: Component[]) => {
      for (const component of components) {
        if (MDC_INJECTED_COMPONENTS.has(component.pascalName)) {
          component.global = true;
        }
      }
    },
  },
});
