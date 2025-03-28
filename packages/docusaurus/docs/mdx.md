# mdx

## Functions

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(param, meta): MDXString
```

Defined in: [mdx/index.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L40)

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
function formatMDXBadge(__namedParameters): MDXString
```

Defined in: [mdx/index.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L28)

#### Parameters

##### \_\_namedParameters

`Badge`

#### Returns

`MDXString`

***

### formatMDXBullet()

```ts
function formatMDXBullet(text): MDXString
```

Defined in: [mdx/index.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L57)

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
function formatMDXDetails(param): MDXString
```

Defined in: [mdx/index.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L66)

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
function formatMDXLink(__namedParameters): TypeLink
```

Defined in: [mdx/index.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L96)

#### Parameters

##### \_\_namedParameters

`TypeLink`

#### Returns

`TypeLink`

***

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString
```

Defined in: [mdx/index.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L88)

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
function formatMDXSpecifiedByLink(url): MDXString
```

Defined in: [mdx/index.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L78)

Creates a link to the specification documentation

#### Parameters

##### url

`string`

The URL to the specification

#### Returns

`MDXString`

Formatted MDX string for the specification link
