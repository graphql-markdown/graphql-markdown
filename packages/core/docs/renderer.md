# renderer

## Classes

### Renderer

Defined in: [renderer.ts:345](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L345)

Core renderer class responsible for generating documentation files from GraphQL schema entities.
Handles the conversion of schema types to markdown/MDX documentation with proper organization.

HIERARCHY LEVELS WHEN categorySort IS ENABLED:

- Level 0 (root): Query, Mutation, Subscription, Custom Groups → 01-Query, 02-Mutation, etc.
- Level 1 (under root): Specific types within each root → 01-Objects, 02-Enums, etc.

Each level has its own CategoryPositionManager that restarts numbering at 1.

#### Example

```ts

```

#### Extends

- [`Hookable`](hooks.md#hookable)

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

Defined in: [renderer.ts:370](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L370)

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

###### mdxModule?

`unknown`

Optional MDX module for enhanced documentation features

###### Returns

[`Renderer`](#renderer)

###### Example

```ts

```

###### Overrides

[`Hookable`](hooks.md#hookable).[`constructor`](hooks.md#constructor)

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [renderer.ts:348](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L348)

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [renderer.ts:346](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L346)

##### map

```ts
map: Map<string, Callback[]>;
```

Defined in: [hooks.ts:7](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L7)

###### Inherited from

[`Hookable`](hooks.md#hookable).[`map`](hooks.md#map)

##### mdxModule

```ts
mdxModule: unknown;
```

Defined in: [renderer.ts:351](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L351)

##### options

```ts
options: Maybe<RendererDocOptions>;
```

Defined in: [renderer.ts:350](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L350)

##### outputDir

```ts
outputDir: string;
```

Defined in: [renderer.ts:347](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L347)

##### prettify

```ts
prettify: boolean;
```

Defined in: [renderer.ts:349](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L349)

#### Methods

##### emit()

```ts
protected emit(hookName, args): unknown[];
```

Defined in: [hooks.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L28)

###### Parameters

###### hookName

`string`

###### args

`unknown`[] = `[]`

###### Returns

`unknown`[]

###### Inherited from

[`Hookable`](hooks.md#hookable).[`emit`](hooks.md#emit)

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type,
   name,
   rootTypeName): Promise<string>;
```

Defined in: [renderer.ts:512](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L512)

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

Defined in: [renderer.ts:476](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L476)

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

##### hasMDXHookSupport()

```ts
hasMDXHookSupport(hookName, module): module is Partial<MDXSupportType> & Pick<MDXSupportType, keyof MDXSupportType>;
```

Defined in: [renderer.ts:413](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L413)

Checks if the provided module supports MDX index file generation.

###### Parameters

###### hookName

keyof `MDXSupportType`

###### module

`unknown` = `...`

The module to check for MDX support

###### Returns

`module is Partial<MDXSupportType> & Pick<MDXSupportType, keyof MDXSupportType>`

True if the module supports index metafile generation

###### Example

```ts

```

##### mdxModuleSubscribeHook()

```ts
mdxModuleSubscribeHook(): void;
```

Defined in: [renderer.ts:439](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L439)

Subscribes to MDX module hooks that are supported by the current MDX module.

Iterates through all available renderer hooks and registers callbacks for those
that are supported by the MDX module. Logs the list of successfully subscribed
hooks at debug level if any subscriptions were made.

###### Returns

`void`

void

###### Remarks

This method checks each hook in `RendererHooks` against the MDX module's capabilities
using `hasMDXHookSupport()` before subscribing. Only hooks that are both defined in
`RendererHooks` and supported by the MDX module will be subscribed to.

##### preCollectCategories()

```ts
preCollectCategories(rootTypeNames): void;
```

Defined in: [renderer.ts:752](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L752)

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

Defined in: [renderer.ts:802](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L802)

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

Defined in: [renderer.ts:596](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L596)

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

Defined in: [renderer.ts:635](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L635)

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

##### subscribe()

```ts
subscribe(hookName, callback): Subscription;
```

Defined in: [hooks.ts:9](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L9)

###### Parameters

###### hookName

`string`

###### callback

[`Callback`](hooks.md#callback)

###### Returns

[`Subscription`](hooks.md#subscription)

###### Inherited from

[`Hookable`](hooks.md#hookable).[`subscribe`](hooks.md#subscribe)

## Interfaces

### CategoryMetafileOptions

Defined in: [renderer.ts:229](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L229)

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

Defined in: [renderer.ts:231](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L231)

Whether the category should be initially collapsed

##### collapsible?

```ts
optional collapsible: boolean;
```

Defined in: [renderer.ts:230](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L230)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
optional sidebarPosition: number;
```

Defined in: [renderer.ts:232](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L232)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
optional styleClass: string;
```

Defined in: [renderer.ts:233](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L233)

CSS class to apply to the category for styling

## Variables

### API_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [renderer.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L134)

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

---

### RendererHooks

```ts
const RendererHooks: readonly [
  "generateIndexMetafile",
  "afterRenderTypeEntitiesHook",
];
```

Defined in: [renderer.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L46)

Array of hook names available in the renderer lifecycle.

#### Remarks

These hooks allow customization at different stages of the rendering process:

- `generateIndexMetafile`: Hook called during index metadata file generation
- `afterRenderTypeEntitiesHook`: Hook called after rendering type entities

## Functions

### getApiGroupFolder()

```ts
function getApiGroupFolder(type, groups?): string;
```

Defined in: [renderer.ts:155](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L155)

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
  mdxModule?,
): Promise<Renderer>;
```

Defined in: [renderer.ts:1034](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L1034)

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

##### mdxModule?

`unknown`

Optional MDX module for enhanced features

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
