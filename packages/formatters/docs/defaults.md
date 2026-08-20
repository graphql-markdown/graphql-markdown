# defaults

Default formatter implementations shared across multiple formatter packages.

These functions provide the standard/baseline rendering behaviour.
Individual formatters import what they need and override only what differs.

## Functions

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [defaults.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L42)

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

Defined in: [defaults.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L32)

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

Defined in: [defaults.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L54)

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

Defined in: [defaults.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L64)

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

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [defaults.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L77)

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

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [defaults.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L93)

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

Defined in: [defaults.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L103)

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

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [defaults.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/defaults.ts#L119)

Formats a "specified by" link as an HTML `<span>` with a `gqlmd-mdx-specifiedby` CSS class
containing an anchor that opens in a new tab.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
