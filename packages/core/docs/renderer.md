# renderer

## Classes

### Renderer

Defined in: [renderer.ts:206](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L206)

**`Use Declared Type`**

Core renderer class responsible for generating documentation files from GraphQL schema entities.
Handles the conversion of schema types to markdown/MDX documentation with proper organization.

#### Example

```ts

```

#### Constructors

##### Constructor

```ts
new Renderer(
   printer, 
   outputDir, 
   baseURL, 
   group, 
   prettify, 
   docOptions, 
   mdxModule?): Renderer
```

Defined in: [renderer.ts:229](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L229)

Creates a new Renderer instance.

###### Parameters

###### printer

*typeof* `IPrinter`

The printer instance used to convert GraphQL types to markdown

###### outputDir

`string`

Directory where documentation will be generated

###### baseURL

`string`

Base URL for the documentation

###### group

`Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

Optional grouping configuration for schema entities

###### prettify

`boolean`

Whether to format the generated markdown

###### docOptions

`Maybe`\<`RendererDocOptions`\>

Additional documentation options

###### mdxModule?

`unknown`

Optional MDX module for enhanced documentation features

###### Returns

[`Renderer`](#renderer)

###### Example

```ts

```

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [renderer.ts:209](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L209)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [renderer.ts:207](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L207)

##### mdxModule

```ts
mdxModule: unknown;
```

Defined in: [renderer.ts:212](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L212)

##### mdxModuleIndexFileSupport

```ts
mdxModuleIndexFileSupport: boolean;
```

Defined in: [renderer.ts:213](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L213)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

Defined in: [renderer.ts:211](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L211)

##### outputDir

```ts
outputDir: string;
```

Defined in: [renderer.ts:208](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L208)

##### prettify

```ts
prettify: boolean;
```

Defined in: [renderer.ts:210](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L210)

#### Methods

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type, 
   name, 
rootTypeName): Promise<string>
```

Defined in: [renderer.ts:313](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L313)

**`Use Declared Type`**

Generates the directory path and metafiles for a specific schema entity type.
Creates the appropriate directory structure based on configuration options.

###### Parameters

###### type

`unknown`

The schema entity type

###### name

`string`

The name of the schema entity

###### rootTypeName

`SchemaEntity`

The root type name this entity belongs to

###### Returns

`Promise`\<`string`\>

The generated directory path

###### Example

```ts

```

##### generateIndexMetafile()

```ts
generateIndexMetafile(
   dirPath, 
   category, 
options): Promise<void>
```

Defined in: [renderer.ts:285](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L285)

**`Use Declared Type`**

Generates an index metafile for a category directory if MDX support is available.

###### Parameters

###### dirPath

`string`

The directory path where the index should be created

###### category

`string`

The category name

###### options

