# common

Common printer utility functions for handling descriptions, directives, and warnings.

## Functions

### formatDescription()

```ts
function formatDescription(type, replacement): string | MDXString;
```

Defined in: [common.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L68)

Formats a GraphQL type description or falls back to a default message.

#### Parameters

##### type

`unknown`

GraphQL type to get description from

##### replacement

`Maybe`\<`string`\> = `NO_DESCRIPTION_TEXT`

Optional fallback text if no description exists

#### Returns

`string` \| `MDXString`

Formatted description string or MDX content

***

### printCustomDirectives()

```ts
function printCustomDirectives(type, options?): string;
```

Defined in: [common.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L28)

Prints documentation for custom directives applied to a type.

#### Parameters

##### type

`unknown`

GraphQL type to get directives from

##### options?

`PrintTypeOptions`

Printer configuration options

#### Returns

`string`

Formatted directive documentation string

***

### printDeprecation()

```ts
function printDeprecation(type, options): string;
```

Defined in: [common.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L110)

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

***

### printDescription()

```ts
function printDescription(
   type, 
   options, 
   noText?): string | MDXString;
```

Defined in: [common.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L136)

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

***

### printWarning()

```ts
function printWarning(warningConfig, options): string;
```

Defined in: [common.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L89)

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
