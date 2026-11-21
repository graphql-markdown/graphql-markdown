# mdbook

mdBook formatter for GraphQL documentation output.

Produces Markdown compatible with Rust's mdBook static site generator.
Front matter is suppressed because mdBook renders it as literal content.
Admonitions use mdBook's native `> [!TYPE]` syntax.
Exports `afterRenderFilesHook` to build `SUMMARY.md` after all pages are written.

## Variables

### afterRenderFilesHook

```ts
const afterRenderFilesHook: RenderFilesHook;
```

Defined in: [mdbook/index.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L200)

Builds `src/SUMMARY.md` after all pages have been written.

mdBook requires every page to be listed in `SUMMARY.md` before the site can
be built. This hook collects all rendered pages from the event, groups them
by top-level section (Operations / Types) and category, then writes the file.

---

### afterRenderTypeEntitiesHook

```ts
const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook;
```

Defined in: [mdbook/index.ts:154](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L154)

Rewrites absolute generated doc links to page-relative `.md` paths after each page is rendered.

mdBook resolves links relative to the book source root, so absolute paths
like `/graphql/types/scalars/id.md` are rendered as `/graphql/types/scalars/id.html`
in the output HTML — which breaks when the book is served under a subdirectory
(e.g. `https://example.com/demo-mdbook/`).
Converting them to relative paths (e.g. `../../scalars/id.md`) makes links
work correctly regardless of where the book is hosted.

---

### mdxExtension

```ts
const mdxExtension: ".md" = ".md";
```

Defined in: [mdbook/index.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L116)

mdBook expects `.md` files; override the default `.mdx` extension.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mdbook/index.ts:165](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L165)

Creates an mdBook formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for mdBook output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [mdbook/index.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L65)

Formats an admonition using mdBook's native admonition syntax (`> [!TYPE]`).
Uses `type` for the admonition tag and `title` as an optional override label.

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

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [mdbook/index.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L54)

Formats a badge as Markdown bold text — mdBook has no badge component.

#### Parameters

##### badge

`Badge`

Badge data containing text

#### Returns

`MDXString`

Formatted bold text string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [mdbook/index.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L86)

Renders a deprecated section as a bold inline label.

A fixed heading level would break hierarchy when this section is nested
inside field entries at varying depths. Bold text is CommonMark-safe and
works at any nesting level without affecting the heading outline.

The output is split on `\r` to produce [openSection, closeSection] as the
printer expects — the deprecated items are inserted between the two halves.

#### Parameters

##### option

`CollapsibleOption`

Configuration for the section label

#### Returns

`MDXString`

Bold label + split marker

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, _formatted): MDXString;
```

Defined in: [mdbook/index.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L98)

Suppresses front matter.
mdBook renders `---` YAML blocks as literal content, so front matter is
suppressed entirely. The page title is printed by [formatMDXTitle](#formatmdxtitle).

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

##### \_formatted

`Maybe`&lt;`string`[]&gt;

#### Returns

`MDXString`

An empty string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [mdbook/index.ts:123](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L123)

Returns the link unchanged — mdBook resolves `.md` links natively.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link with `.md` appended to extensionless absolute paths

---

### formatMDXTitle()

```ts
function formatMDXTitle(title): MDXString;
```

Defined in: [mdbook/index.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L111)

Formats the page title as a visible `# Title` heading, since front matter
is suppressed.

#### Parameters

##### title

`string`

The page title

#### Returns

`MDXString`

`# Title` heading
