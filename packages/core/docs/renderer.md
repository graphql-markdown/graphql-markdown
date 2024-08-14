# renderer

## Classes

### Renderer

#### Constructors

##### new Renderer()

```ts
new Renderer(
   printer, 
   outputDir, 
   baseURL, 
   group, 
   prettify, 
   docOptions): Renderer
```

###### Parameters

• **printer**: *typeof* `IPrinter`

• **outputDir**: `string`

• **baseURL**: `string`

• **group**: `Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

• **prettify**: `boolean`

• **docOptions**: `Maybe`\<`RendererDocOptions`\>

###### Returns

[`Renderer`](renderer.md#renderer)

###### Defined in

[renderer.ts:74](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L74)

#### Properties

##### baseURL

```ts
baseURL: string;
```

###### Defined in

[renderer.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L68)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

###### Defined in

[renderer.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L66)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

###### Defined in

[renderer.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L70)

##### outputDir

```ts
outputDir: string;
```

###### Defined in

[renderer.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L67)

##### prettify

```ts
prettify: boolean;
```

###### Defined in

[renderer.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L69)

#### Methods

##### generateCategoryMetafile()

```ts
generateCategoryMetafile(
   category, 
   dirPath, 
   sidebarPosition?, 
   styleClass?, 
options?): Promise<void>
```

###### Parameters

• **category**: `string`

• **dirPath**: `string`

• **sidebarPosition?**: `number`

• **styleClass?**: `string`

• **options?** = `...`

• **options.collapsed?**: `boolean`

• **options.collapsible?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Defined in

[renderer.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L90)

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type, 
   name, 
rootTypeName): Promise<string>
```

###### Parameters

• **type**: `unknown`

• **name**: `string`

• **rootTypeName**: `SchemaEntity`

###### Returns

`Promise`\<`string`\>

###### Defined in

[renderer.ts:125](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L125)

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>
```

###### Parameters

• **homepageLocation**: `string`

###### Returns

`Promise`\<`void`\>

###### Defined in

[renderer.ts:270](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L270)

##### renderRootTypes()

```ts
renderRootTypes(rootTypeName, type): Promise<Maybe<Maybe<Category>[]>>
```

###### Parameters

• **rootTypeName**: `SchemaEntity`

• **type**: `unknown`

###### Returns

`Promise`\<`Maybe`\<`Maybe`\<`Category`\>[]\>\>

###### Defined in

[renderer.ts:180](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L180)

##### renderTypeEntities()

```ts
renderTypeEntities(
   dirPath, 
   name, 
type): Promise<Maybe<Category>>
```

###### Parameters

• **dirPath**: `string`

• **name**: `string`

• **type**: `unknown`

###### Returns

`Promise`\<`Maybe`\<`Category`\>\>

###### Defined in

[renderer.ts:214](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L214)

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

#### Defined in

[renderer.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L42)

## Functions

### getApiGroupFolder()

```ts
function getApiGroupFolder(type, groups?): string
```

#### Parameters

• **type**: `unknown`

• **groups?**: `Maybe`\<`boolean` \| `ApiGroupOverrideType`\>

#### Returns

`string`

#### Defined in

[renderer.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L47)

***

### getRenderer()

```ts
function getRenderer(
   printer, 
   outputDir, 
   baseURL, 
   group, 
   prettify, 
docOptions): Promise<Renderer>
```

#### Parameters

• **printer**: *typeof* `IPrinter`

• **outputDir**: `string`

• **baseURL**: `string`

• **group**: `Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

• **prettify**: `boolean`

• **docOptions**: `Maybe`\<`RendererDocOptions`\>

#### Returns

`Promise`\<[`Renderer`](renderer.md#renderer)\>

#### Defined in

[renderer.ts:288](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L288)
