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

#### Parameters

• **resolver**: `CustomDirectiveResolver`

• **type**: `unknown`

• **constDirectiveOption**: `CustomDirectiveMapItem`

• **fallback?**: `Maybe`\<`string`\>

#### Returns

`Maybe`\<`string`\>

#### Source

[directive.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L17)

***

### getCustomTags()

```ts
function getCustomTags(type, options): Badge[]
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

#### Returns

`Badge`[]

#### Source

[directive.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L89)

***

### printCustomDirective()

```ts
function printCustomDirective(
   type, 
   constDirectiveOption, 
options): Maybe<string>
```

#### Parameters

• **type**: `unknown`

• **constDirectiveOption**: `CustomDirectiveMapItem`

• **options**: `PrintTypeOptions`

#### Returns

`Maybe`\<`string`\>

#### Source

[directive.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L37)

***

### printCustomDirectives()

```ts
function printCustomDirectives(type, options): string
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

#### Returns

`string`

#### Source

[directive.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L59)

***

### printCustomTags()

```ts
function printCustomTags(type, options): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[directive.ts:115](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L115)
