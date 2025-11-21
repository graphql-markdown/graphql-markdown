# mdx

## Functions

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(param, meta): MDXString;
```

Defined in: [mdx/index.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L41)

Formats an admonition block in MDX format

#### Parameters

##### param

`AdmonitionType`

The admonition configuration object

##### meta

`Maybe`\<`MetaOptions`\>

Optional metadata for generator configuration

#### Returns

`MDXString`

Formatted MDX string for the admonition

***

### formatMDXBadge()

```ts
function formatMDXBadge(__namedParameters): MDXString;
```

Defined in: [mdx/index.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L29)

#### Parameters

##### \_\_namedParameters

`Badge`

#### Returns

`MDXString`

***

### formatMDXBullet()

```ts
function formatMDXBullet(text): MDXString;
```

Defined in: [mdx/index.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L58)

Creates a bullet point element in MDX format

#### Parameters

##### text

`string` = `""`

Optional text to append after the bullet point

#### Returns

`MDXString`

Formatted MDX string for the bullet point

***

### formatMDXDetails()

```ts
function formatMDXDetails(param): MDXString;
```

Defined in: [mdx/index.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L67)

Creates a collapsible details section in MDX format

#### Parameters

##### param

`CollapsibleOption`

The collapsible section configuration

#### Returns

`MDXString`

Formatted MDX string for the collapsible section

***

### formatMDXLink()

```ts
function formatMDXLink(__namedParameters): TypeLink;
```

Defined in: [mdx/index.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L97)

#### Parameters

##### \_\_namedParameters

`TypeLink`

#### Returns

`TypeLink`

***

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [mdx/index.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L89)

Formats a name entity with optional parent type

#### Parameters

##### name

`string`

The name to format

##### parentType?

`Maybe`\<`string`\>

Optional parent type to prefix the name

#### Returns

`MDXString`

Formatted MDX string for the name entity

***

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [mdx/index.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L79)

Creates a link to the specification documentation

#### Parameters

##### url

`string`

The URL to the specification

#### Returns

`MDXString`

Formatted MDX string for the specification link
