import { fileURLToPath } from "node:url";
import { join } from "node:path";

const layerDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNuxtConfig({
  modules: [
    join(layerDir, "modules/generate"),
    "@nuxt/content",
    "@nuxt/ui",
    join(layerDir, "modules/prerender"),
  ],
  css: [join(layerDir, "app/assets/css/main.css")],
  content: {},
});
