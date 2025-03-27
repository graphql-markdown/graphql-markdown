# badge

## Variables

### CSS\_BADGE\_CLASSNAME

```ts
const CSS_BADGE_CLASSNAME: object;
```

Defined in: [badge.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L24)

#### Type declaration

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
function getTypeBadges(type, groups?): Badge[]
```

Defined in: [badge.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L33)

#### Parameters

##### type

`unknown`

##### groups?

`Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

#### Returns

`Badge`[]

***

### printBadge()

```ts
function printBadge(__namedParameters, options): MDXString
```

Defined in: [badge.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L84)

#### Parameters

##### \_\_namedParameters

`Badge`

##### options

`PrintTypeOptions`

#### Returns

`MDXString`

***

### printBadges()

```ts
function printBadges(type, options): string | MDXString
```

Defined in: [badge.ts:99](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L99)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`
