---
sidebar_position: 55
pagination_prev: null
pagination_next: null
description: Publish a plain Markdown copy of every generated GraphQL page at `<page-url>.md`, for readers who want the source and for LLM agents, with a second GraphQL Config project.
keywords:
  - Markdown copy
  - view as Markdown
  - LLM
  - llms.txt
  - GraphQL documentation
---

# Markdown copies

Generated pages are framework pages, such as Docusaurus MDX with components. Readers can't download the Markdown version of one type, and LLM agents have to scrape the rendered HTML.

This guide publishes a plain Markdown copy of every generated page next to it, at `<page-url>.md`, the same convention [llms.txt](https://llmstxt.org/) uses. For example, `/types/objects/project` gets `/types/objects/project.md`. The copies are plain GitHub-flavored Markdown: no MDX, no framework components, no front matter, and links between copies point to the other `.md` files.

No new setting is needed: a second project renders the same schema with a plain-Markdown formatter into a folder the framework serves as static files.

## How it works

1. The first project generates the documentation pages as usual.
2. A second project generates the same schema with a formatter that prints plain Markdown and links pages with relative `.md` paths.
3. Its `rootPath` is a folder the framework copies as-is into the build, so each copy lands next to its page.

The example below uses Docusaurus. The same pattern works with any framework that serves a static folder: point the second project's `rootPath` to it.

## Formatter

Start from the [mdBook preset](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/formatters/src/mdbook): it prints no front matter, a `# Title` heading, `> [!TYPE]` callouts and page-relative `.md` links. Override the few functions that still print HTML:

```js title="lib/markdown-copy.cjs"
const mdbook = require("@graphql-markdown/formatters/mdbook");

module.exports = {
  ...mdbook,
  // `Type.field` instead of HTML spans
  formatMDXNameEntity: (name, parentType) =>
    `\`${parentType ? `${parentType}.${name}` : name}\``,
  formatMDXBullet: (text = "") => ` · ${text}`,
  formatMDXPermalink: () => "",
  formatMDXSpecifiedByLink: (url) => `\n\nSpecified by: <${url}>`,
  // mdBook's `SUMMARY.md` is not needed for the copies
  afterRenderFilesHook: async () => {},
};
```

`@graphql-markdown/formatters` must be installed:

```shell
npm install @graphql-markdown/formatters
```

See [custom formatter](/docs/customize/custom-formatter) for the functions a formatter can override.

## Docusaurus

### GraphQL Config

Add a `markdown` project next to the `default` one, with the same schema:

```yaml title=".graphqlrc"
projects:
  default:
    schema: "./schema.graphql"
    extensions:
      graphql-markdown:
        rootPath: "./docs"
        baseURL: "schema"
  # highlight-start
  markdown:
    schema: "./schema.graphql"
    extensions:
      graphql-markdown:
        rootPath: "./static-md/docs"
        baseURL: "schema"
        homepage: false
        docOptions:
          sectionHeaderId: false
  # highlight-end
```

- **`rootPath`**: a dedicated static folder followed by the docs plugin's [`routeBasePath`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#routeBasePath), `docs` by default. A page at `/docs/schema/types/objects/project` then gets its copy at `/docs/schema/types/objects/project.md`. If `routeBasePath` is `/`, use `./static-md`. Don't use `static/` itself: a forced run (`--force`) cleans the output folder and would delete your images.
- **`baseURL`**: the same as the `default` project.
- **`homepage: false`**: the default homepage is a Docusaurus page, not needed in the copies.
- **`docOptions.sectionHeaderId: false`**: no `{#id}` heading IDs, which plain Markdown doesn't support.

Keep the other settings that change the content, such as `printTypeOptions`, the same in both projects.

### Plugin instances

Declare a second plugin instance whose `id` matches the project name, and serve the copies folder as a static directory:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    "@graphql-markdown/docusaurus",
    // highlight-start
    [
      "@graphql-markdown/docusaurus",
      {
        id: "markdown",
        formatter: require.resolve("./lib/markdown-copy.cjs"),
      },
    ],
    // highlight-end
  ],
  // highlight-next-line
  staticDirectories: ["static", "static-md"],
};
```

:::note

Set `formatter` in the plugin options, as above. Up to `@graphql-markdown/cli` 1.3.0, the Docusaurus plugin ignores a `formatter` set in GraphQL Config.

:::

### Generate

Each plugin instance has its own command. Run both before building the site:

```json title="package.json"
{
  "scripts": {
    "doc": "docusaurus graphql-to-doc && docusaurus graphql-to-doc:markdown"
  }
}
```

Add the copies folder to `.gitignore` if you don't commit the generated docs:

```text title=".gitignore"
/static-md/
```

After `docusaurus build`, each copy sits next to its page, for example `build/docs/schema/types/objects/project.md`, and is served as `text/markdown`. The site's `baseUrl` applies to the copies too.

### Link from the page

To add a "View as Markdown" link at the bottom of each generated page, wrap the doc footer:

```shell
npm run swizzle @docusaurus/theme-classic DocItem/Footer -- --wrap --typescript
```

```tsx title="src/theme/DocItem/Footer/index.tsx"
import React, { type ReactNode } from "react";
import Footer from "@theme-original/DocItem/Footer";
import type FooterType from "@theme/DocItem/Footer";
import type { WrapperProps } from "@docusaurus/types";
import { useLocation } from "@docusaurus/router";

type Props = WrapperProps<typeof FooterType>;

// Generated pages: <category>/<group>/<page>, with the default `api` hierarchy
const GENERATED = /\/(types|operations)\/[^/]+\/[^/]+\/?$/;

export default function FooterWrapper(props: Props): ReactNode {
  const { pathname } = useLocation();
  const href = GENERATED.test(pathname)
    ? `${pathname.replace(/\/$/, "")}.md`
    : undefined;

  return (
    <>
      {href && (
        <p className="margin-top--lg">
          <a href={href} target="_blank" rel="noopener">
            View as Markdown
          </a>
          {" · "}
          <a href={href} download>
            Download
          </a>
        </p>
      )}
      <Footer {...props} />
    </>
  );
}
```

`GENERATED` matches the default [`hierarchy`](/docs/reference/settings#printtypeoptions) (`api`). Adjust it to your hierarchy so that only generated pages get the link.
