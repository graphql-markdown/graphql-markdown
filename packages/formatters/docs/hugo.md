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

Defined in: [hugo/index.ts:178](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L178)

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

Defined in: [hugo/index.ts:168](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L168)

File extension used for generated pages — Hugo uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [hugo/index.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L153)

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
function formatMDXAdmonition(admonition, _meta): MDXString;
```

Defined in: [hugo/index.ts:76](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L76)

Formats an admonition using Hugo GitHub-style alert syntax (`> [!TYPE]`).
Requires Hugo 0.132 or later.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, optional title, and type (e.g. `note`, `warning`, `danger`) mapped via ALERT_TYPE_MAP

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

Defined in: [hugo/index.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L65)

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
function formatMDXDetails(option): MDXString;
```

Defined in: [hugo/index.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L90)

Formats a collapsible block as an HTML `<details>` element.

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

HTML `<details>`/`<summary>` block string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(props, formatted): MDXString;
```

Defined in: [hugo/index.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L106)

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
function formatMDXLink(link): TypeLink;
```

Defined in: [hugo/index.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L134)

Strips the `.md` extension from internal links.
Hugo serves pages at extensionless URLs — links with `.md` would 404 in the built site.

#### Parameters

##### link

`TypeLink`

Link data with text and URL; `.md` extension is removed from the URL if present

#### Returns

`TypeLink`

Link object with the cleaned URL
