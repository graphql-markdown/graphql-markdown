// @ts-check
import path from "node:path/posix";
import { ReflectionKind } from 'typedoc';
import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  // Listen to PREPARE_FRONTMATTER event
  app.renderer.on(MarkdownPageEvent.BEGIN, (event) => {
    // Update event.frontmatter object using information from the page model as JSON
    event.frontmatter = {
      // add a title
      title: path.basename(event.model?.name),
      // add sidebar position for root project page
      ...(event.model?.kindOf(ReflectionKind.Project) && {
        sidebar_position: 1,
      }),
      // spread the existing frontmatter
      ...event.frontmatter,
    };
  });
};
