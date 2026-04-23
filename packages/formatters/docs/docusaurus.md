# docusaurus

Docusaurus MDX formatter for GraphQL documentation output.

Produces MDX markup compatible with Docusaurus v2 and v3,
using Badge, Bullet, SpecifiedBy components and native admonition syntax.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [docusaurus/index.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L36)

MDX component definitions prepended to every generated file.

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(meta?): Formatter;
```

Defined in: [docusaurus/index.ts:162](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L162)

Creates a Docusaurus formatter.
Captures `meta` in closure so `formatMDXAdmonition` can detect the Docusaurus version.

#### Parameters

##### meta?

`Maybe`&lt;`MetaInfo`&gt;

Optional metadata used to detect Docusaurus version

#### Returns

`Formatter`

A complete Formatter implementation for Docusaurus MDX output

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(admonition, meta): MDXString;
```

Defined in: [docusaurus/index.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L65)

Formats an admonition using Docusaurus native `:::type` callout syntax.
Detects Docusaurus v2 (via `meta`) and uses `:::caution` instead of `:::warning`.

#### Parameters

##### admonition

`AdmonitionType`

Admonition data with text, title, and type

##### meta

`Maybe`&lt;`MetaInfo`&gt;

Optional metadata used to detect Docusaurus version

#### Returns

`MDXString`

Formatted admonition string

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [docusaurus/index.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L52)

Formats a badge using the inline `<Badge>` component defined in `mdxDeclaration`.
Appends a CSS class derived from `classname` (e.g. `badge--deprecated`).

#### Parameters

##### badge

`Badge`

Badge data containing text and optional classname

#### Returns

`MDXString`

Formatted Badge component string

---

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [docusaurus/index.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L82)

Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.

#### Parameters

##### text?

`string` = `""`

Optional text to append after the bullet

#### Returns

`MDXString`

Formatted Bullet component string

---

### formatMDXDetails()

```ts
function formatMDXDetails(option): MDXString;
```

Defined in: [docusaurus/index.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L93)

Formats a collapsible block as an HTML `<details>` element with
toggle labels that swap via the `hidden` attribute.
Text is escaped so curly braces and angle brackets don't break MDX.

#### Parameters

##### option

`CollapsibleOption`

Configuration for open/close label text

#### Returns

`MDXString`

Formatted details element string

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [docusaurus/index.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L145)

Formats YAML front matter wrapped in `---` delimiters.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

Front matter options (unused)

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

Defined in: [docusaurus/index.ts:132](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L132)

Appends `.mdx` to internal link URLs.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Link with `.mdx` extension appended to the URL

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [docusaurus/index.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L119)

Formats a named entity as an inline `<code>` element with the parent type
in normal weight and the entity name in bold.
Text is escaped so curly braces don't break MDX.

#### Parameters

##### name

`string`

Entity name

##### parentType?

`Maybe`&lt;`string`&gt;

Optional parent type name for qualified references

#### Returns

`MDXString`

Formatted JSX code element string

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [docusaurus/index.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/index.ts#L107)

Formats a "specified by" link using the inline `<SpecifiedBy>` component.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted SpecifiedBy component string
