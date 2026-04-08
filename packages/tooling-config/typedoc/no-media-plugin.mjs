// @ts-check

import { rm } from "node:fs/promises";
import { join } from "node:path";
import { RendererEvent } from "typedoc";

/**
 * Remove markdown plugin media output that should not be published.
 *
 * @param {import('typedoc').Application} app
 */
export function load(app) {
  app.renderer.on(RendererEvent.END, async (event) => {
    const mediaDir = join(event.outputDirectory, "_media");

    try {
      await rm(mediaDir, { recursive: true, force: true });
      app.logger.info(
        `[no-media-plugin] Removed _media directory from ${event.outputDirectory}`,
      );
    } catch {
      // Ignore cleanup failures to avoid blocking docs generation.
    }
  });
}
