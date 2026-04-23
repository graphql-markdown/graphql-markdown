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

Defined in: [docfx/index.ts:232](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L232)

Builds DocFX `toc.yml` navigation files as each entity page is written.

Walks up from the generated file to the graphql output root (`outputDir`),
writing or updating a `toc.yml` at every directory level. Section index pages
are prepended as an "Overview" entry on first encounter.

---

### BADGE_CLASS_MAP

```ts
const BADGE_CLASS_MAP: Record<string, string>;
```

Defined in: [docfx/index.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L49)

Maps graphql-markdown badge classnames to Bootstrap 5 contextual badge classes.

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [docfx/index.ts:180](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L180)

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [docfx/index.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L167)

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

Defined in: [docfx/index.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L72)

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

Defined in: [docfx/index.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L60)

Formats a badge using Bootstrap 5 badge classes available in DocFX's modern template.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted badge string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [docfx/index.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L86)

Formats a bullet point separator.

#### Parameters

##### text?

`string` = `""`

Optional text to append after the bullet

#### Returns

`MDXString`

Formatted bullet string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [docfx/index.ts:95](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L95)

Formats a collapsible block as an HTML `<details>` element.

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

Formatted details element string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: [docfx/index.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L109)

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

Defined in: [docfx/index.ts:135](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L135)

Returns the link unchanged — DocFX resolves `.md` links natively.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link unchanged

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [docfx/index.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L145)

Formats a named entity as a backtick code span.

#### Parameters

##### name

`string`

Entity name

##### parentType?

`Maybe`&lt;`string`&gt;

Optional parent type name for qualified references

#### Returns

`MDXString`

Formatted entity reference string

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [docfx/index.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L158)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
