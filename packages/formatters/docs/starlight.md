# starlight

Astro Starlight formatter for GraphQL documentation output.

Produces MDX compatible with Astro Starlight using its native
Aside and Badge components. Includes lifecycle hooks for generating
index files for each category directory.

## Variables

### formatMDXPermalink

```ts
const formatMDXPermalink: typeof formatMDXEscapedPermalink =
  formatMDXEscapedPermalink;
```

Defined in: [starlight/index.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L41)

Formats a permalink for a section header, using the classic `{#id}` syntax
escaped to remain valid MDX.

Starlight has no built-in custom header id syntax, so the permalink is inert
unless a remark plugin such as `remark-custom-heading-id` is configured. Turn
it off with `docOptions.sectionHeaderId: false`.

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

Defined in: [starlight/index.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L48)

MDX import statement prepended to every generated file to register Starlight components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [starlight/index.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L45)

File extension used for generated pages.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [starlight/index.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L101)

Creates an Astro Starlight formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Starlight MDX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [starlight/index.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L70)

Formats an admonition using the Starlight `<Aside>` component.
Maps `warning` type to `caution`; all other types use `note`.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted Starlight Aside component string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [starlight/index.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L58)

Formats a badge using the Starlight `<Badge>` component.
Maps `DEPRECATED` classname to the `caution` variant; all others use `default`.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted Starlight Badge component string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [starlight/index.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L84)

Returns the link unchanged — Starlight routes `page.mdx` to `page/` so
links must not include the `.mdx` extension.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Unmodified link
