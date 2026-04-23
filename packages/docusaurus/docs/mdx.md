# mdx

## Variables

### createMDXFormatter

```ts
const createMDXFormatter: (meta?) => Formatter;
```

Defined in: formatters/dist/docusaurus/index.d.ts:75

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

### formatMDXAdmonition

```ts
const formatMDXAdmonition: ({ text, title, type }, meta) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:26

Formats an admonition using Docusaurus native `:::type` callout syntax.
Detects Docusaurus v2 (via `meta`) and uses `:::caution` instead of `:::warning`.

#### Parameters

##### \{ text, title, type \}

`AdmonitionType`

##### meta

`Maybe`&lt;`MetaInfo`&gt;

Optional metadata used to detect Docusaurus version

#### Returns

`MDXString`

Formatted admonition string

---

### formatMDXBadge

```ts
const formatMDXBadge: ({ text, classname }) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:18

Formats a badge using the inline `<Badge>` component defined in `mdxDeclaration`.
Appends a CSS class derived from `classname` (e.g. `badge--deprecated`).

#### Parameters

##### \{ text, classname \}

`Badge`

#### Returns

`MDXString`

Formatted Badge component string

---

### formatMDXBullet

```ts
const formatMDXBullet: (text?) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:32

Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.

#### Parameters

##### text?

`string`

Optional text to append after the bullet

#### Returns

`MDXString`

Formatted Bullet component string

---

### formatMDXDetails

```ts
const formatMDXDetails: ({ dataOpen, dataClose }) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:40

Formats a collapsible block as an HTML `<details>` element with
toggle labels that swap via the `hidden` attribute.
Text is escaped so curly braces and angle brackets don't break MDX.

#### Parameters

##### \{ dataOpen, dataClose, \}

`CollapsibleOption`

#### Returns

`MDXString`

Formatted details element string

---

### formatMDXFrontmatter

```ts
const formatMDXFrontmatter: (_props, formatted) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:68

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

### formatMDXLink

```ts
const formatMDXLink: ({ text, url }) => TypeLink;
```

Defined in: formatters/dist/docusaurus/index.d.ts:61

Appends `.mdx` to internal link URLs.

#### Parameters

##### \{ text, url \}

`TypeLink`

#### Returns

`TypeLink`

Link with `.mdx` extension appended to the URL

---

### formatMDXNameEntity

```ts
const formatMDXNameEntity: (name, parentType?) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:55

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

### formatMDXSpecifiedByLink

```ts
const formatMDXSpecifiedByLink: (url) => MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:46

Formats a "specified by" link using the inline `<SpecifiedBy>` component.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted SpecifiedBy component string

---

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: formatters/dist/docusaurus/index.d.ts:11

MDX component definitions prepended to every generated file.
