# common

Common printer utility functions for handling descriptions, directives, and warnings.

## Functions

### printDeprecation()

```ts
function printDeprecation(type, options): string;
```

Defined in: [printer-legacy/src/common.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L77)

Prints deprecation information for a GraphQL type if it is deprecated.

#### Parameters

##### type

`unknown`

The GraphQL type to check for deprecation

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string`

Formatted deprecation warning as MDX string, or empty string if not deprecated

---

### printDescription()

```ts
function printDescription(type, options, noText?): string | MDXString;
```

Defined in: [printer-legacy/src/common.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L103)

Prints the complete description for a GraphQL type, including deprecation warnings and custom directives.

#### Parameters

##### type

`unknown`

The GraphQL type to document

##### options

`PrintTypeOptions`

Configuration options for printing

##### noText?

`string`

Optional text to display when no description exists

#### Returns

`string` \| `MDXString`

Combined description, deprecation notices, and custom directives as MDX content

---

### printWarning()

```ts
function printWarning(warningConfig, options): string;
```

Defined in: [printer-legacy/src/common.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L55)

Generates a warning message block in MDX format.

#### Parameters

##### warningConfig

Warning configuration object with `text` and optional `title` properties

###### text?

`string`

###### title?

`string`

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string`

Formatted warning message as MDX string
