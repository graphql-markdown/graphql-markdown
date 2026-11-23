---
sidebar_position: 55
pagination_prev: null
pagination_next: null
description: Publish a plain Markdown copy of every generated GraphQL page at `<page-url>.md`, for readers who want the source and for LLM agents, with a second GraphQL Config project and a hook.
keywords:
  - Markdown copy
  - view as Markdown
  - LLM
  - llms.txt
  - GraphQL documentation
---

# Markdown copies

Generated pages are framework pages, such as MDX with framework components. Readers can't download the Markdown version of one type, and LLM agents have to scrape the rendered HTML.

This guide publishes a plain Markdown copy of every generated page next to it, at `<page-url>.md`, the same convention [llms.txt](https://llmstxt.org/) uses. For example, the page `/types/objects/project` gets the copy `/types/objects/project.md`. The copies are plain GitHub-flavored Markdown: no MDX, no framework components, no front matter, and links between copies point to the other `.md` files.

No new setting is needed, and the same steps work with every framework:

1. A second GraphQL Config project renders the same schema with a plain-Markdown formatter into a folder of its own.
2. After the site build, that folder is copied into the build output, so each copy lands next to its page.
3. Optionally, a hook adds a "View as Markdown" link to every generated page.

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

## GraphQL Config

Add a `markdown` project next to your existing one, with the same schema and the same `baseURL`:

```js title="graphql.config.mjs"
// Formatter paths must be absolute: a relative path is not resolved from the project folder
const local = (path) => new URL(path, import.meta.url).href;

export default {
  projects: {
    default: {
      schema: "./schema.graphql",
      extensions: {
        "graphql-markdown": {
          // your existing settings, for example:
          rootPath: "./docs",
          baseURL: "schema",
        },
      },
    },
    // highlight-start
    markdown: {
      schema: "./schema.graphql",
      extensions: {
        "graphql-markdown": {
          rootPath: "./.markdown-copies",
          baseURL: "schema",
          formatter: local("./lib/markdown-copy.cjs"),
          homepage: false,
          docOptions: { sectionHeaderId: false },
        },
      },
    },
    // highlight-end
  },
};
```

- **`rootPath`**: a folder used only for the copies. Don't point it to a folder that holds other files, such as `public/` or `static/`: a forced run (`--force`) empties the output folder (`rootPath` and `baseURL`) first.
- **`baseURL`**: the same as the main project, so a copy has the same path as its page.
- **`homepage: false`**: the homepage is a page of your site, not a schema entity.
- **`docOptions.sectionHeaderId: false`**: no `{#id}` heading IDs, which plain Markdown doesn't support.

Keep the settings that change the content, such as `printTypeOptions`, the same in both projects. Add `.markdown-copies/` to `.gitignore` if you don't commit the generated docs.

## Generate and publish

Each project has its own command: `gqlmd graphql-to-doc` for the `default` project, and `gqlmd graphql-to-doc:markdown` for the `markdown` project. Run both, build the site, then copy the copies into the build output, under the URL path where the site serves the main project's `rootPath`:

```json title="package.json"
{
  "scripts": {
    "doc": "gqlmd graphql-to-doc && gqlmd graphql-to-doc:markdown",
    "build": "<your site build> && node -e \"require('node:fs').cpSync('.markdown-copies', 'dist', { recursive: true })\""
  }
}
```

Replace `dist` with your framework's build output. The defaults are:

| Framework                             | Copy `.markdown-copies` into                                          |
| ------------------------------------- | --------------------------------------------------------------------- |
| Astro, Starlight                      | `dist/`                                                               |
| Docusaurus                            | `build/docs/` (`docs` is the docs plugin's default `routeBasePath`)   |
| DocFX                                 | `_site/`                                                              |
| HonKit                                | `_book/`                                                              |
| Hugo, Zola                            | `public/`                                                             |
| mdBook                                | `book/`                                                               |
| MkDocs                                | `site/`                                                               |
| Next.js, Nuxt and other server builds | `public/`, before the build: the server only serves that folder as-is |

The copy uses Node.js, so it runs on every operating system. The site's base path, such as Astro's `base` or Docusaurus's `baseUrl`, is not part of the build output: don't add it.

:::tip

Frameworks that serve a folder as-is, such as `public/` or `static/`, also serve the copies in development when you copy them there before starting the dev server.

:::

## Link from each page

To add a "View as Markdown" link at the bottom of every generated page, add an `afterRenderTypeEntitiesHook` to the formatter of the main project. The hook runs after each page is written: it takes the page's path in the generated folder and appends a link to the copy with the same path.

```js title="lib/page-link.cjs"
const { readFile, writeFile } = require("node:fs/promises");
const { relative, sep } = require("node:path");

// The formatter of your main project
const preset = require("@graphql-markdown/formatters/starlight");

// Public URL of your generated pages' folder, origin included
const COPIES_URL = "https://example.com/schema";

const afterRenderTypeEntitiesHook = async (event) => {
  // Keep the preset's own hook, if any
  await preset.afterRenderTypeEntitiesHook?.(event);

  const { filePath, outputDir, outputAdapter } = event.data;
  const path = relative(outputDir, filePath)
    .split(sep)
    .join("/")
    .replace(/\.mdx?$/, "");
  const link = `\n\n[View as Markdown](${COPIES_URL}/${path}.md)\n`;

  // Use the output adapter when one is configured, the file system otherwise
  const page = outputAdapter?.readFile
    ? await outputAdapter.readFile(filePath)
    : await readFile(filePath, "utf8");
  const content = `${page.trimEnd()}${link}`;
  await (outputAdapter?.writeFile
    ? outputAdapter.writeFile(filePath, content)
    : writeFile(filePath, content));
};

module.exports = { ...preset, afterRenderTypeEntitiesHook };
```

Then make it the formatter of the main project, in `graphql.config.mjs`:

```js
// highlight-next-line
formatter: local("./lib/page-link.cjs"),
```

`COPIES_URL` is the full URL where the site serves your generated pages, for example `https://example.com/docs/schema`. Use an absolute URL with the origin: frameworks leave such links alone, whereas several of them rewrite or check links ending in `.md` as links to their own pages.

See [hooks](/docs/customize/hooks) for the other hooks a formatter can export.

## Docusaurus

With `@graphql-markdown/docusaurus`, run each project with its own plugin instance instead of `gqlmd`, and set the formatters in the plugin options:

```js title="docusaurus.config.js"
plugins: [
  ["@graphql-markdown/docusaurus", { formatter: require.resolve("./lib/page-link.cjs") }],
  [
    "@graphql-markdown/docusaurus",
    {
      id: "markdown",
      formatter: require.resolve("./lib/markdown-copy.cjs"),
    },
  ],
],
```

The commands are `docusaurus graphql-to-doc` and `docusaurus graphql-to-doc:markdown`. In `lib/page-link.cjs`, use the Docusaurus preset: `require("@graphql-markdown/docusaurus/mdx")`.

:::note

Up to `@graphql-markdown/cli` 1.3.0, the Docusaurus plugin ignores a `formatter` set in GraphQL Config: set it in the plugin options, as above.

:::
