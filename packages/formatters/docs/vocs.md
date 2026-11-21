# vocs

Vocs formatter for GraphQL documentation output.

Produces MDX compatible with Vite/Vocs using its native callout syntax

## Variables

### formatMDXPermalink

```ts
const formatMDXPermalink: typeof formatMDXEscapedPermalink =
  formatMDXEscapedPermalink;
```

Defined in: [vocs/index.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L40)

Formats a permalink for a section header, using the classic `{#id}` syntax
escaped to remain valid MDX.

Vocs has no custom header id syntax, so the permalink is inert unless a
remark plugin is configured. Turn it off with
`docOptions.sectionHeaderId: false`.

#### See

https://vocs.dev/docs/markdown

#### Param

**id**

The ID of the section header

#### Returns

Formatted permalink string

---

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [vocs/index.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L44)

MDX import statement and inline component definitions prepended to every generated file.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [vocs/index.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L49)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [vocs/index.ts:141](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L141)

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

Defined in: [vocs/index.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L85)

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

Defined in: [vocs/index.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L73)

Formats a badge using Vocs native text directive (`:badge[...]`).
Maps `DEPRECATED` classname to `warning` color; all others use default.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted Vocs badge string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [vocs/index.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L98)

Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.

#### Parameters

##### text?

`string` = `""`

Optional text to append after the bullet

#### Returns

`MDXString`

Formatted Bullet component string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [vocs/index.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L107)

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

Defined in: [vocs/index.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L120)

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

### formatMDXTitle()

```ts
function formatMDXTitle(title): MDXString;
```

Defined in: [vocs/index.ts:63](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L63)

Formats the page title as a visible `# Title` heading.

Vocs only uses the front matter `title` for the document `<title>`; the
page heading must be written in Markdown, so without it generated pages
have no visible title.

#### Parameters

##### title

`string`

The page title

#### Returns

`MDXString`

`# Title` heading

#### See

https://vocs.dev/docs/markdown
