# docfx

DocFX formatter for GraphQL documentation output.

Produces Markdown compatible with Microsoft DocFX.
Uses DocFX alert syntax for admonitions and injects the required
`uid` front matter field for cross-reference resolution.

## Variables

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [docfx/index.ts:284](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L284)

Builds DocFX `toc.yml` navigation files as each entity page is written.

Walks up from the generated file to the graphql output root (`outputDir`),
writing or updating a `toc.yml` at every directory level. Section index pages
are prepended as an "Overview" entry on first encounter.

---

### BADGE_CLASS_MAP

```ts
const BADGE_CLASS_MAP: Record<string, string>;
```

Defined in: [docfx/index.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L55)

Maps graphql-markdown badge classnames to Bootstrap 5 contextual badge classes.

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [docfx/index.ts:149](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L149)

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [docfx/index.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L136)

Creates a DocFX formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for DocFX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [docfx/index.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L78)

Formats an admonition using DocFX alert syntax (`> [!TYPE]`).

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted admonition string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [docfx/index.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L66)

Formats a badge using Bootstrap 5 badge classes available in DocFX's modern template.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted badge string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: [docfx/index.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L94)

Formats YAML front matter, injecting a `uid` field required by DocFX
for cross-reference resolution between pages.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options; `id` is used as the DocFX `uid` value

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines

#### Returns

`MDXString`

Formatted front matter block, or empty string if no lines provided

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [docfx/index.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L120)

Returns the link unchanged — DocFX resolves `.md` links natively.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link unchanged
