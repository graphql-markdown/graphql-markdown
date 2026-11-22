# docsify

Docsify formatter for GraphQL documentation output.

Builds on the Hugo preset (GitHub-style `> [!TYPE]` callouts, which Docsify
v5 renders natively) and adapts the output to Docsify:

- no front matter (Docsify would print it as text), only a `# Title` heading;
- internal links are root-absolute `/<path>.md` routes;
- every category folder gets a `README.md` (Docsify's folder index);
- a `_sidebar.md` is generated at the docs root once all pages are written.

## Variables

### afterRenderFilesHook

```ts
const afterRenderFilesHook: RenderFilesHook;
```

Defined in: [docsify/index.ts:163](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L163)

Builds `_sidebar.md` and completes every folder `README.md` once all pages
have been written.

#### Param

**event**

Hook event with `baseURL`, `outputDir`, `rootDir`, `pages` and `outputAdapter`

---

### beforeGenerateIndexMetafileHook

```ts
const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook;
```

Defined in: [docsify/index.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L116)

Seeds the Docsify folder index (`README.md`) of a category directory.
It is completed with the page links by [afterRenderFilesHook](#afterrenderfileshook).

#### Param

**event**

Hook event whose `data` contains `dirPath` and `category`

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [docsify/index.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L41)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [docsify/index.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L97)

Creates a Docsify formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Docsify output

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [docsify/index.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L50)

Docsify has no front matter support (it would print the YAML as text).
Only the page title is kept, rendered as a level 1 heading.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

Unused front matter options

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines produced by the printer

#### Returns

`MDXString`

A `# Title` heading, or an empty string when there is no title

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [docsify/index.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/index.ts#L67)

Turns internal links into root-absolute `/<path>.md` routes.
External links and `#`-only links are returned unchanged.

#### Parameters

##### link

`TypeLink`

Link data with text and URL

#### Returns

`TypeLink`

Link object with the Docsify route as URL
