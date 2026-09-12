# renderer

## Classes

### Renderer

Defined in: [packages/core/src/renderer.ts:376](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L376)

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
new Renderer(options): Renderer;
```

Defined in: [packages/core/src/renderer.ts:395](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L395)

Creates a new Renderer instance.

###### Parameters

###### options

[`RendererOptions`](#rendereroptions-1)

Renderer construction options

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

Defined in: [packages/core/src/renderer.ts:379](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L379)

##### group

```ts
readonly group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [packages/core/src/renderer.ts:377](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L377)

##### mdxExtension

```ts
readonly mdxExtension: string;
```

Defined in: [packages/core/src/renderer.ts:382](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L382)

##### options

```ts
readonly options: Maybe<RendererDocOptions>;
```

Defined in: [packages/core/src/renderer.ts:381](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L381)

##### outputAdapter

```ts
readonly outputAdapter: OutputAdapter;
```

Defined in: [packages/core/src/renderer.ts:383](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L383)

##### outputDir

```ts
readonly outputDir: string;
```

Defined in: [packages/core/src/renderer.ts:378](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L378)

##### prettify

```ts
readonly prettify: boolean;
```

Defined in: [packages/core/src/renderer.ts:380](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L380)

#### Methods

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type,
   name,
   rootTypeName
): Promise<string>;
```

Defined in: [packages/core/src/renderer.ts:500](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L500)

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
   options?
): Promise<void>;
```

Defined in: [packages/core/src/renderer.ts:445](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L445)

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

Defined in: [packages/core/src/renderer.ts:796](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L796)

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

Defined in: [packages/core/src/renderer.ts:846](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L846)

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

Defined in: [packages/core/src/renderer.ts:584](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L584)

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
   type,
   operationNamespaceParts?,
   entity?
): Promise<Maybe<Category>>;
```

Defined in: [packages/core/src/renderer.ts:654](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L654)

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

###### operationNamespaceParts?

`string`[]

The namespace parts for a namespaced operation

###### entity?

`SchemaEntity`

The schema entity kind being rendered, e.g. `queries`

###### Returns

`Promise`&lt;`Maybe`&lt;`Category`&gt;&gt;

The category information for the rendered entity or undefined

###### Example

```ts

```

## Interfaces

### CategoryMetafileOptions

Defined in: [packages/core/src/renderer.ts:221](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L221)

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
optional collapsed?: boolean;
```

Defined in: [packages/core/src/renderer.ts:223](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L223)

Whether the category should be initially collapsed

##### collapsible?

```ts
optional collapsible?: boolean;
```

Defined in: [packages/core/src/renderer.ts:222](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L222)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
optional sidebarPosition?: number;
```

Defined in: [packages/core/src/renderer.ts:224](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L224)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
optional styleClass?: string;
```

Defined in: [packages/core/src/renderer.ts:225](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L225)

CSS class to apply to the category for styling

---

### RendererOptions

Defined in: [packages/core/src/renderer.ts:344](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L344)

Constructor options for [Renderer](#renderer), and input to [getRenderer](#getrenderer).

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [packages/core/src/renderer.ts:350](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L350)

Base URL for the documentation

##### docOptions

```ts
docOptions: Maybe<RendererDocOptions>;
```

Defined in: [packages/core/src/renderer.ts:356](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L356)

Additional documentation options

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [packages/core/src/renderer.ts:352](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L352)

Optional grouping configuration for schema entities

##### mdxExtension

```ts
mdxExtension: string;
```

Defined in: [packages/core/src/renderer.ts:358](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L358)

Optional MDX file extension to use

##### outputAdapter?

```ts
optional outputAdapter?: Maybe<OutputAdapter>;
```

Defined in: [packages/core/src/renderer.ts:360](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L360)

Destination for generated pages; defaults to the local filesystem

##### outputDir

```ts
outputDir: string;
```

Defined in: [packages/core/src/renderer.ts:348](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L348)

Directory where documentation will be generated

##### prettify

```ts
prettify: boolean;
```

Defined in: [packages/core/src/renderer.ts:354](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L354)

Whether to format the generated markdown

##### printer

```ts
printer: typeof IPrinter;
```

Defined in: [packages/core/src/renderer.ts:346](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L346)

The printer instance used to convert GraphQL types to markdown

## Variables

### API_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [packages/core/src/renderer.ts:125](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L125)

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

Defined in: [packages/core/src/renderer.ts:147](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L147)

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
function getRenderer(options): Promise<Renderer>;
```

Defined in: [packages/core/src/renderer.ts:1094](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L1094)

Factory function to create and initialize a Renderer instance.
Creates the output directory and returns a configured renderer.

#### Parameters

##### options

[`RendererOptions`](#rendereroptions-1)

Renderer construction options

#### Returns

`Promise`&lt;[`Renderer`](#renderer)&gt;

A configured Renderer instance

#### Example

```typescript
const renderer = await getRenderer({
  printer: myPrinter,
  outputDir: "./docs",
  baseURL: "/api",
  group: groupConfig,
  prettify: true,
  docOptions: { force: true, index: true },
  mdxExtension: ".mdx",
});
```

---

### logHandlerErrors()

```ts
function logHandlerErrors(eventName, errors): void;
```

Defined in: [packages/core/src/renderer.ts:335](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L335)

Reports errors thrown by event handlers.

Handler errors are collected rather than thrown, so without this they are
dropped and the formatter's post-processing silently does nothing.

#### Parameters

##### eventName

`string`

Name of the emitted event

##### errors

`Error`[]

Errors collected from the handlers

#### Returns

`void`
