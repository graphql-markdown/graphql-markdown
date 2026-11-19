import { defineNuxtModule, useNuxt } from "@nuxt/kit";
import type { Component } from "nuxt/schema";

const MDC_INJECTED_COMPONENTS = new Set(["UBadge", "UAlert"]);

/**
 * Marks the MDC components that api-document.ts injects into rendered markdown
 * at runtime as global.
 *
 * api-document.ts injects these into rendered markdown at runtime, so Nuxt
 * Content never sees them in the content manifest; production builds only
 * bundle manifest or global components, leaving raw <UBadge>/<UAlert>.
 */
export const markInjectedComponentsGlobal = (components: Component[]): void => {
  for (const component of components) {
    if (MDC_INJECTED_COMPONENTS.has(component.pascalName)) {
      component.global = true;
    }
  }
};

export { MDC_INJECTED_COMPONENTS };

export default defineNuxtModule({
  meta: {
    name: "gqlmd-mdc-components",
  },
  setup() {
    const nuxt = useNuxt();

    nuxt.hook("components:extend", (components: Component[]) => {
      markInjectedComponentsGlobal(components);
    });
  },
});
