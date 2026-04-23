# honkit

HonKit formatter for GraphQL documentation output.

Produces plain Markdown compatible with HonKit static site generator.
Internal links are converted to .html paths. Includes a
`beforeComposePageTypeHook` that injects entity-kind badges and builds
an "On this page" TOC from section headings.

## Variables

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [honkit/index.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L26)

File extension used for generated pages — HonKit renders plain Markdown to HTML.

## Functions

### beforeComposePageTypeHook()

```ts
function beforeComposePageTypeHook(event): Promise<void>;
```

Defined in: [honkit/index.ts:346](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L346)

Lifecycle hook that fires before composing a page for a GraphQL type entity.
Determines the entity's GraphQL kind (query, mutation, object, enum, etc.),
injects a colored kind badge into the H1 heading, and prepends an
"On this page" TOC sidebar when two or more `###` sections are present.

#### Parameters

##### event

Hook payload with `type`, `options` (including `schema`), and `sections`

###### data

\{
`options`: `Record`&lt;`string`, `unknown`&gt;;
`sections`: `Record`&lt;`string`, `unknown`&gt;;
`type`: `unknown`;
\}

###### data.options

`Record`&lt;`string`, `unknown`&gt;

###### data.sections

`Record`&lt;`string`, `unknown`&gt;

###### data.type

`unknown`

###### output

`string`[]

#### Returns

`Promise`&lt;`void`&gt;

---

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [honkit/index.ts:385](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L385)

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

Defined in: [honkit/index.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L58)

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

Defined in: [honkit/index.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L34)

Formats a badge as an inline HTML `<span>` with themed pill styles.
Three built-in themes: `deprecated` (red), `required` (blue), and `default` (grey).

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted inline HTML span string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [honkit/index.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L71)

Formats a bullet point separator using a Unicode bullet character.

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

Defined in: [honkit/index.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L140)

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

Defined in: [honkit/index.ts:168](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L168)

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

Defined in: [honkit/index.ts:181](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/index.ts#L181)

Formats a "specified by" link as plain text with the raw URL.
HonKit does not render custom JSX components.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification text string
