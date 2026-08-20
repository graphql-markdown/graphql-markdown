# hugo

Hugo formatter for GraphQL documentation output.

Produces Markdown compatible with Hugo static site generator.
Uses GitHub-style alerts (Hugo 0.132+) for admonitions and
strips file extensions from internal links to match Hugo's URL routing.

## Variables

### beforeGenerateIndexMetafileHook

```ts
const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook;
```

Defined in: [hugo/index.ts:179](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L179)

Lifecycle hook that generates a Hugo-compatible `_index.md` section index file.
The file is (re)created on every run with YAML frontmatter:

- `title`: the start-cased category name
- `type: docs`: required by the Hugo Book theme for sidebar rendering
- `bookCollapseSection: true`: collapses the section in the Hugo Book theme sidebar by default

#### Param

**event**

Hook event whose `data` contains `dirPath` (target directory) and `category` (section name)

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [hugo/index.ts:169](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L169)

File extension used for generated pages — Hugo uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [hugo/index.ts:155](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L155)

Creates a Hugo formatter.

#### Parameters

##### \_meta?

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`Formatter`

A complete Formatter implementation for Hugo output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(text, _meta): MDXString;
```

Defined in: [hugo/index.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L77)

Formats an admonition using Hugo GitHub-style alert syntax (`> [!TYPE]`).
Requires Hugo 0.132 or later.

#### Parameters

##### text

`AdmonitionType`

The admonition body text

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

Unused metadata parameter

#### Returns

`MDXString`

Formatted blockquote alert string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [hugo/index.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L64)

Formats a badge as a styled span element.

#### Parameters

##### badge

`Badge`

Badge data containing the display text

#### Returns

`MDXString`

HTML `<span>` string with the `gqlmd-badge` class

---

### formatMDXDetails()

```ts
function formatMDXDetails(dataOpen): MDXString;
```

Defined in: [hugo/index.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L92)

Formats a collapsible block as an HTML `<details>` element.

#### Parameters

##### dataOpen

`CollapsibleOption`

Label shown when the section is collapsed (used as `<summary>` text)

#### Returns

`MDXString`

HTML `<details>`/`<summary>` block string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: [hugo/index.ts:108](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L108)

Formats YAML front matter wrapped in `---` delimiters, with page title rendered as H1 heading.
Falls back to serializing `props` via formatFrontMatterObject when `formatted` is not provided.
The title is extracted from the frontmatter lines and also rendered as a visible `# Title` heading,
since Hugo does not automatically display the frontmatter `title` field as page content.

#### Parameters

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options used as fallback when `formatted` is not provided

##### formatted

`Maybe`&lt;`string`[]&gt;

Pre-formatted front matter lines produced by the printer

#### Returns

`MDXString`

Formatted front matter block with H1 title heading, or empty string if no data

---

### formatMDXLink()

```ts
function formatMDXLink(text): TypeLink;
```

Defined in: [hugo/index.ts:137](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L137)

Strips the `.md` extension from internal links.
Hugo serves pages at extensionless URLs — links with `.md` would 404 in the built site.

#### Parameters

##### text

`TypeLink`

Display text for the link

#### Returns

`TypeLink`

Link object with the cleaned URL
