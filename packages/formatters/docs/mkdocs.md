# mkdocs

MkDocs formatter for GraphQL documentation output.

Produces Markdown compatible with MkDocs admonitions, HTML details blocks,
and visible page headings.

## Variables

### \_\_default

```ts
const __default: object;
```

Defined in: [mkdocs/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L32)

#### Type Declaration

##### formatMDXBullet

```ts
formatMDXBullet: typeof formatMDXBullet;
```

##### formatMDXLink

```ts
formatMDXLink: typeof formatMDXLink;
```

##### formatMDXPermalink

```ts
formatMDXPermalink: typeof formatMDXPermalink;
```

---

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mkdocs/index.ts:137](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L137)

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

Defined in: [mkdocs/index.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L130)

File extension used for generated pages — MkDocs uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mkdocs/index.ts:150](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L150)

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

Defined in: [mkdocs/index.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L71)

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

Defined in: [mkdocs/index.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L60)

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

Defined in: [mkdocs/index.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L85)

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

Defined in: [mkdocs/index.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L98)

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

Defined in: [mkdocs/index.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L111)

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

Defined in: [mkdocs/index.ts:125](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L125)

Formats a "specified by" link as a standard Markdown link.
The URL is percent-encoded so it stays a single Markdown link destination.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
