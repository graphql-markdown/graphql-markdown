# mkdocs

MkDocs formatter for GraphQL documentation output.

Produces Markdown compatible with MkDocs admonitions, HTML details blocks,
and visible page headings.

## Variables

### \_\_default

```ts
const __default: object;
```

Defined in: [mkdocs/index.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L34)

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

---

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mkdocs/index.ts:154](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L154)

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

Defined in: [mkdocs/index.ts:147](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L147)

File extension used for generated pages — MkDocs uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mkdocs/index.ts:183](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L183)

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

Defined in: [mkdocs/index.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L88)

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

Defined in: [mkdocs/index.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L77)

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

Defined in: [mkdocs/index.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L102)

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

Defined in: [mkdocs/index.ts:115](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L115)

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

Defined in: [mkdocs/index.ts:129](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L129)

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

Defined in: [mkdocs/index.ts:142](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/index.ts#L142)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
