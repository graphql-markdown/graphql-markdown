# fumadocs

Fumadocs formatter for GraphQL documentation output.

Produces MDX compatible with Next.js Fumadocs using its native
Callout component for admonitions and Material UI Chip for badges.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [fumadocs/index.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L35)

MDX import statement prepended to every generated file to register Fumadocs and MUI components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [fumadocs/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L32)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [fumadocs/index.ts:144](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L144)

Creates a Fumadocs formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Fumadocs MDX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [fumadocs/index.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L58)

Formats an admonition using the Fumadocs `<Callout>` component.
Maps `warning` type to `warn`; all other types use `info`.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted Fumadocs Callout component string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [fumadocs/index.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L46)

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

Defined in: [fumadocs/index.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L71)

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

Defined in: [fumadocs/index.ts:80](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L80)

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

Defined in: [fumadocs/index.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L93)

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

Defined in: [fumadocs/index.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L109)

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

Defined in: [fumadocs/index.ts:122](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L122)

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

Defined in: [fumadocs/index.ts:135](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L135)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
