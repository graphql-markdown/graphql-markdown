# mdx

## Functions

### createMDXFormatter()

```ts
function createMDXFormatter(meta?): Formatter;
```

Defined in: [mdx/index.ts:144](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L144)

Creates an MDX formatter for Docusaurus documentation.

The MDX formatter produces React component-based markup compatible
with Docusaurus MDX rendering. It uses components like `<Badge>`,
`<Bullet>`, `<Details>`, and `<SpecifiedBy>`.

#### Parameters

##### meta?

`Maybe`&lt;`MetaOptions`&gt;

Optional metadata for framework-specific formatting

#### Returns

`Formatter`

A complete Formatter implementation for MDX output

#### Example

```typescript
import { createMDXFormatter } from "@graphql-markdown/docusaurus";

const formatter = createMDXFormatter({ generatorFrameworkName: "docusaurus" });
const badge = formatter.formatMDXBadge({ text: "Required" });
// '<Badge class="badge badge--secondary " text="Required"/>'
```

---

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(param, meta): MDXString;
```

Defined in: [mdx/index.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L44)

Formats an admonition block in MDX format

#### Parameters

##### param

`AdmonitionType`

The admonition configuration object

##### meta

`Maybe`&lt;`MetaOptions`&gt;

Optional metadata for generator configuration

#### Returns

`MDXString`

Formatted MDX string for the admonition

---

### formatMDXBadge()

```ts
function formatMDXBadge(__namedParameters): MDXString;
```

Defined in: [mdx/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L32)

#### Parameters

##### \_\_namedParameters

`Badge`

#### Returns

`MDXString`

---

### formatMDXBullet()

```ts
function formatMDXBullet(text): MDXString;
```

Defined in: [mdx/index.ts:61](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L61)

Creates a bullet point element in MDX format

#### Parameters

##### text

`string` = `""`

Optional text to append after the bullet point

#### Returns

`MDXString`

Formatted MDX string for the bullet point

---

### formatMDXDetails()

```ts
function formatMDXDetails(param): MDXString;
```

Defined in: [mdx/index.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L70)

Creates a collapsible details section in MDX format

#### Parameters

##### param

`CollapsibleOption`

The collapsible section configuration

#### Returns

`MDXString`

Formatted MDX string for the collapsible section

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [mdx/index.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L114)

Default frontmatter formatter for MDX.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

The front matter options (unused)

##### formatted

`Maybe`&lt;`string`[]&gt;

The formatted front matter as an array of strings

#### Returns

`MDXString`

Formatted MDX string for the front matter

---

### formatMDXLink()

```ts
function formatMDXLink(__namedParameters): TypeLink;
```

Defined in: [mdx/index.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L100)

#### Parameters

##### \_\_namedParameters

`TypeLink`

#### Returns

`TypeLink`

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [mdx/index.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L92)

Formats a name entity with optional parent type

#### Parameters

##### name

`string`

The name to format

##### parentType?

`Maybe`&lt;`string`&gt;

Optional parent type to prefix the name

#### Returns

`MDXString`

Formatted MDX string for the name entity

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [mdx/index.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/index.ts#L82)

Creates a link to the specification documentation

#### Parameters

##### url

`string`

The URL to the specification

#### Returns

`MDXString`

Formatted MDX string for the specification link
