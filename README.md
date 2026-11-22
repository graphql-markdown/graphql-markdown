<p align="center">
  <a href="https://graphql-markdown.dev"><img src="https://user-images.githubusercontent.com/324670/188957463-dae99daa-763d-466e-91f4-0629f455df74.svg" alt="GraphQL-Markdown" /></a>
</p>

<h1 align="center">API docs from your GraphQL schema, in the docs site you already use</h1>

<p align="center">
  GraphQL-Markdown generates <b>Markdown and MDX documentation</b> from <b>GraphQL schemas</b> for Docusaurus, Nuxt, Starlight, Fumadocs, Vocs, Hugo, MkDocs, mdBook, DocFX, Zola, Docsify and more.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@graphql-markdown/core"><img src="https://img.shields.io/npm/dw/@graphql-markdown/core?label=weekly%20downloads&color=36c46f&style=flat" alt="npm weekly downloads" /></a>
  <a href="https://www.npmjs.com/package/@graphql-markdown/cli"><img src="https://img.shields.io/npm/v/@graphql-markdown/cli?label=version&style=flat" alt="npm version" /></a>
  <a href="https://github.com/graphql-markdown/graphql-markdown/stargazers"><img src="https://img.shields.io/github/stars/graphql-markdown/graphql-markdown?style=flat" alt="GitHub stars" /></a>
  <a href="https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE"><img src="https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat" alt="MIT license" /></a>
</p>

<p align="center">
  <a href="https://graphql-markdown.dev/docs/get-started"><b>Documentation</b></a> ·
  <a href="#live-demos"><b>Live demos</b></a> ·
  <a href="https://graphql-markdown.dev/docs/try-it"><b>Try it</b></a> ·
  <a href="https://graphql-markdown.dev/showcase"><b>Showcase</b></a>
</p>

## Quick start

Run the scaffolder in an empty folder to create a new project, or inside an existing documentation site to add GraphQL-Markdown to it:

```shell
npm create graphql-markdown-docs@latest
```

