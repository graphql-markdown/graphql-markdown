const { ReflectionKind } = require("typedoc");
const { FrontmatterEvent } = require("typedoc-plugin-frontmatter");

// All plugins should export a `load()` function
module.exports = {
  load: (app) => {
    // Listen to PREPARE_FRONTMATTER event
    app.renderer.on(FrontmatterEvent.PREPARE_FRONTMATTER, (event) => {
      // Update event.frontmatter object using information from the page model as JSON
      event.frontmatter = {
        // add a title
        title: event.page.model?.name,
        // add sidebar position for root project page
        ...(event.page.model?.kindOf(ReflectionKind.Project) && {
          sidebar_position: 1,
        }),
        // spread the existing frontmatter
        ...event.frontmatter,
      };
    });
  },
};
