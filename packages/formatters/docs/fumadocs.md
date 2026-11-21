# fumadocs

Fumadocs formatter for GraphQL documentation output.

Produces MDX compatible with Next.js Fumadocs using its native
Callout component for admonitions and Material UI Chip for badges.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [fumadocs/index.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L44)

MDX import statement prepended to every generated file to register Fumadocs and MUI components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [fumadocs/index.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L41)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [fumadocs/index.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L98)

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

Defined in: [fumadocs/index.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L67)

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

Defined in: [fumadocs/index.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L55)

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

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [fumadocs/index.ts:81](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L81)

Returns the link unchanged — Fumadocs routes `page.mdx` to `page` so
links must not include the `.mdx` extension.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Unmodified link

---

### formatMDXPermalink()

```ts
function formatMDXPermalink(id): MDXString;
```

Defined in: [fumadocs/index.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L36)

Formats a permalink for a section header using the Fumadocs `[#id]` syntax.

#### Parameters

##### id

`string`

The ID of the section header

#### Returns

`MDXString`

Formatted permalink string

#### See

https://www.fumadocs.dev/docs/headless/mdx/headings
