# docfx

DocFX formatter for GraphQL documentation output.

Produces Markdown compatible with Microsoft DocFX.
Uses DocFX alert syntax for admonitions and injects the required
`uid` front matter field for cross-reference resolution.

## Variables

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [docfx/index.ts:498](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L498)

---

### BADGE\_CLASS\_MAP

```ts
const BADGE_CLASS_MAP: Record<string, string>;
```

Defined in: [docfx/index.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L55)

Maps graphql-markdown badge classnames to Bootstrap 5 contextual badge classes.

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [docfx/index.ts:201](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L201)

The file extension used for MDX files in DocFX output.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [docfx/index.ts:183](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L183)

Creates a DocFX formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for DocFX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [docfx/index.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L86)

Formats an admonition using DocFX alert syntax (`> [!TYPE]`).

DocFX renders its own heading for each alert type (Note, Warning, ...), and
the syntax has no slot for a custom title, so the admonition title is not
printed. Blank lines around the text are dropped and blank lines within it
collapse to a single `>` paragraph separator.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text and type

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted admonition string

#### See

https://dotnet.github.io/docfx/docs/markdown.html#alerts

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [docfx/index.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L66)

Formats a badge using Bootstrap 5 badge classes available in DocFX's modern template.

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted badge string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: [docfx/index.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L110)

Formats YAML front matter, injecting a `uid` field required by DocFX
for cross-reference resolution between pages.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options; `id` is used as the DocFX `uid` value

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

Defined in: [docfx/index.ts:152](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L152)

Returns the link unchanged — DocFX resolves `.md` links natively.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link unchanged

---

### formatMDXPermalink()

```ts
function formatMDXPermalink(id): MDXString;
```

Defined in: [docfx/index.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L167)

Formats a permalink for a section header as an empty HTML anchor.

DocFX does not support the `{#id}` heading id syntax unless the Markdig
`attributes` extension is enabled: the braces are printed as text, and the
heading id is generated from the whole heading, badges included. An inline
anchor gives every field and argument a stable id derived from its name only.

#### Parameters

##### id

`string`

The ID of the section header

#### Returns

`MDXString`

Formatted permalink string

---

### formatMDXTitle()

```ts
function formatMDXTitle(title): MDXString;
```

Defined in: [docfx/index.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/index.ts#L143)

Formats the page title as a visible `# Title` heading.

DocFX only uses the front matter `title` for the document `<title>`; the
page heading comes from the Markdown H1, so without it generated pages
have no visible title.

#### Parameters

##### title

`string`

The page title

#### Returns

`MDXString`

`# Title` heading

#### See

https://dotnet.github.io/docfx/docs/markdown.html
