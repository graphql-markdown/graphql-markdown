# honkit

HonKit formatter for GraphQL documentation output.

Produces plain Markdown compatible with HonKit static site generator.
Internal links are converted to .html paths.

## Variables

### \_\_default

```ts
const __default: object;
```

Defined in: [honkit/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L32)

#### Type Declaration

##### formatMDXBullet

```ts
formatMDXBullet: typeof formatMDXBullet;
```

##### formatMDXPermalink

```ts
formatMDXPermalink: typeof formatMDXPermalink;
```

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [honkit/index.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L38)

File extension used for generated pages — HonKit renders plain Markdown to HTML.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [honkit/index.ts:183](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L183)

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

Defined in: [honkit/index.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L67)

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

Defined in: [honkit/index.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L53)

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

Defined in: [honkit/index.ts:80](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L80)

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

Defined in: [honkit/index.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L96)

Formats YAML front matter.
Merges `props` entries with `formatted` lines (formatted lines take precedence).
Returns empty string if `props` is empty or absent — HonKit renders front matter
without a title as literal YAML content.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines that override props values

#### Returns

`MDXString`

Formatted front matter block, or empty string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [honkit/index.ts:132](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L132)

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

Defined in: [honkit/index.ts:161](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L161)

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

Defined in: [honkit/index.ts:174](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L174)

Formats a "specified by" link as plain text with the URL percent-encoded.
HonKit does not render custom JSX components.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification text string

---

### formatMDXTitle()

```ts
function formatMDXTitle(title): MDXString;
```

Defined in: [honkit/index.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L120)

Formats the page title as a visible H1 heading.
Line breaks are collapsed to spaces and surrounding whitespace is trimmed,
so the heading stays on a single line.

#### Parameters

##### title

`string`

The page title

#### Returns

`MDXString`

`# Title` heading, or empty string if the title is blank
