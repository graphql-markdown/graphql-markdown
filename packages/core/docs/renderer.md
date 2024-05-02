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

###### Source

[renderer.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L47)

#### Properties

##### baseURL

```ts
baseURL: string;
```

###### Source

[renderer.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L41)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

###### Source

[renderer.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L39)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

###### Source

[renderer.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L43)

##### outputDir

```ts
outputDir: string;
```

###### Source

[renderer.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L40)

##### prettify

```ts
prettify: boolean;
```

###### Source

[renderer.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L42)

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

• **options?**= `undefined`

• **options.collapsed?**: `boolean`

• **options.collapsible?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[renderer.ts:63](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L63)

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

###### Source

[renderer.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L98)

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>
```

###### Parameters

• **homepageLocation**: `string`

###### Returns

`Promise`\<`void`\>

###### Source

[renderer.ts:248](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L248)

##### renderRootTypes()

```ts
renderRootTypes(rootTypeName, type): Promise<Maybe<Maybe<Category>[]>>
```

###### Parameters

• **rootTypeName**: `SchemaEntity`

• **type**: `unknown`

###### Returns

`Promise`\<`Maybe`\<`Maybe`\<`Category`\>[]\>\>

###### Source

[renderer.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L145)

##### renderSidebar()

```ts
renderSidebar(): Promise<string>
```

###### Returns

`Promise`\<`string`\>

###### Source

[renderer.ts:222](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L222)

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

###### Source

[renderer.ts:174](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L174)
