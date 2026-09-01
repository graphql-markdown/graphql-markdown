---
description: Send generated GraphQL documentation somewhere other than the local filesystem. Write a custom output adapter for an object store, a CMS, or an in-memory map.
keywords:
  - GraphQL-Markdown output adapter
  - custom output destination
  - object storage
  - headless CMS
  - filesystem
---

# Output Adapter

By default every generated page is written to the local filesystem, under [`rootPath`](/docs/settings#rootpath)/[`baseURL`](/docs/settings#baseurl). The [`outputAdapter`](/docs/settings#outputadapter) setting replaces that destination with one of your own — an object store, a headless CMS, a database, an in-memory map in a test — without forking the renderer.

This page covers what the renderer expects from an adapter. For the setting itself and a complete Cloudflare R2 example, see [`outputAdapter`](/docs/settings#outputadapter) in the settings reference.

## The contract

```ts
interface OutputAdapter {
  writeFile: (filePath: string, content: string) => Promise<void>;
  readFile: (filePath: string) => Promise<string | undefined>;
  ensureDir?: (
    dirPath: string,
    options?: { forceEmpty?: boolean },
  ) => Promise<void>;
}
```

`writeFile` and `readFile` are required. `ensureDir` is optional, so a destination with no directory concept can leave it out — but read [Deleted types](#deleted-types) before you do.

## When each method is called

| Method | Called |
| --- | --- |
| `ensureDir` | once for the output directory when generation starts, then once per category directory by the Docusaurus and Hugo presets |
| `writeFile` | once per type page, once for the homepage, plus any navigation file the preset maintains (`_category_.yml`, `_index.md`, `toc.yml`, `SUMMARY.md`) |
| `readFile` | once per page for the DocFX, mdBook and MkDocs presets, once per category for Docusaurus, and once per navigation file a preset maintains |

An adapter is used for the whole run: there is no per-page opt-out.

## Paths are keys

The paths handed to an adapter are the ones the filesystem writer would use. Two properties matter if you map them onto something that is not a filesystem:

**They are relative to the working directory**, not absolute, unless [`rootPath`](/docs/settings#rootpath) is itself absolute. With the default `rootPath: "./docs"` and `baseURL: "schema"`, a page arrives as `docs/schema/types/objects/book.md`. Key off them directly, or make them relative to `outputDir` — do not assume a leading `/`.

**One path sits outside the output directory.** mdBook requires `SUMMARY.md` one level above the generated pages, so an adapter that computes keys with `path.relative(outputDir, filePath)` gets a leading `..` for that one file. Fold it away, or handle it explicitly, if your destination rejects such keys:

```js
const toKey = (location) =>
  path
    .relative(outputDir, location)
    .split(path.sep)
    .filter((segment) => segment !== "..")
    .join("/");
```

Use forward slashes in keys regardless of the OS that generated them, so the same schema produces the same keys everywhere.

## Reading back

Some presets post-process what they just wrote: DocFX rewrites `uid` values and builds `toc.yml`, mdBook and MkDocs rewrite internal links to relative paths, and Docusaurus checks whether a `_category_.yml` already exists before replacing it.

That is what `readFile` is for. It returns `undefined` when there is nothing at the path — a normal answer, not a failure.

A destination that genuinely cannot serve back what it wrote may return `undefined` always, but then:

- DocFX, mdBook and MkDocs cannot rewrite internal links, which stay as absolute paths, and DocFX produces no `toc.yml`
- Docusaurus regenerates `_category_.yml` on every run, discarding edits made to it by hand

The first page that cannot be read back is reported once for that adapter, rather than once per page, so a broken destination is visible without burying the run in identical errors.

## Deleted types

`ensureDir` receives `{ forceEmpty: true }` when [`force`](/docs/settings#force) is set, which is how a run clears out what a previous one left behind. Omit `ensureDir` and `force` has nothing to act on: pages for types deleted from the schema stay in the destination forever.

A destination with no directories still usually wants `ensureDir` for exactly that reason — deleting by key prefix is the natural equivalent. Leave it out only when the destination is disposable or pruned elsewhere.

## Formatting

Content arrives already formatted, so an adapter never handles [`pretty`](/docs/settings#pretty) itself. Prettifying happens before the adapter is called, so every destination receives identical bytes.

## An adapter for tests

The smallest useful adapter keeps pages in memory, which makes generated output straightforward to assert against:

```js
const pages = new Map();

export const memoryOutputAdapter = {
  writeFile: async (filePath, content) => {
    pages.set(filePath, content);
  },
  readFile: async (filePath) => pages.get(filePath),
  ensureDir: async (dirPath, options) => {
    if (options?.forceEmpty !== true) {
      return;
    }

    for (const filePath of pages.keys()) {
      if (filePath.startsWith(dirPath)) {
        pages.delete(filePath);
      }
    }
  },
};
```

This supports read-back, so every preset works against it.

## Generation still runs under Node

`outputAdapter` changes where documentation is written, not what runs it. `@graphql-markdown/core` and its dependencies use Node built-ins, so generation happens under Node — in a build step or a CI job — and the adapter publishes the result to its destination.
