# honkit

HonKit formatter for GraphQL documentation output.

Produces plain Markdown compatible with HonKit static site generator.
Internal links are converted to .html paths.

## Variables

### \_\_default

```ts
const __default: object;
```

Defined in: [honkit/index.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L30)

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

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [honkit/index.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L33)

File extension used for generated pages — HonKit renders plain Markdown to HTML.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [honkit/index.ts:171](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L171)

Creates a HonKit formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for HonKit output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [honkit/index.ts:62](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L62)

Formats an admonition as a Markdown blockquote with a bold prefix label.
Maps `warning` type to `WARNING`; all other types use `INFO`.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted blockquote string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [honkit/index.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L48)

Formats a badge as an inline HTML `<span>` with a shared default style.
Users can customize badge colors by providing their own `formatMDXBadge` implementation.

#### Parameters

##### badge

`Badge`

Badge data containing text

#### Returns

`MDXString`

Formatted inline HTML span string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [honkit/index.ts:75](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L75)

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

Defined in: [honkit/index.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L91)

Formats YAML front matter and appends an H1 heading derived from the `title` prop.
Merges `props` entries with `formatted` lines (formatted lines take precedence).
Returns empty string if `props` is empty or absent — HonKit renders front matter
without a title as literal YAML content.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options; `title` is used to generate the H1 heading

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines that override props values

#### Returns

`MDXString`

Formatted front matter block with optional H1, or empty string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [honkit/index.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L120)

Converts internal link URLs to `.html` paths for HonKit static output.
Absolute paths without an `.html` extension are suffixed with `.html`.
External URLs and fragment-only links are returned unchanged.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Link with `.html` extension applied to absolute internal paths

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [honkit/index.ts:149](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L149)

Formats a named entity as plain text (no markup).
HonKit renders plain Markdown — no JSX or code spans needed.

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

Defined in: [honkit/index.ts:162](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L162)

Formats a "specified by" link as plain text with the raw URL.
HonKit does not render custom JSX components.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification text string
