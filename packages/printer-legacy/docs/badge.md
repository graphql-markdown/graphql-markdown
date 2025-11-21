# badge

Module for handling GraphQL type badges in MDX documentation.
Provides functionality to generate and format badges for different GraphQL types
and their properties like deprecation status, nullability, and relationships.

## Variables

### CSS\_BADGE\_CLASSNAME

```ts
const CSS_BADGE_CLASSNAME: object;
```

Defined in: [badge.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L31)

#### Type Declaration

##### DEPRECATED

```ts
DEPRECATED: string = "DEPRECATED";
```

##### NON\_NULL

```ts
NON_NULL: string = "NON_NULL";
```

##### RELATION

```ts
RELATION: string = "RELATION";
```

## Functions

### getTypeBadges()

```ts
function getTypeBadges(type, groups?): Badge[];
```

Defined in: [badge.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L43)

Gets an array of badges for a given GraphQL type.

#### Parameters

##### type

`unknown`

The GraphQL type to generate badges for

##### groups?

`Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

Optional map of schema entities to their groups

#### Returns

`Badge`[]

Array of Badge objects containing text and optional classnames

***

### printBadge()

```ts
function printBadge(badge, options): MDXString;
```

Defined in: [badge.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L97)

Formats a single badge into MDX string format.

#### Parameters

##### badge

`Badge`

The badge object containing text and optional classname

##### options

`PrintTypeOptions`

Options for printing/formatting the badge

#### Returns

`MDXString`

Formatted MDX string representation of the badge

***

### printBadges()

```ts
function printBadges(type, options): string | MDXString;
```

Defined in: [badge.ts:115](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L115)

Generates and formats all applicable badges for a GraphQL type.

#### Parameters

##### type

`unknown`

The GraphQL type to generate badges for

##### options

`PrintTypeOptions`

Options for printing/formatting the badges

#### Returns

`string` \| `MDXString`

Formatted MDX string containing all badges, or empty string if no badges or badges disabled