[`CategoryMetafileOptions`](#categorymetafileoptions) = `...`

Configuration options for the index

###### Returns

`Promise`\<`void`\>

Promise that resolves when the index is generated

###### Example

```typescript
await renderer.generateIndexMetafile('docs/types', 'Types', {
  collapsible: true,
  collapsed: false
});
```

##### hasMDXIndexFileSupport()

```ts
hasMDXIndexFileSupport(module): module is Partial<MDXSupportType> & Pick<MDXSupportType, "generateIndexMetafile">
```

Defined in: [renderer.ts:256](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L256)

**`Use Declared Type`**

Checks if the provided module supports MDX index file generation.

###### Parameters

###### module

`unknown` = `...`

The module to check for MDX support

###### Returns

`module is Partial<MDXSupportType> & Pick<MDXSupportType, "generateIndexMetafile">`

True if the module supports index metafile generation

###### Example

```ts

```

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>
```

Defined in: [renderer.ts:481](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L481)

**`Use Declared Type`**

Renders the homepage for the documentation from a template file.
Replaces placeholders in the template with actual values.

###### Parameters

###### homepageLocation

`string`

Path to the homepage template file

###### Returns

`Promise`\<`void`\>

Promise that resolves when the homepage is rendered

###### Example

```ts

```

##### renderRootTypes()

```ts
renderRootTypes(rootTypeName, type): Promise<Maybe<Maybe<Category>[]>>
```

Defined in: [renderer.ts:371](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L371)

**`Use Declared Type`**

Renders all types within a root type category (e.g., all Query types).

###### Parameters

###### rootTypeName

`SchemaEntity`

The name of the root type (e.g., "Query", "Mutation")

###### type

`unknown`

The type object containing all entities to render

###### Returns

`Promise`\<`Maybe`\<`Maybe`\<`Category`\>[]\>\>

Array of rendered categories or undefined

###### Example

```ts

```

##### renderTypeEntities()

```ts
renderTypeEntities(
   dirPath, 
   name, 
type): Promise<Maybe<Category>>
```

Defined in: [renderer.ts:415](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L415)

**`Use Declared Type`**

Renders documentation for a specific type entity and saves it to a file.

###### Parameters

###### dirPath

`string`

The directory path where the file should be saved

###### name

`string`

The name of the type entity

###### type

`unknown`

The type entity to render

###### Returns

`Promise`\<`Maybe`\<`Category`\>\>

The category information for the rendered entity or undefined

###### Example

```ts

```

## Interfaces

### CategoryMetafileOptions

Defined in: [renderer.ts:193](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L193)

**`Use Declared Type`**

Configuration options for category metafiles in the documentation.
These options control the appearance and behavior of category sections in the sidebar.

 CategoryMetafileOptions

#### Example

```typescript
const options: CategoryMetafileOptions = {
  collapsible: true,
  collapsed: false,
  sidebarPosition: SidebarPosition.FIRST,
  styleClass: CATEGORY_STYLE_CLASS.API
};
```

#### Properties

##### collapsed?

```ts
optional collapsed: boolean;
```

Defined in: [renderer.ts:195](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L195)

Whether the category should be initially collapsed

##### collapsible?

```ts
optional collapsible: boolean;
```

Defined in: [renderer.ts:194](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L194)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
optional sidebarPosition: number;
```

Defined in: [renderer.ts:196](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L196)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
optional styleClass: string;
```

Defined in: [renderer.ts:197](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L197)

CSS class to apply to the category for styling

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [renderer.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L117)

**`Use Declared Type`**

Default group names for API types and non-API types.
This constant provides the base folder structure for organizing GraphQL schema entities.
Can be overridden via ApiGroupOverrideType in configuration.

#### Example

```typescript
// Default structure
const defaultGroups = API_GROUPS;
// { operations: "operations", types: "types" }

// With custom override
const customGroups = { ...API_GROUPS, operations: "queries-and-mutations" };
```

#### See

[getApiGroupFolder](#getapigroupfolder) For usage with type categorization

## Functions

### getApiGroupFolder()

```ts
function getApiGroupFolder(type, groups?): string
```

Defined in: [renderer.ts:139](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L139)

**`Use Declared Type`**

Determines the appropriate folder for a GraphQL schema entity based on its type.

#### Parameters

##### type

`unknown`

The GraphQL schema entity to categorize

##### groups?

`Maybe`\<`boolean` \| `ApiGroupOverrideType`\>

Optional custom group naming configuration

#### Returns

`string`

The folder name where the entity should be placed

#### Example

```typescript
// With default groups
const folder = getApiGroupFolder(queryType); // Returns "operations"

// With custom groups
const folder = getApiGroupFolder(objectType, { operations: "queries" }); // Returns appropriate folder
```

***

### getRenderer()

```ts
function getRenderer(
   printer, 
   outputDir, 
   baseURL, 
   group, 
   prettify, 
   docOptions, 
mdxModule?): Promise<Renderer>
```

Defined in: [renderer.ts:525](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L525)

**`Use Declared Type`**

Factory function to create and initialize a Renderer instance.
Creates the output directory and returns a configured renderer.

#### Parameters

##### printer

*typeof* `IPrinter`

The printer instance to use for rendering types

##### outputDir

`string`

The output directory for generated documentation

##### baseURL

`string`

The base URL for the documentation

##### group

`Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

Optional grouping configuration

##### prettify

`boolean`

Whether to prettify the output markdown

##### docOptions

`Maybe`\<`RendererDocOptions`\>

Additional documentation options

##### mdxModule?

`unknown`

Optional MDX module for enhanced features

#### Returns

`Promise`\<[`Renderer`](#renderer)\>

A configured Renderer instance

#### Example

```typescript
const renderer = await getRenderer(
  myPrinter,
  './docs',
  '/api',
  groupConfig,
  true,
  { force: true, index: true }
);
```
