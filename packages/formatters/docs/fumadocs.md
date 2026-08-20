# fumadocs

Fumadocs formatter for GraphQL documentation output.

Produces MDX compatible with Next.js Fumadocs using its native
Callout component for admonitions and Material UI Chip for badges.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [fumadocs/index.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L33)

MDX import statement prepended to every generated file to register Fumadocs and MUI components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [fumadocs/index.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L30)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [fumadocs/index.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L89)

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

Defined in: [fumadocs/index.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L56)

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

Defined in: [fumadocs/index.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L44)

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

Defined in: [fumadocs/index.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/index.ts#L69)

Appends `.mdx` to internal link URLs.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Link with `.mdx` extension appended to the URL
