# link

Module for handling links and link-related operations in GraphQL Markdown printer.
Provides utilities for creating, formatting, and managing links to GraphQL types and operations.

## Variables

### API_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [printer-legacy/src/link.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L52)

## Functions

### getCategoryLocale()

```ts
function getCategoryLocale(type): Maybe<TypeLocale>;
```

Defined in: [printer-legacy/src/link.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L103)

Gets the locale category for a given GraphQL type.

#### Parameters

##### type

`unknown`

The GraphQL type to get the category for

#### Returns

`Maybe`&lt;`TypeLocale`&gt;

The locale category for the type, or `undefined` if not found

---

### getLinkApiGroupFolder()

```ts
function getLinkApiGroupFolder(type, groups?): string;
```

Defined in: [printer-legacy/src/link.ts:189](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L189)

Gets the folder name for an API group based on the GraphQL type and group options.

#### Parameters

##### type

`unknown`

The GraphQL type to get the folder name for

##### groups?

`Maybe`&lt;`boolean` \| `ApiGroupOverrideType`&gt;

The group options

#### Returns

`string`

The folder name for the API group

---

### getLinkCategoryFolder()

```ts
function getLinkCategoryFolder(type, operationLocale?): Maybe<string>;
```

Defined in: [printer-legacy/src/link.ts:132](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L132)

Gets the folder name for a link category based on the GraphQL type and operation locale.

#### Parameters

##### type

`unknown`

The GraphQL type to get the folder name for

##### operationLocale?

`Maybe`&lt;`TypeLocale`&gt;

The locale of the operation

#### Returns

`Maybe`&lt;`string`&gt;

The folder name for the link category, or `undefined` if not found

---

### getLinkDeprecatedFolder()

```ts
function getLinkDeprecatedFolder(type, option): string;
```

Defined in: [printer-legacy/src/link.ts:207](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L207)

Gets the folder name for deprecated types based on the GraphQL type and deprecation option.

#### Parameters

##### type

`unknown`

The GraphQL type to get the folder name for

##### option

`Maybe`&lt;`TypeDeprecatedOption`&gt;

The deprecation option

#### Returns

`string`

The folder name for deprecated types

---

### getRelationLink()

```ts
function getRelationLink(category, type, options): Maybe<TypeLink>;
```

Defined in: [printer-legacy/src/link.ts:327](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L327)

Gets the link for a relation based on the category, type, and options.

#### Parameters

##### category

`Maybe`&lt;`TypeLocale`&gt;

The locale category of the relation

##### type

`unknown`

The GraphQL type of the relation

##### options

`PrintLinkOptions`

Configuration options for link generation

#### Returns

`Maybe`&lt;`TypeLink`&gt;

The link object for the relation, or `undefined` if not found

---

### hasOptionParentType()

```ts
function hasOptionParentType(options): boolean;
```

Defined in: [printer-legacy/src/link.ts:173](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L173)

Checks if the options include the `parentTypePrefix` attribute.

#### Parameters

##### options

`PrintLinkOptions`

The options to check

#### Returns

`boolean`

`true` if the options include `parentTypePrefix`, `false` otherwise

---

### hasOptionWithAttributes()

```ts
function hasOptionWithAttributes(options): boolean;
```

Defined in: [printer-legacy/src/link.ts:163](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L163)

Checks if the options include the `withAttributes` attribute.

#### Parameters

##### options

`PrintLinkOptions`

The options to check

#### Returns

`boolean`

`true` if the options include `withAttributes`, `false` otherwise

---

### hasPrintableDirective()

```ts
function hasPrintableDirective(type, options?): boolean;
```

Defined in: [printer-legacy/src/link.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L64)

Checks if a type has printable directives based on the provided options.

#### Parameters

##### type

`unknown`

The GraphQL type to check

##### options?

`Pick`&lt;`PrintTypeOptions`, `"deprecated"` \| `"onlyDocDirectives"` \| `"skipDocDirectives"`&gt;

Configuration options for directive printing (`deprecated`, `onlyDocDirectives`, `skipDocDirectives`)

#### Returns

`boolean`

`true` if the type should be printed, `false` otherwise

---

### printLink()

```ts
function printLink<T>(arg, options): string;
```

Defined in: [printer-legacy/src/link.ts:398](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L398)

Prints a link for a GraphQL type based on the provided options.

#### Type Parameters

##### T

`T`

#### Parameters

##### arg

`Maybe`&lt;`TypeLink`&gt; \| `T`

The GraphQL type or link object to print a link for

##### options

`PrintLinkOptions`

Configuration options for link generation

#### Returns

`string`

The formatted link as a string

---

### printLinkAttributes()

```ts
function printLinkAttributes(type, text?): string;
```

Defined in: [printer-legacy/src/link.ts:350](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L350)

Prints the attributes of a link based on the GraphQL type.

#### Parameters

##### type

`unknown`

The GraphQL type to print attributes for

##### text?

`Maybe`&lt;`string`&gt; = `""`

The text to append attributes to

#### Returns

`string`

The text with appended attributes

---

### printParentLink()

```ts
function printParentLink(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/link.ts:442](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L442)

Prints a parent link for a GraphQL type based on the provided options.

#### Parameters

##### type

`unknown`

The GraphQL type to print a parent link for

##### options

`PrintLinkOptions`

Configuration options for link generation

#### Returns

`string` \| `MDXString`

The formatted parent link as a string or MDX string

---

### toLink()

```ts
function toLink(type, name, operation, options): TypeLink;
```

Defined in: [printer-legacy/src/link.ts:230](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L230)

Converts a GraphQL type to a link object.

#### Parameters

##### type

`unknown`

The GraphQL type to convert

##### name

`string`

The name of the type

##### operation

`Maybe`&lt;`TypeLocale`&gt;

The locale of the operation

##### options

`PrintLinkOptions`

Configuration options for link generation

#### Returns

`TypeLink`

The link object for the type
