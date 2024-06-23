const path = require("node:path/posix");
const { ReflectionKind } = require("typedoc");
const { MarkdownPageEvent } = require("typedoc-plugin-markdown");

// All plugins should export a `load()` function
module.exports = {
  load: (app) => {
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
  },
};
