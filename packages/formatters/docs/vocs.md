# vocs

Vocs formatter for GraphQL documentation output.

Produces MDX compatible with Vite/Vocs using its native callout syntax
and Material UI Chip components for badges.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [vocs/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L32)

MDX import statement and inline component definitions prepended to every generated file.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [vocs/index.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L39)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [vocs/index.ts:147](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L147)

Creates a Vocs formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Vocs MDX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [vocs/index.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L59)

Formats an admonition using Vocs native callout syntax (`:::type[title]`).
Maps `warning` type to `warning`; all other types use `info`.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted Vocs callout string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [vocs/index.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L47)

Formats a badge using the Material UI `<Chip>` component.
Maps `DEPRECATED` classname to `warning` color; all others use `info`.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted MUI Chip component string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [vocs/index.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L72)

Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.

#### Parameters

##### text?

`string` = `""`

Optional text to append after the bullet

#### Returns

`MDXString`

Formatted Bullet component string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [vocs/index.ts:81](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L81)

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
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [vocs/index.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L94)

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

Defined in: [vocs/index.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L110)

Appends `.mdx` to internal link URLs.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Link with `.mdx` extension appended to the URL

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [vocs/index.ts:123](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L123)

Formats a named entity as a JSX span with styled code elements.

#### Parameters

##### name

`string`

Entity name

##### parentType?

`Maybe`&lt;`string`&gt;

Optional parent type name for qualified references

#### Returns

`MDXString`

Formatted JSX entity reference string

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [vocs/index.ts:138](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L138)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
