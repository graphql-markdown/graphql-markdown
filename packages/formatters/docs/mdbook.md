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

Defined in: [mdbook/index.ts:185](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L185)

Builds `src/SUMMARY.md` after all pages have been written.

mdBook requires every page to be listed in `SUMMARY.md` before the site can
be built. This hook collects all rendered pages from the event, groups them
by top-level section (Operations / Types) and category, then writes the file.

---

### mdxExtension

```ts
const mdxExtension: ".md" = ".md";
```

Defined in: [mdbook/index.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L105)

mdBook expects `.md` files; override the default `.mdx` extension.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [mdbook/index.ts:152](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L152)

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

Defined in: [mdbook/index.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L54)

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

Defined in: [mdbook/index.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L43)

Formats a badge as Markdown bold text — mdBook has no badge component.

#### Parameters

##### badge

`Badge`

Badge data containing text

#### Returns

`MDXString`

Formatted bold text string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [mdbook/index.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L68)

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

Defined in: [mdbook/index.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L84)

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
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [mdbook/index.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L96)

Replaces front matter with an H1 title heading.
mdBook renders `---` YAML blocks as literal content, so front matter is
suppressed entirely. The page title is emitted as `# Title` instead.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

##### formatted

`Maybe`&lt;`string`[]&gt;

#### Returns

`MDXString`

`# Title\n` when a title is available, otherwise an empty string

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [mdbook/index.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L112)

Returns the link unchanged — mdBook resolves `.md` links natively.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

The link with `.md` appended to extensionless absolute paths

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [mdbook/index.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L130)

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

Defined in: [mdbook/index.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/index.ts#L143)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
