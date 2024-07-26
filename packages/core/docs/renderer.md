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

[renderer.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L45)

#### Properties

##### baseURL

```ts
baseURL: string;
```

###### Defined in

[renderer.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L39)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

###### Defined in

[renderer.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L37)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

###### Defined in

[renderer.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L41)

##### outputDir

```ts
outputDir: string;
```

###### Defined in

[renderer.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L38)

##### prettify

```ts
prettify: boolean;
```

###### Defined in

[renderer.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L40)

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

[renderer.ts:61](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L61)

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

[renderer.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L96)

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>
```

###### Parameters

• **homepageLocation**: `string`

###### Returns

`Promise`\<`void`\>

###### Defined in

[renderer.ts:220](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L220)

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

[renderer.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L143)

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

[renderer.ts:172](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L172)
