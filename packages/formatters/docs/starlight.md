# starlight

Astro Starlight formatter for GraphQL documentation output.

Produces MDX compatible with Astro Starlight using its native
Aside and Badge components. Includes lifecycle hooks for generating
index files for each category directory.

## Variables

### mdxDeclaration

```ts
const mdxDeclaration: MDXString;
```

Defined in: [starlight/index.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L43)

MDX import statement prepended to every generated file to register Starlight components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [starlight/index.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L40)

File extension used for generated pages.

## Functions

### afterRenderTypeEntitiesHook()

```ts
function afterRenderTypeEntitiesHook(event): Promise<void>;
```

Defined in: [starlight/index.ts:173](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L173)

Lifecycle hook that appends a link entry to the category `index.md`
after each type entity page is rendered.

#### Parameters

##### event

Hook payload containing the entity name and its output file path

###### data

\{
`filePath`: `string`;
`name`: `string`;
\}

###### data.filePath

`string`

###### data.name

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### beforeGenerateIndexMetafileHook()

```ts
function beforeGenerateIndexMetafileHook(event): Promise<void>;
```

Defined in: [starlight/index.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L153)

Lifecycle hook that creates an `index.md` file for a category directory
before Starlight indexes it. Skips creation if the file already exists.

#### Parameters

##### event

Hook payload containing the target directory and category name

###### data

\{
`category`: `string`;
`dirPath`: `string`;
\}

###### data.category

`string`

###### data.dirPath

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### createMDXFormatter()

```ts
function createMDXFormatter(_meta?): Formatter;
```

Defined in: [starlight/index.ts:190](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L190)

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

Defined in: [starlight/index.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L65)

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

Defined in: [starlight/index.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L53)

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

### formatMDXBullet()

```ts
function formatMDXBullet(text?): MDXString;
```

Defined in: [starlight/index.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L78)

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

Defined in: [starlight/index.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L87)

Formats a collapsible block as an HTML `<details>` element.

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

Defined in: [starlight/index.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L100)

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

Defined in: [starlight/index.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L116)

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

Defined in: [starlight/index.ts:129](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L129)

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

Defined in: [starlight/index.ts:142](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L142)

Formats a "specified by" link as a standard Markdown link.

#### Parameters

##### url

`string`

URL to the specification

#### Returns

`MDXString`

Formatted specification link string
