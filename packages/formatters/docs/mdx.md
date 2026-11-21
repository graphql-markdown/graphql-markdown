# mdx

Generic MDX formatter for GraphQL documentation output.

Produces framework-neutral `.mdx` pages: plain Markdown and JSX-safe HTML,
with no framework components and no `import` declarations.
Header permalinks are escaped (`\{#id\}`) so that they remain valid MDX.
YAML front matter is kept, and internal links are rewritten to page-relative paths.

## Variables

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mdx/index.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L105)

Rewrites absolute generated doc links to page-relative `.mdx` paths after each page is rendered.

---

### formatMDXPermalink

```ts
const formatMDXPermalink: typeof formatMDXEscapedPermalink =
  formatMDXEscapedPermalink;
```

Defined in: [mdx/index.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L97)

Formats a header permalink with escaped braces (`\{#id\}`), valid in MDX.

#### Param

**id**

The ID of the section header

#### Returns

Escaped permalink string

---

### mdxExtension

```ts
const mdxExtension: ".mdx" = ".mdx";
```

Defined in: [mdx/index.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L38)

Generic MDX pages use the `.mdx` extension.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mdx/index.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L116)

Creates a generic MDX formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for generic MDX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [mdx/index.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L46)

Formats an admonition as a Markdown blockquote with a bold type/title label.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted admonition string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [mdx/index.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L60)

Formats a collapsible block as an HTML `<details>` element.
The output is split on `\r` by the printer into [openSection, closeSection].

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

Formatted collapsible string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [mdx/index.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdx/index.ts#L72)

Rewrites extensionless absolute links so they point to `.mdx` pages.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link with `.mdx` appended to extensionless absolute paths