New projects can be a Nuxt site (default), a Docusaurus site, or plain Markdown or MDX output with no site (`--framework markdown` or `--framework mdx`). In an existing site, the scaffolder detects the framework and writes a `.graphqlrc` and a `gqlmd` script. See the [Getting started guide](https://graphql-markdown.dev/docs/get-started) for options.

## Live demos

Same generator, your framework. Click any screenshot to explore the live site.

<table>
  <tr>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-docusaurus/"><img src=".github/assets/demos/demo-docusaurus.jpg" alt="Docusaurus demo" /></a>
      <br /><b>Docusaurus</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-nuxt/api-reference"><img src=".github/assets/demos/demo-nuxt.jpg" alt="Nuxt demo" /></a>
      <br /><b>Nuxt</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-astro-starlight/"><img src=".github/assets/demos/demo-astro-starlight.jpg" alt="Astro / Starlight demo" /></a>
      <br /><b>Astro / Starlight</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-nextjs-fumadocs/docs"><img src=".github/assets/demos/demo-nextjs-fumadocs.jpg" alt="Next.js / Fumadocs demo" /></a>
      <br /><b>Next.js / Fumadocs</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-docus/docs"><img src=".github/assets/demos/demo-docus.jpg" alt="Nuxt / Docus demo" /></a>
      <br /><b>Nuxt / Docus</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-vite-vocs"><img src=".github/assets/demos/demo-vite-vocs.jpg" alt="Vite / Vocs demo" /></a>
      <br /><b>Vite / Vocs</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-hugo/"><img src=".github/assets/demos/demo-hugo.jpg" alt="Hugo demo" /></a>
      <br /><b>Hugo</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-mkdocs/"><img src=".github/assets/demos/demo-mkdocs.jpg" alt="MkDocs demo" /></a>
      <br /><b>MkDocs</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-mdbook/graphql/index.html"><img src=".github/assets/demos/demo-mdbook.jpg" alt="mdBook demo" /></a>
      <br /><b>mdBook</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-docfx"><img src=".github/assets/demos/demo-docfx.jpg" alt="DocFX demo" /></a>
      <br /><b>DocFX</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-honkit"><img src=".github/assets/demos/demo-honkit.jpg" alt="HonKit demo" /></a>
      <br /><b>HonKit</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-zola/graphql/types/objects/project/"><img src=".github/assets/demos/demo-zola.jpg" alt="Zola demo" /></a>
      <br /><b>Zola</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-docsify/#/graphql/types/objects/project"><img src=".github/assets/demos/demo-docsify.jpg" alt="Docsify demo" /></a>
      <br /><b>Docsify</b>
    </td>
    <td align="center" width="33%">
      <a href="https://graphql-markdown.dev/demo-pelican/graphql/types/objects/project/"><img src=".github/assets/demos/demo-pelican.jpg" alt="Pelican demo" /></a>
      <br /><b>Pelican</b><br /><sub>custom formatter</sub>
    </td>
    <td align="center" width="33%">
      <b>Your stack?</b>
      <br />Use the generic <code>mdx</code> preset, or <a href="https://graphql-markdown.dev/docs/try-it">fork a demo</a> and try it with your own schema.
    </td>
  </tr>
</table>

Used in production by [30+ teams](https://graphql-markdown.dev/showcase) including Saleor, Sui, IOTA, Swan, Sablier, and Browserless. [Add your site](https://github.com/graphql-markdown/graphql-markdown/issues/1601).

## Manual installation

To set it up by hand instead of using the scaffolder, there are two main setup paths:

- use the official Docusaurus integration for Docusaurus sites
- use the CLI with formatter presets for other supported ecosystems such as Starlight, Fumadocs, Vocs, Hugo, MkDocs, DocFX, mdBook, HonKit, Zola and Docsify, or the generic `mdx` preset for any MDX-based site

Choose your preferred package based on your documentation stack:

```shell
# For Docusaurus sites
npm install @graphql-markdown/docusaurus graphql

# For formatter-based setups
npm install @graphql-markdown/cli @graphql-markdown/formatters graphql
```

## Usage

### Docusaurus Plugin

Add to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: ["@graphql-markdown/docusaurus"],
};
```

Run the generation command:

```shell
npx docusaurus graphql-to-doc
```

### CLI Usage

Use the CLI directly for custom workflows, or pair it with `@graphql-markdown/formatters` to adapt the generated output for supported frameworks.

```shell
npx gqlmd graphql-to-doc --schema ./schema.graphql --root ./docs
```

For formatter-based setups:

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    formatter: "@graphql-markdown/formatters/hugo"
```

### API Usage

For programmatic usage, you can use the CLI package:

```typescript
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

const config = {
  schema: "./schema.graphql",
  rootPath: "./docs",
};

await runGraphQLMarkdown(config);
```

See [API documentation](https://graphql-markdown.dev/api/) and our [Framework Integration page](https://graphql-markdown.dev/docs/guides/other-frameworks) for the full list of supported formatter presets.

## Configuration

See [documentation configuration](https://graphql-markdown.dev/docs/reference/configuration) page.

## Troubleshooting

See [documentation troubleshooting](https://graphql-markdown.dev/docs/troubleshooting) page.

## License

[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/graphql-markdown/graphql-markdown)

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Contributions

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CodSpeed](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://app.codspeed.io/graphql-markdown/graphql-markdown?utm_source=badge)
[![NPM Last Update](https://img.shields.io/npm/last-update/%40graphql-markdown%2Fcli)](https://www.npmjs.com/package/@graphql-markdown/cli)

[Contributions](https://github.com/graphql-markdown/graphql-markdown/blob/main/CONTRIBUTING.md), issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!

<p align="center">
  <a href="https://github.com/graphql-markdown/graphql-markdown/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=graphql-markdown/graphql-markdown&columns=8" alt="Contributors" />
  </a>
</p>

<p align="center">
  If GraphQL-Markdown saves you time, a <a href="https://github.com/graphql-markdown/graphql-markdown">⭐ on GitHub</a> helps other people find it.
</p>
