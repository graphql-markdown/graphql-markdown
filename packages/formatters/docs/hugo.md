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

Defined in: [hugo/index.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L200)

Lifecycle hook that generates a Hugo-compatible `_index.md` section index file.
The file is (re)created on every run with YAML frontmatter:

- `title`: the start-cased category name
- `type: docs`: required by the Hugo Book theme for sidebar rendering
- `bookCollapseSection: true`: collapses the section in the Hugo Book theme sidebar by default

#### Param

Hook event whose `data` contains `dirPath` (target directory) and `category` (section name)

---

### mdxExtension

```ts
const mdxExtension: ".md";
```

Defined in: [hugo/index.ts:190](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L190)

File extension used for generated pages — Hugo uses standard Markdown (.md) files.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [hugo/index.ts:176](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L176)

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

Defined in: [hugo/index.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L72)

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

Defined in: [hugo/index.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L59)

Formats a badge as a styled span element.

#### Parameters

##### badge

`Badge`

Badge data containing the display text

#### Returns

`MDXString`

HTML `<span>` string with the `gqlmd-badge` class

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [hugo/index.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L86)

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
function formatMDXDetails(dataOpen): MDXString;
```

Defined in: [hugo/index.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L96)

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

Defined in: [hugo/index.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L112)

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

Defined in: [hugo/index.ts:141](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L141)

Strips the `.md` extension from internal links.
Hugo serves pages at extensionless URLs — links with `.md` would 404 in the built site.

#### Parameters

##### text

`TypeLink`

Display text for the link

#### Returns

`TypeLink`

Link object with the cleaned URL

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [hugo/index.ts:154](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L154)

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

Defined in: [hugo/index.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/index.ts#L167)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
