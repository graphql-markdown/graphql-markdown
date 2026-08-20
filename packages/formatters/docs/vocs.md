# vocs

Vocs formatter for GraphQL documentation output.

Produces MDX compatible with Vite/Vocs using its native callout syntax
and Material UI Chip components for badges.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [vocs/index.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L28)

MDX import statement and inline component definitions prepended to every generated file.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [vocs/index.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L35)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [vocs/index.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L111)

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

Defined in: [vocs/index.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L55)

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

Defined in: [vocs/index.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L43)

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

Defined in: [vocs/index.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L68)

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

Defined in: [vocs/index.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L77)

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

Defined in: [vocs/index.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/index.ts#L90)

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
