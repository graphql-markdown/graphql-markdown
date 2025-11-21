# renderer

## Classes

### Renderer

Defined in: [renderer.ts:333](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L333)

Core renderer class responsible for generating documentation files from GraphQL schema entities.
Handles the conversion of schema types to markdown/MDX documentation with proper organization.

HIERARCHY LEVELS WHEN categorySort IS ENABLED:
- Level 0 (root): Query, Mutation, Subscription, Custom Groups → 01-Query, 02-Mutation, etc.
- Level 1 (under root): Specific types within each root → 01-Objects, 02-Enums, etc.

Each level has its own CategoryPositionManager that restarts numbering at 1.

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
   mdxModule?): Renderer;
```

Defined in: [renderer.ts:358](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L358)

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

Defined in: [renderer.ts:336](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L336)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [renderer.ts:334](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L334)

##### mdxModule

```ts
mdxModule: unknown;
```

Defined in: [renderer.ts:339](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L339)

##### mdxModuleIndexFileSupport

```ts
mdxModuleIndexFileSupport: boolean;
```

Defined in: [renderer.ts:340](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L340)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

Defined in: [renderer.ts:338](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L338)

##### outputDir

```ts
outputDir: string;
```

Defined in: [renderer.ts:335](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L335)

##### prettify

```ts
prettify: boolean;
```

Defined in: [renderer.ts:337](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L337)

#### Methods

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type, 
   name, 
rootTypeName): Promise<string>;
```

Defined in: [renderer.ts:465](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L465)

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
options?): Promise<void>;
```

Defined in: [renderer.ts:426](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L426)

Generates an index metafile for a category directory if MDX support is available.

###### Parameters

###### dirPath

`string`

The directory path where the index should be created

###### category

`string`

The category name

###### options?

[`CategoryMetafileOptions`](#categorymetafileoptions)

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
hasMDXIndexFileSupport(module): module is Partial<MDXSupportType> & Pick<MDXSupportType, "generateIndexMetafile">;
```

Defined in: [renderer.ts:398](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L398)

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

##### preCollectCategories()

```ts
preCollectCategories(rootTypeNames): void;
```

Defined in: [renderer.ts:687](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L687)

Pre-collects all category names that will be generated during rendering.
This allows the position manager to assign consistent positions before
any files are written.

HIERARCHY LEVELS:
- Root level: Query, Mutation, Subscription, Deprecated (when grouped), custom root groups
- Nested level: operations/types (API groups), custom groups under roots

CRITICAL: Categories registered must match the NAMES USED BY THE PRINTER
when generating links. The printer uses plural forms from ROOT_TYPE_LOCALE:
"operations", "objects", "directives", "enums", "inputs", "interfaces",
"mutations", "queries", "scalars", "subscriptions", "unions"

NOT the folder names: "operations", "types"

###### Parameters

###### rootTypeNames

`string`[]

Array of root type names from the schema

###### Returns

`void`

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>;
```

Defined in: [renderer.ts:737](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L737)

Renders the homepage for the documentation from a template file.
Replaces placeholders in the template with actual values.

###### Parameters

###### homepageLocation

`Maybe`\<`string`\>

Path to the homepage template file

###### Returns

`Promise`\<`void`\>

Promise that resolves when the homepage is rendered

###### Example

```ts

```

##### renderRootTypes()

```ts
renderRootTypes(rootTypeName, type): Promise<Maybe<Maybe<Category>[]>>;
```

Defined in: [renderer.ts:549](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L549)

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
type): Promise<Maybe<Category>>;
```

Defined in: [renderer.ts:588](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L588)

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

Defined in: [renderer.ts:217](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L217)

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

Defined in: [renderer.ts:219](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L219)

Whether the category should be initially collapsed

##### collapsible?

```ts
optional collapsible: boolean;
```

Defined in: [renderer.ts:218](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L218)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
optional sidebarPosition: number;
```

Defined in: [renderer.ts:220](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L220)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
optional styleClass: string;
```

Defined in: [renderer.ts:221](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L221)

CSS class to apply to the category for styling

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [renderer.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L118)

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
function getApiGroupFolder(type, groups?): string;
```

Defined in: [renderer.ts:139](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L139)

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
mdxModule?): Promise<Renderer>;
```

Defined in: [renderer.ts:969](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L969)

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
