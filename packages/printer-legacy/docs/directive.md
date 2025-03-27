# directive

## Functions

### getCustomDirectiveResolver()

```ts
function getCustomDirectiveResolver(
   resolver, 
   type, 
   constDirectiveOption, 
fallback?): Maybe<string>
```

Defined in: [directive.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L20)

#### Parameters

##### resolver

`CustomDirectiveResolver`

##### type

`unknown`

##### constDirectiveOption

`CustomDirectiveMapItem`

##### fallback?

`Maybe`\<`string`\>

#### Returns

`Maybe`\<`string`\>

***

### getCustomTags()

```ts
function getCustomTags(type, options): Badge[]
```

Defined in: [directive.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L101)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`Badge`[]

***

### printCustomDirective()

```ts
function printCustomDirective(
   type, 
   constDirectiveOption, 
options): Maybe<string>
```

Defined in: [directive.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L43)

#### Parameters

##### type

`unknown`

##### constDirectiveOption

`CustomDirectiveMapItem`

##### options

`PrintTypeOptions`

#### Returns

`Maybe`\<`string`\>

***

### printCustomDirectives()

```ts
function printCustomDirectives(type, options): string
```

Defined in: [directive.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L68)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string`

***

### printCustomTags()

```ts
function printCustomTags(type, options): string | MDXString
```

Defined in: [directive.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L130)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`
