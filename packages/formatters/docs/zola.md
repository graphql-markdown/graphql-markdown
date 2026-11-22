# zola

Zola formatter for GraphQL documentation output.

Produces Markdown compatible with the Zola static site generator.
Zola only accepts a fixed set of top-level front matter keys, so any other
key is moved under `extra:`. Internal links use Zola's build-checked
`@/path/to/page.md` form, and admonitions are plain blockquotes with a bold
title. Section pages are written as `_index.md` with `sort_by = "title"`.

## Variables

### beforeGenerateIndexMetafileHook

```ts
const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook;
```

Defined in: zola/index.ts:192

Lifecycle hook that generates a Zola `_index.md` section file with
`title` and `sort_by = "title"` front matter.

#### Param

**event**

Hook event whose `data` contains `dirPath` and `category`

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: zola/index.ts:185

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: zola/index.ts:170

Creates a Zola formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Zola output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: zola/index.ts:70

Formats an admonition as a blockquote with a bold title.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text and optional title

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted blockquote string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: zola/index.ts:85

Formats YAML front matter keeping only Zola's top-level keys; others go under `extra:`.
A visible `# Title` heading follows the front matter.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options used as fallback when `formatted` is not provided

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines produced by the printer

#### Returns

`MDXString`

Front matter block with H1 heading, or empty string if no data

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: zola/index.ts:144

Rewrites internal links to Zola's checked `@/path.md` form.
External links, anchor-only links and links already using `@/` are unchanged.

#### Parameters

##### link

`TypeLink`

Link data with text and URL

#### Returns

`TypeLink`

Link object with the rewritten URL
