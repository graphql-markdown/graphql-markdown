import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * TypeDoc plugin to prevent _media folder generation.
 *
 * The typedoc-plugin-markdown renderer creates a _media folder by copying
 * files from project.files, which incorrectly includes module source files
 * for files with @packageDocumentation tags. This plugin removes those
 * unwanted _media directories after rendering completes.
 *
 * @param {import('typedoc').Application} app
 */
export function load(app) {
  app.renderer.postRenderAsyncJobs.push(async (event) => {
    const mediaPath = join(event.outputDirectory, '_media');

    if (existsSync(mediaPath)) {
      rmSync(mediaPath, { recursive: true, force: true });
      app.logger.info(
        `[no-media-plugin] Removed _media directory from ${event.outputDirectory}`,
      );
    }
  });
}
