# badge

Module for handling GraphQL type badges in MDX documentation.
Provides functionality to generate and format badges for different GraphQL types
and their properties like deprecation status, nullability, and relationships.

## Variables

### CSS_BADGE_CLASSNAME

```ts
const CSS_BADGE_CLASSNAME: object;
```

Defined in: [printer-legacy/src/badge.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L32)

#### Type Declaration

##### DEPRECATED

```ts
DEPRECATED: string = "DEPRECATED";
```

##### NON_NULL

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

Defined in: [printer-legacy/src/badge.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L44)

Gets an array of badges for a given GraphQL type.

#### Parameters

##### type

`unknown`

The GraphQL type to generate badges for

##### groups?

`Maybe`&lt;`Partial`&lt;`Record`&lt;`SchemaEntity`, `Record`&lt;`string`, `Maybe`&lt;`string`&gt;&gt;&gt;&gt;&gt;

Optional map of schema entities to their groups

#### Returns

`Badge`[]

Array of Badge objects containing text and optional classnames

---

### printBadge()

```ts
function printBadge(badge, options): MDXString;
```

Defined in: [printer-legacy/src/badge.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L97)

Formats a single badge into MDX string format.

#### Parameters

##### badge

`Badge`

The badge object containing text and optional classname

##### options

`PrintTypeOptions`

Options containing the formatter for badges

#### Returns

`MDXString`

Formatted MDX string representation of the badge

---

### printBadges()

```ts
function printBadges(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/badge.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L119)

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
