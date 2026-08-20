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

Defined in: [starlight/index.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L42)

MDX import statement prepended to every generated file to register Starlight components.

---

### mdxExtension

```ts
const mdxExtension: ".mdx";
```

Defined in: [starlight/index.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L39)

File extension used for generated pages.

## Functions

### afterRenderTypeEntitiesHook()

```ts
function afterRenderTypeEntitiesHook(event): Promise<void>;
```

Defined in: [starlight/index.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L117)

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

Defined in: [starlight/index.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L97)

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

Defined in: [starlight/index.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L134)

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

Defined in: [starlight/index.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L64)

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

Defined in: [starlight/index.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L52)

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

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [starlight/index.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/index.ts#L78)

Returns the link unchanged — Starlight routes `page.mdx` to `page/` so
links must not include the `.mdx` extension.

#### Parameters

##### link

`TypeLink`

Link data with URL and text

#### Returns

`TypeLink`

Unmodified link
