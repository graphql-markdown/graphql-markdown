# defaults

Default formatter implementations shared across multiple formatter packages.

These functions provide the standard/baseline rendering behaviour.
Individual formatters import what they need and override only what differs.

## Functions

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [defaults.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L47)

Formats an admonition as an HTML `<fieldset>` element with `gqlmd-mdx-admonition-*` CSS classes.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, type, and optional icon

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

Defined in: [defaults.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L37)

Formats a badge using an HTML `<mark>` element with a `gqlmd-mdx-badge` CSS class.

#### Parameters

##### badge

`Badge`

Badge data containing the text to display

#### Returns

`MDXString`

Formatted badge string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [defaults.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L59)

Formats a bullet point separator using a `<span>` with a `gqlmd-mdx-bullet` CSS class.

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

Defined in: [defaults.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L69)

Formats a collapsible block as an HTML `<details>` element with a `gqlmd-mdx-details` CSS class.
The summary label is uppercase; the close label is rendered as `<em>`.

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

Formatted details element string

---

### formatMDXEscapedPermalink()

```ts
function formatMDXEscapedPermalink(id): MDXString;
```

Defined in: [defaults.ts:163](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L163)

Formats a permalink for a section header using the classic `{#id}` syntax,
escaped so that it stays valid MDX.

MDX parses an unescaped `{` as the start of an expression, and `{#id}` is not
a valid one, so presets generating `.mdx` pages must use this variant.

#### Parameters

##### id

`string`

The ID of the section header

#### Returns

`MDXString`

Formatted permalink string

#### Example

```js
formatMDXEscapedPermalink("my-id"); // \{#my-id\}
```

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [defaults.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L82)

Formats YAML front matter wrapped in `---` delimiters.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options (unused)

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines

#### Returns

`MDXString`

Formatted front matter block, or empty string if no lines provided

---

### formatMDXFrontmatterTitleOnly()

```ts
function formatMDXFrontmatterTitleOnly(formatted, trailingEol?): MDXString;
```

Defined in: [defaults.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L100)

Formats the page title as a visible H1 heading, for frameworks that render
YAML front matter as literal page content and so must suppress it entirely.

#### Parameters

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines

##### trailingEol?

`boolean` = `false`

Whether to append a trailing end-of-line after the heading

#### Returns

`MDXString`

`# Title` heading, or empty string if no title is available

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [defaults.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L116)

Formats a type link — returns the link unchanged (identity passthrough).

#### Parameters

##### link

`TypeLink`

The `TypeLink` object to format

#### Returns

`TypeLink`

The unmodified `TypeLink` object

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [defaults.ts:126](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L126)

Formats a named entity using `<span>` and `<code>` elements with `gqlmd-mdx-entity-*` CSS classes.

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

### formatMDXPermalink()

```ts
function formatMDXPermalink(id): MDXString;
```

Defined in: [defaults.ts:177](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L177)

Formats a permalink for a section header using the classic `{#id}` syntax.

This is the syntax supported by most Markdown-based generators (Hugo,
mdBook, MkDocs with `attr_list`). Presets targeting a framework that
expects another syntax override this function.

#### Parameters

##### id

`string`

The ID of the section header

#### Returns

`MDXString`

Formatted permalink string

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [defaults.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L143)

Formats a "specified by" link as an HTML `<span>` with a `gqlmd-mdx-specifiedby` CSS class
containing an anchor that opens in a new tab.
The URL is encoded as HTML character references for the `href` and `title` attributes.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
