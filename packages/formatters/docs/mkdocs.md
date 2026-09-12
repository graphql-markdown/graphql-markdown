# mkdocs

MkDocs formatter for GraphQL documentation output.

Produces Markdown compatible with MkDocs admonitions, HTML details blocks,
and visible page headings.

## Variables

### \_\_default

```ts
const __default: object;
```

Defined in: [mkdocs/index.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L35)

#### Type Declaration

##### formatMDXBullet

```ts
formatMDXBullet: (text) => MDXString;
```

Formats a bullet point separator using a `<span>` with a `gqlmd-mdx-bullet` CSS class.

###### Parameters

###### text?

`string` = `""`

Optional text to append after the bullet

###### Returns

`MDXString`

Formatted bullet string

##### formatMDXLink

```ts
formatMDXLink: (link) => TypeLink;
```

Formats a type link — returns the link unchanged (identity passthrough).

###### Parameters

###### link

`TypeLink`

The `TypeLink` object to format

###### Returns

`TypeLink`

The unmodified `TypeLink` object

##### formatMDXPermalink

```ts
formatMDXPermalink: (id) => MDXString;
```

Formats a permalink for a section header using the classic `{#id}` syntax.

This is the syntax supported by most Markdown-based generators (Hugo,
mdBook, DocFX, MkDocs with `attr_list`). Presets targeting a framework that
expects another syntax override this function.

###### Parameters

###### id

`string`

The ID of the section header

###### Returns

`MDXString`

Formatted permalink string

---

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mkdocs/index.ts:155](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L155)

Lifecycle hook that rewrites generated absolute GraphQL-Markdown links
into page-relative `.md` links compatible with MkDocs validation.

#### Param

**event**

Hook payload containing the current file path and renderer output context

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [mkdocs/index.ts:148](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L148)

File extension used for generated pages — MkDocs uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mkdocs/index.ts:168](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L168)

Creates an MkDocs Material formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for MkDocs Material output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [mkdocs/index.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L90)

Formats an admonition using MkDocs Material `!!!` block syntax.
Content is indented by 4 spaces as required by the spec.

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

Defined in: [mkdocs/index.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L79)

Formats a badge as an inline HTML mark element.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted badge string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [mkdocs/index.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L104)

Formats a collapsible block as an HTML `<details>` element.

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

Formatted collapsible string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [mkdocs/index.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L117)

Formats page title as a visible H1 heading.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options (unused)

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines

#### Returns

`MDXString`

Visible heading string, or empty string if no title is available

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [mkdocs/index.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L130)

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

Defined in: [mkdocs/index.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L143)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
