# renderer

## Classes

### Renderer

Defined in: [packages/core/src/renderer.ts:239](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L239)

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

Defined in: [packages/core/src/renderer.ts:260](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L260)

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

Defined in: [packages/core/src/renderer.ts:242](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L242)

##### group

```ts
readonly group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [packages/core/src/renderer.ts:240](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L240)

##### linkRoot?

```ts
readonly linkRoot?: string;
```

Defined in: [packages/core/src/renderer.ts:243](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L243)

##### mdxExtension

```ts
readonly mdxExtension: string;
```

Defined in: [packages/core/src/renderer.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L246)

##### options

```ts
readonly options: Maybe<RendererDocOptions>;
```

Defined in: [packages/core/src/renderer.ts:245](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L245)

##### outputAdapter

```ts
readonly outputAdapter: OutputAdapter;
```

Defined in: [packages/core/src/renderer.ts:247](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L247)

##### outputDir

```ts
readonly outputDir: string;
```

Defined in: [packages/core/src/renderer.ts:241](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L241)

##### prettify

```ts
readonly prettify: boolean;
```

Defined in: [packages/core/src/renderer.ts:244](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L244)

#### Methods

##### generateCategoryMetafileType()

```ts
generateCategoryMetafileType(
   type,
   name,
   rootTypeName
): Promise<string>;
```

Defined in: [packages/core/src/renderer.ts:369](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L369)

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

Defined in: [packages/core/src/renderer.ts:314](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L314)

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

Defined in: [packages/core/src/renderer.ts:724](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L724)

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

##### preCollectGeneratedDocPaths()

```ts
preCollectGeneratedDocPaths(rootTypes): void;
```

Defined in: [packages/core/src/renderer.ts:690](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L690)

Pre-collects root-level generated document paths for flat hierarchy.

###### Parameters

###### rootTypes

`object`

Map of schema entity names to their generated types

###### Returns

`void`

##### renderHomepage()

```ts
renderHomepage(homepageLocation): Promise<void>;
```

Defined in: [packages/core/src/renderer.ts:774](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L774)

Renders the homepage for the documentation from a template file.
Replaces placeholders in the template with actual values.

###### Parameters

###### homepageLocation

`Maybe`&lt;`string` \| `symbol`&gt;

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

Defined in: [packages/core/src/renderer.ts:453](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L453)

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

Defined in: [packages/core/src/renderer.ts:551](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L551)

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

Defined in: [packages/core/src/renderer.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L82)

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
collapsed?: boolean;
```

Defined in: [packages/core/src/renderer.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L84)

Whether the category should be initially collapsed

##### collapsible?

```ts
collapsible?: boolean;
```

Defined in: [packages/core/src/renderer.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L83)

Whether the category should be collapsible in the sidebar

##### sidebarPosition?

```ts
sidebarPosition?: number;
```

Defined in: [packages/core/src/renderer.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L85)

Custom position in the sidebar (lower numbers appear first)

##### styleClass?

```ts
styleClass?: string;
```

Defined in: [packages/core/src/renderer.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L86)

CSS class to apply to the category for styling

---

### RendererOptions

Defined in: [packages/core/src/renderer.ts:205](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L205)

Constructor options for [Renderer](#renderer), and input to [getRenderer](#getrenderer).

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [packages/core/src/renderer.ts:211](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L211)

Base URL for the documentation

##### docOptions

```ts
docOptions: Maybe<RendererDocOptions>;
```

Defined in: [packages/core/src/renderer.ts:219](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L219)

Additional documentation options

##### group

```ts
group: Maybe<Partial<Record<SchemaEntity, Record<string, Maybe<string>>>>>;
```

Defined in: [packages/core/src/renderer.ts:215](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L215)

Optional grouping configuration for schema entities

##### linkRoot?

```ts
linkRoot?: string;
```

Defined in: [packages/core/src/renderer.ts:213](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L213)

Root for documentation links, forwarded to render hooks

##### mdxExtension

```ts
mdxExtension: string;
```

Defined in: [packages/core/src/renderer.ts:221](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L221)

Optional MDX file extension to use

##### outputAdapter?

```ts
outputAdapter?: OutputAdapter | null;
```

Defined in: [packages/core/src/renderer.ts:223](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L223)

Destination for generated pages; defaults to the local filesystem

##### outputDir

```ts
outputDir: string;
```

Defined in: [packages/core/src/renderer.ts:209](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L209)

Directory where documentation will be generated

##### prettify

```ts
prettify: boolean;
```

Defined in: [packages/core/src/renderer.ts:217](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L217)

Whether to format the generated markdown

##### printer

```ts
printer: typeof IPrinter;
```

Defined in: [packages/core/src/renderer.ts:207](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L207)

The printer instance used to convert GraphQL types to markdown

## Functions

### getRenderer()

```ts
function getRenderer(options): Promise<Renderer>;
```

Defined in: [packages/core/src/renderer.ts:1030](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L1030)

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

Defined in: [packages/core/src/renderer.ts:196](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/renderer.ts#L196)

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
