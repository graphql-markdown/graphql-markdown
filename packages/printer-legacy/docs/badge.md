# badge

## Variables

### DEFAULT\_CSS\_CLASSNAME

```ts
const DEFAULT_CSS_CLASSNAME: "badge--secondary";
```

#### Defined in

[badge.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L23)

## Functions

### getTypeBadges()

```ts
function getTypeBadges(type, groups?): Badge[]
```

#### Parameters

• **type**: `unknown`

• **groups?**: `Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

#### Returns

`Badge`[]

#### Defined in

[badge.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L25)

***

### printBadge()

```ts
function printBadge(__namedParameters): MDXString
```

#### Parameters

• **\_\_namedParameters**: `Badge`

#### Returns

`MDXString`

#### Defined in

[badge.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L73)

***

### printBadges()

```ts
function printBadges(type, options): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[badge.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/badge.ts#L79)
