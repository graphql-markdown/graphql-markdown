# format-helpers

Format event helpers for printer-legacy.

This module provides helper functions to emit MDX format events and handle
fallback to default formatters when no custom handlers are registered.

## Functions

### formatMDXAdmonition()

```ts
function formatMDXAdmonition(__namedParameters, _meta): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L38)

Default admonition formatter.

#### Parameters

##### \_\_namedParameters

`AdmonitionType`

##### \_meta

`Maybe`&lt;`MetaInfo`&gt;

#### Returns

`MDXString`

---

### formatMDXBadge()

```ts
function formatMDXBadge(badge): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L31)

Default badge formatter.

#### Parameters

##### badge

`Badge`

#### Returns

`MDXString`

---

### formatMDXBullet()

```ts
function formatMDXBullet(text): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L48)

Default bullet formatter.

#### Parameters

##### text

`string` = `""`

#### Returns

`MDXString`

---

### formatMDXDetails()

```ts
function formatMDXDetails(__namedParameters): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L55)

Default details formatter.

#### Parameters

##### \_\_namedParameters

`CollapsibleOption`

#### Returns

`MDXString`

---

### formatMDXFrontmatter()

```ts
function formatMDXFrontmatter(_props, formatted): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L64)

Default frontmatter formatter.

#### Parameters

##### \_props

`Maybe`&lt;`FrontMatterOptions`&gt;

##### formatted

`Maybe`&lt;`string`[]&gt;

#### Returns

`MDXString`

---

### formatMDXLink()

```ts
function formatMDXLink(link): TypeLink;
```

Defined in: [printer-legacy/src/format-helpers.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L78)

Default link formatter.

#### Parameters

##### link

`TypeLink`

#### Returns

`TypeLink`

---

### formatMDXNameEntity()

```ts
function formatMDXNameEntity(name, parentType?): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L85)

Default name entity formatter.

#### Parameters

##### name

`string`

##### parentType?

`Maybe`&lt;`string`&gt;

#### Returns

`MDXString`

---

### formatMDXSpecifiedByLink()

```ts
function formatMDXSpecifiedByLink(url): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L98)

Default specified-by link formatter.

#### Parameters

##### url

`string`

#### Returns

`MDXString`
