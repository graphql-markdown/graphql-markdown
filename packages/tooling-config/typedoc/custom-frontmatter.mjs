// @ts-check

import path from "node:path/posix";
import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

/**
 * Compatibility hook for the root TypeDoc pipeline.
 *
 * typedoc-plugin-frontmatter provides the active behavior; this plugin keeps
 * the existing extension point in place after moving tooling files.
 *
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  // Listen to PREPARE_FRONTMATTER event
  app.renderer.on(MarkdownPageEvent.BEGIN, (event) => {
    const isProjectPage =
      event.isReflectionEvent() && event.model.kind === ReflectionKind.Project;

    // Update event.frontmatter object using information from the page model as JSON
    event.frontmatter = {
      // add a title
      title: path.basename(event.model?.name),
      // add sidebar position for root project page
      ...(isProjectPage && {
        sidebar_position: 1,
      }),
      // spread the existing frontmatter
      ...event.frontmatter,
    };
  });
}
