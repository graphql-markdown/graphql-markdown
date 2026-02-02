# renderer

## Classes

### Renderer

Defined in: [renderer.ts:335](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L335)

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
   mdxExtension): Renderer;
```

Defined in: [renderer.ts:360](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L360)

Creates a new Renderer instance.

###### Parameters

###### printer

_typeof_ `IPrinter`

The printer instance used to convert GraphQL types to markdown

###### outputDir

`string`

Directory where documentation will be generated

###### baseURL

`string`

Base URL for the documentation

###### group

`Maybe`&lt;`Partial`&lt;`Record`&lt;`SchemaEntity`, `Record`&lt;`string`, `Maybe`&lt;`string`&gt;&gt;&gt;&gt;&gt;

Optional grouping configuration for schema entities

###### prettify

`boolean`

Whether to format the generated markdown

###### docOptions

`Maybe`&lt;`RendererDocOptions`&gt;

Additional documentation options

###### mdxExtension

`string`

Optional MDX file extension to use

###### Returns

[`Renderer`](#renderer)

###### Example

```ts

```

#### Properties

##### baseURL

```ts
readonly baseURL: string;
```

Defined in: [renderer.ts:338](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L338)

##### group

```ts
readonly group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [renderer.ts:336](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L336)

##### mdxExtension

```ts
readonly mdxExtension: string;
```

Defined in: [renderer.ts:341](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L341)

##### options

```ts
readonly options: Maybe<RendererDocOptions>;
```

Defined in: [renderer.ts:340](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L340)

##### outputDir

```ts
readonly outputDir: string;
```

Defined in: [renderer.ts:337](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L337)

##### prettify

```ts
readonly prettify: boolean;
```

Defined in: [renderer.ts:339](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L339)

#### Methods

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type,
   name,
   rootTypeName): Promise<string>;
```

Defined in: [renderer.ts:463](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L463)

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

`Promise`&lt;`string`&gt;

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

Defined in: [renderer.ts:408](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L408)

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

`Promise`&lt;`void`&gt;

Promise that resolves when the index is generated

###### Example

```typescript
await renderer.generateIndexMetafile("docs/types", "Types", {
  collapsible: true,
  collapsed: false,
});
```

##### preCollectCategories()

```ts
preCollectCategories(rootTypeNames): void;
```

Defined in: [renderer.ts:705](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L705)

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

Defined in: [renderer.ts:755](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L755)

Renders the homepage for the documentation from a template file.
Replaces placeholders in the template with actual values.

###### Parameters

###### homepageLocation

`Maybe`&lt;`string`&gt;

Path to the homepage template file

###### Returns

`Promise`&lt;`void`&gt;

Promise that resolves when the homepage is rendered

###### Example

```ts

```

##### renderRootTypes()

```ts
renderRootTypes(rootTypeName, type): Promise<Maybe<Maybe<Category>[]>>;
```

Defined in: [renderer.ts:547](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L547)

Renders all types within a root type category (e.g., all Query types).

###### Parameters

###### rootTypeName

`SchemaEntity`

The name of the root type (e.g., "Query", "Mutation")

###### type

`unknown`

The type object containing all entities to render

###### Returns

`Promise`&lt;`Maybe`&lt;`Maybe`&lt;`Category`&gt;[]&gt;&gt;

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

Defined in: [renderer.ts:586](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L586)

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

`Promise`&lt;`Maybe`&lt;`Category`&gt;&gt;

The category information for the rendered entity or undefined

###### Example

```ts

```

## Interfaces

### CategoryMetafileOptions

Defined in: [renderer.ts:219](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L219)

Configuration options for category metafiles in the documentation.
These options control the appearance and behavior of category sections in the sidebar.

CategoryMetafileOptions

#### Example

```typescript
const options: CategoryMetafileOptions = {
  collapsible: true,
  collapsed: false,
  sidebarPosition: SidebarPosition.FIRST,
  styleClass: CATEGORY_STYLE_CLASS.API,
};
```

#### Properties

##### collapsed?

```ts
optional collapsed: boolean;
```

Defined in: [renderer.ts:221](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L221)

Whether the category should be initially collapsed

##### collapsible?

```ts
optional collapsible: boolean;
```

Defined in: [renderer.ts:220](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L220)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
optional sidebarPosition: number;
```

Defined in: [renderer.ts:222](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L222)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
optional styleClass: string;
```

Defined in: [renderer.ts:223](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L223)

CSS class to apply to the category for styling

## Variables

### API_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [renderer.ts:124](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L124)

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

Defined in: [renderer.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L145)

Determines the appropriate folder for a GraphQL schema entity based on its type.

#### Parameters

##### type

`unknown`

The GraphQL schema entity to categorize

##### groups?

`Maybe`&lt;`boolean` \| `ApiGroupOverrideType`&gt;

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

---

### getRenderer()

```ts
function getRenderer(
  printer,
  outputDir,
  baseURL,
  group,
  prettify,
  docOptions,
  mdxExtension,
): Promise<Renderer>;
```

Defined in: [renderer.ts:987](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L987)

Factory function to create and initialize a Renderer instance.
Creates the output directory and returns a configured renderer.

#### Parameters

##### printer

_typeof_ `IPrinter`

The printer instance to use for rendering types

##### outputDir

`string`

The output directory for generated documentation

##### baseURL

`string`

The base URL for the documentation

##### group

`Maybe`&lt;`Partial`&lt;`Record`&lt;`SchemaEntity`, `Record`&lt;`string`, `Maybe`&lt;`string`&gt;&gt;&gt;&gt;&gt;

Optional grouping configuration

##### prettify

`boolean`

Whether to prettify the output markdown

##### docOptions

`Maybe`&lt;`RendererDocOptions`&gt;

Additional documentation options

##### mdxExtension

`string`

Extension to use for MDX files

#### Returns

`Promise`&lt;[`Renderer`](#renderer)&gt;

A configured Renderer instance

#### Example

```typescript
const renderer = await getRenderer(
  myPrinter,
  "./docs",
  "/api",
  groupConfig,
  true,
  { force: true, index: true },
);
```
