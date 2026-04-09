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
function formatMDXBullet(text?): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L48)

Default bullet formatter.

#### Parameters

##### text?

`string` = `""`

#### Returns

`MDXString`

---

### formatMDXDetails()

```ts
function formatMDXDetails(__namedParameters): MDXString;
```

Defined in: [printer-legacy/src/format-helpers.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L64)

Default details formatter.

The returned string **must** contain a `\r` (carriage return) character as a
delimiter between the opening part (ending after `</summary>`) and the
closing part (starting before `</details>`). `printSection` calls
`result.split('\r')` to obtain `[openSection, closeSection]`; without this
delimiter the closing tag is lost and items are rendered outside the
collapsible element.

Custom implementations of `formatMDXDetails` must follow the same contract.

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

Defined in: [printer-legacy/src/format-helpers.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L73)

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

Defined in: [printer-legacy/src/format-helpers.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L87)

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

Defined in: [printer-legacy/src/format-helpers.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L94)

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

Defined in: [printer-legacy/src/format-helpers.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/format-helpers.ts#L107)

Default specified-by link formatter.

#### Parameters

##### url

`string`

#### Returns

`MDXString`
