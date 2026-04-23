# mkdocs

MkDocs formatter for GraphQL documentation output.

Produces Markdown compatible with MkDocs admonitions, HTML details blocks,
and visible page headings.

## Variables

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mkdocs/index.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L167)

Lifecycle hook that rewrites generated absolute GraphQL-Markdown links
into page-relative `.md` links compatible with MkDocs validation.

#### Param

Hook payload containing the current file path and renderer output context

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [mkdocs/index.ts:160](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L160)

File extension used for generated pages — MkDocs uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mkdocs/index.ts:194](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L194)

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

Defined in: [mkdocs/index.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L83)

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

Defined in: [mkdocs/index.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L72)

Formats a badge as an inline HTML mark element.

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

Defined in: [mkdocs/index.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L97)

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

Defined in: [mkdocs/index.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L106)

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

Defined in: [mkdocs/index.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L119)

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

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [mkdocs/index.ts:132](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L132)

Returns the link unchanged — MkDocs resolves `.md` links natively.

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

Defined in: [mkdocs/index.ts:142](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L142)

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

Defined in: [mkdocs/index.ts:155](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L155)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
