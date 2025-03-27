# config

Configuration module for GraphQL Markdown.

This module provides utilities for parsing, validating, and merging configuration
options from different sources (CLI arguments, config files, GraphQL config).
It handles directives, hierarchies, and other settings used for generating
markdown documentation from GraphQL schemas.

## Enumerations

### DeprecatedOption

Defined in: [config.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L89)

Options for handling deprecated items in the schema.

- DEFAULT: Show deprecated items normally
- GROUP: Group deprecated items separately
- SKIP: Exclude deprecated items from documentation

#### Example

```typescript
const deprecatedHandling = DeprecatedOption.GROUP;
```

#### Enumeration Members

##### DEFAULT

```ts
DEFAULT: "default";
```

Defined in: [config.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L90)

##### GROUP

```ts
GROUP: "group";
```

Defined in: [config.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L91)

##### SKIP

```ts
SKIP: "skip";
```

Defined in: [config.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L92)

***

### DiffMethod

Defined in: [config.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L71)

Diff methods used to determine how schema changes are processed.

- NONE: No diffing is performed
- FORCE: Force regeneration of documentation regardless of schema changes

#### Example

```typescript
const diffMethod = DiffMethod.FORCE;
```

#### Enumeration Members

##### FORCE

```ts
FORCE: "FORCE";
```

Defined in: [config.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L73)

##### NONE

```ts
NONE: "NONE";
```

Defined in: [config.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L72)

***

### TypeHierarchy

Defined in: [config.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L53)

Type hierarchy options for organizing schema documentation.

- API: Groups types by their role in the API (Query, Mutation, etc.)
- ENTITY: Groups types by their entity relationships
- FLAT: No grouping, all types in a flat structure

#### Example

```typescript
const hierarchy = TypeHierarchy.API;
```

#### Enumeration Members

##### API

```ts
API: "api";
```

Defined in: [config.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L54)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [config.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L55)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [config.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L56)

## Variables

### ASSET\_HOMEPAGE\_LOCATION

```ts
const ASSET_HOMEPAGE_LOCATION: string;
```

Defined in: [config.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L111)

Location of the default homepage template.

***

### DEFAULT\_HIERARCHY

```ts
const DEFAULT_HIERARCHY: object;
```

Defined in: [config.ts:122](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L122)

Default hierarchy configuration using the API hierarchy type.

#### Type declaration

##### api

```ts
api: object = {};
```

***

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Readonly<Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> & Required<Omit<ConfigOptions, 
  | "customDirective"
  | "groupByDirective"
  | "loaders"
  | "mdxParser"
  | "printTypeOptions">>> & object;
```

Defined in: [config.ts:131](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L131)

Default configuration options used when no user options are provided.
These values serve as fallbacks for any missing configuration.

#### Type declaration

##### printTypeOptions

```ts
printTypeOptions: Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & object;
```

###### Type declaration

###### hierarchy

```ts
hierarchy: Required<Pick<TypeHierarchyObjectType, API>>;
```

#### See

Options for the complete configuration interface

***

### DOCS\_URL

```ts
const DOCS_URL: "https://graphql-markdown.dev/docs";
```

Defined in: [config.ts:99](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L99)

Documentation website URL for reference in error messages and help text.

***

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@graphql-markdown/docusaurus";
```

Defined in: [config.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L105)

Default package name used for temporary directory creation and identification.

## Functions

### buildConfig()

```ts
function buildConfig(
   configFileOpts, 
   cliOpts?, 
id?): Promise<Options>
```

Defined in: [config.ts:735](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L735)

Builds the complete configuration object by merging options from multiple sources
in order of precedence:
1. CLI options (highest priority)
2. Configuration file options
3. GraphQL Config options
4. Default options (lowest priority)

#### Parameters

##### configFileOpts

`Maybe`\<`ConfigOptions`\>

Options from the configuration file

##### cliOpts?

`Maybe`\<`CliOptions`\>

Options from the command line interface

##### id?

`Maybe`\<`string`\> = `"default"`

The configuration ID used when referencing multiple schemas

#### Returns

`Promise`\<`Options`\>

A promise resolving to the final merged configuration object

#### Example

```typescript
// Basic usage with minimal options
const config = await buildConfig(
  { baseURL: "api" }, // Config file options
  { pretty: true }    // CLI options
);

// With specific config ID
const config = await buildConfig(
  { schema: "./schemas/users.graphql" },
  { force: true },
  "users"
);

// The resulting config will contain all required options
// with values from CLI taking precedence over config file,
// and defaults filling in any missing values
```

#### See

 - Options for the complete configuration interface
 - [DEFAULT\_OPTIONS](#default_options) for default values

***

### getCustomDirectives()

```ts
function getCustomDirectives(customDirectiveOptions, skipDocDirective?): Maybe<CustomDirective>
```

Defined in: [config.ts:376](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L376)

Processes custom directives, filtering out any that should be skipped.
Validates that each custom directive has the correct format with required functions.

#### Parameters

##### customDirectiveOptions

`Maybe`\<`CustomDirective`\>

The custom directive configuration object

##### skipDocDirective?

`Maybe`\<`DirectiveName`[]\>

Array of directive names that should be skipped

#### Returns

`Maybe`\<`CustomDirective`\>

The filtered custom directives object, or undefined if empty/invalid

#### Throws

Error if a custom directive has an invalid format

#### Example

```typescript
// Valid custom directive with tag function
const customDirectives = {
  example: {
    tag: (value) => `Example: ${value}`
  },
  todo: {
    descriptor: () => "TODO items"
  }
};

// Filter out the "example" directive
const filteredDirectives = getCustomDirectives(customDirectives, ["example"]);
console.log(filteredDirectives); // { todo: { descriptor: [Function] } }

// Invalid format - will throw an error
getCustomDirectives({ example: { invalid: true } }, []);
// Error: Wrong format for plugin custom directive "example"...
```

#### See

[DOCS\_URL](#docs_url)/advanced/custom-directive for custom directive format documentation

***

### getDiffMethod()

```ts
function getDiffMethod(diff, force): TypeDiffMethod
```

Defined in: [config.ts:428](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L428)

Determines the diff method to use based on the configuration and force flag.
If force is true, always returns FORCE regardless of the configured diff method.

#### Parameters

##### diff

`TypeDiffMethod`

The configured diff method

##### force

`boolean` = `false`

Whether to force regeneration (overrides diff setting)

#### Returns

`TypeDiffMethod`

The resolved diff method to use

#### Example

```typescript
// Normal usage - respects the configured diff method
const method1 = getDiffMethod(DiffMethod.NONE, false);
console.log(method1); // "NONE"

// Force flag overrides the diff method
const method2 = getDiffMethod(DiffMethod.NONE, true);
console.log(method2); // "FORCE"
```

#### See

[DiffMethod](#diffmethod) for available diff methods

***

### getDocDirective()

```ts
function getDocDirective(name): DirectiveName
```

Defined in: [config.ts:199](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L199)

Retrieves a directive name from a string by parsing and validating the format.
Directive names should be prefixed with '@' (e.g., '@example').

#### Parameters

##### name

`Maybe`\<`DirectiveName`\>

The directive name as a string, which should follow the format '@directiveName'

#### Returns

`DirectiveName`

The validated directive name without the '@' prefix

#### Throws

Error if the directive name format is invalid

#### Example

```typescript
const directive = getDocDirective("@example");
console.log(directive); // "example"

// Invalid - will throw an error
getDocDirective("example"); // Error: Invalid "example"
```

***

### getDocOptions()

```ts
function getDocOptions(cliOpts?, configOptions?): Required<ConfigDocOptions>
```

Defined in: [config.ts:473](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L473)

Builds the document options by merging CLI options, config file options, and defaults.
Handles index generation flag and front matter configuration.

#### Parameters

##### cliOpts?

`Maybe`\<`CliOptions` & `Omit`\<`DeprecatedCliOptions`, `"never"`\>\>

CLI options for document generation

##### configOptions?

`Maybe`\<`ConfigDocOptions` & `Omit`\<`DeprecatedConfigDocOptions`, `"never"`\>\>

Config file options for document generation

#### Returns

`Required`\<`ConfigDocOptions`\>

The resolved document options with all required fields

#### Example

```typescript
const cliOptions = { index: true };
const configOptions = { frontMatter: { sidebar_label: 'API' } };

const docOptions = getDocOptions(cliOptions, configOptions);
console.log(docOptions);
// {
//   index: true,
//   frontMatter: { sidebar_label: 'API' }
// }
```

***

### getOnlyDocDirectives()

```ts
function getOnlyDocDirectives(cliOpts, configFileOpts): DirectiveName[]
```

Defined in: [config.ts:232](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L232)

Retrieves the list of "only" directives from CLI and config options.
These directives specify which schema elements should be included in the documentation.

#### Parameters

##### cliOpts

`Maybe`\<`CliOptions`\>

CLI options containing "only" directives

##### configFileOpts

`Maybe`\<`Pick`\<`ConfigOptions`, `"onlyDocDirective"`\>\>

Config file options containing "onlyDocDirective"

#### Returns

`DirectiveName`[]

An array of validated "only" directives (without '@' prefix)

#### Example

```typescript
const cliOptions = { only: ["@example", "@internal"] };
const configOptions = { onlyDocDirective: ["@auth"] };

const onlyDirectives = getOnlyDocDirectives(cliOptions, configOptions);
console.log(onlyDirectives); // ["example", "internal", "auth"]
```

#### See

[getDocDirective](#getdocdirective) for directive name validation

***

### getPrintTypeOptions()

```ts
function getPrintTypeOptions(cliOpts, configOptions): Required<ConfigPrintTypeOptions>
```

Defined in: [config.ts:609](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L609)

Builds the print type options by merging CLI options, config file options, and defaults.
Handles various formatting options for type documentation.

#### Parameters

##### cliOpts

`Maybe`\<`CliOptions` & `Omit`\<`DeprecatedCliOptions`, `"never"`\>\>

CLI options for print type configuration

##### configOptions

`Maybe`\<`ConfigPrintTypeOptions` & `Omit`\<`DeprecatedConfigPrintTypeOptions`, `"never"`\>\>

Config file options for print type configuration

#### Returns

`Required`\<`ConfigPrintTypeOptions`\>

The resolved print type options with all required fields

#### Example

```typescript
const cliOptions = { noCode: true, deprecated: "group" };
const configOptions = {
  exampleSection: true,
  hierarchy: "entity"
};

const printOptions = getPrintTypeOptions(cliOptions, configOptions);
console.log(printOptions);
// {
//   codeSection: false,  // Disabled via noCode CLI flag
//   deprecated: "group", // From CLI
//   exampleSection: true, // From config
//   parentTypePrefix: true, // Default value
//   relatedTypeSection: true, // Default value
//   typeBadges: true, // Default value
//   hierarchy: { entity: {} } // Parsed from config
// }
```

#### See

 - [DeprecatedOption](#deprecatedoption) for deprecated handling options
 - [getTypeHierarchyOption](#gettypehierarchyoption) for hierarchy resolution

***

### getSkipDocDirectives()

```ts
function getSkipDocDirectives(cliOpts, configFileOpts): DirectiveName[]
```

Defined in: [config.ts:267](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L267)

Retrieves the list of "skip" directives from CLI and config options.
These directives specify which schema elements should be excluded from the documentation.
Additionally, if deprecated handling is set to SKIP, adds the "deprecated" directive.

#### Parameters

##### cliOpts

`Maybe`\<`CliOptions`\>

CLI options containing "skip" directives

##### configFileOpts

`Maybe`\<`Pick`\<`ConfigOptions`, `"printTypeOptions"` \| `"skipDocDirective"`\>\>

Config file options containing "skipDocDirective" and potentially "printTypeOptions.deprecated"

#### Returns

`DirectiveName`[]

An array of validated "skip" directives (without '@' prefix)

#### Example

```typescript
const cliOptions = { skip: ["@internal"], deprecated: "skip" };
const configOptions = { skipDocDirective: ["@auth"] };

const skipDirectives = getSkipDocDirectives(cliOptions, configOptions);
console.log(skipDirectives); // ["internal", "auth", "deprecated"]
```

#### See

 - [getDocDirective](#getdocdirective) for directive name validation
 - [DeprecatedOption](#deprecatedoption) for deprecated handling options

***

### getTypeHierarchyOption()

```ts
function getTypeHierarchyOption(cliOption?, configOption?): Maybe<Partial<Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>>>
```

Defined in: [config.ts:519](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L519)

Resolves the type hierarchy configuration by merging CLI and config file options.
Validates that CLI and config don't specify conflicting hierarchy types.

#### Parameters

##### cliOption?

`Maybe`\<`TypeHierarchyValueType`\>

The hierarchy option specified via CLI (string value)

##### configOption?

`Maybe`\<`TypeHierarchyType`\>

The hierarchy option from the config file (string or object)

#### Returns

`Maybe`\<`Partial`\<`Record`\<`TypeHierarchyValueType`, `TypeHierarchyTypeOptions`\>\>\>

The resolved type hierarchy object

#### Throws

Error if CLI and config specify conflicting hierarchy types

#### Example

```typescript
// Using hierarchy from CLI (string format)
const hierarchy1 = getTypeHierarchyOption("api", undefined);
console.log(hierarchy1); // { api: {} }

// Using hierarchy from config (object format)
const hierarchy2 = getTypeHierarchyOption(undefined, { entity: { User: ["posts"] } });
console.log(hierarchy2); // { entity: { User: ["posts"] } }

// Error case - conflicting hierarchies
getTypeHierarchyOption("api", { entity: {} });
// Error: Hierarchy option mismatch in CLI flag 'api' and config 'entity'
```

#### See

[TypeHierarchy](#typehierarchy) for available hierarchy types

***

### getVisibilityDirectives()

```ts
function getVisibilityDirectives(cliOpts, configFileOpts): object
```

Defined in: [config.ts:321](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L321)

Combines and validates visibility directives (only and skip) from both CLI and config sources.
Ensures that no directive appears in both "only" and "skip" lists simultaneously.

#### Parameters

##### cliOpts

`Maybe`\<`CliOptions`\>

CLI options containing "only" and "skip" directives

##### configFileOpts

`Maybe`\<`Pick`\<`ConfigOptions`, `"onlyDocDirective"` \| `"printTypeOptions"` \| `"skipDocDirective"`\>\>

Config file options containing directive configurations

#### Returns

`object`

An object with validated "onlyDocDirective" and "skipDocDirective" arrays

##### onlyDocDirective

```ts
onlyDocDirective: DirectiveName[];
```

##### skipDocDirective

```ts
skipDocDirective: DirectiveName[];
```

#### Throws

Error if the same directive appears in both "only" and "skip" lists

#### Example

```typescript
const cliOptions = { only: ["@example"], skip: ["@internal"] };
const configOptions = { onlyDocDirective: ["@auth"] };

const visibilityDirectives = getVisibilityDirectives(cliOptions, configOptions);
console.log(visibilityDirectives);
// {
//   onlyDocDirective: ["example", "auth"],
//   skipDocDirective: ["internal"]
// }

// Invalid - will throw an error
getVisibilityDirectives(
  { only: ["@example"], skip: ["@example"] },
  {}
); // Error: The same directive cannot be declared in 'onlyDocDirective' and 'skipDocDirective'.
```

#### See

[getOnlyDocDirectives](#getonlydocdirectives) and [getSkipDocDirectives](#getskipdocdirectives) for directive retrieval

***

### ~~parseDeprecatedDocOptions()~~

```ts
function parseDeprecatedDocOptions(_cliOpts, _configOptions): Record<string, never>
```

Defined in: [config.ts:446](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L446)

Placeholder function for handling deprecated document options.
Currently returns an empty object as these options are deprecated.

#### Parameters

##### \_cliOpts

`Maybe`\<`Omit`\<`DeprecatedCliOptions`, `"never"`\>\>

Deprecated CLI options (unused)

##### \_configOptions

`Maybe`\<`Omit`\<`DeprecatedConfigDocOptions`, `"never"`\>\>

Deprecated config options (unused)

#### Returns

`Record`\<`string`, `never`\>

An empty object

#### Deprecated

This function handles deprecated options and may be removed in a future version

***

### ~~parseDeprecatedPrintTypeOptions()~~

```ts
function parseDeprecatedPrintTypeOptions(_cliOpts, _configOptions): Record<string, never>
```

Defined in: [config.ts:572](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L572)

Placeholder function for handling deprecated print type options.
Currently returns an empty object as these options are deprecated.

#### Parameters

##### \_cliOpts

`Maybe`\<`Omit`\<`DeprecatedCliOptions`, `"never"`\>\>

Deprecated CLI options (unused)

##### \_configOptions

`Maybe`\<`Omit`\<`DeprecatedConfigPrintTypeOptions`, `"never"`\>\>

Deprecated config options (unused)

#### Returns

`Record`\<`string`, `never`\>

An empty object

#### Deprecated

This function handles deprecated options and may be removed in a future version

***

### parseGroupByOption()

```ts
function parseGroupByOption(groupOptions): Maybe<GroupByDirectiveOptions>
```

Defined in: [config.ts:672](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L672)

Parses and validates the groupByDirective option string format.
The format should be @directive(field|=fallback) where:
- directive: Name of the directive to group by
- field: Name of the field in the directive to use for grouping
- fallback: (Optional) Fallback group name for items without the directive

#### Parameters

##### groupOptions

`unknown`

The group directive option as a string

#### Returns

`Maybe`\<`GroupByDirectiveOptions`\>

A parsed GroupByDirectiveOptions object or undefined if invalid

#### Throws

Error if the groupByDirective format is invalid

#### Example

```typescript
// Basic usage with directive and field
const groupBy1 = parseGroupByOption("@tag(name)");
console.log(groupBy1);
// { directive: "tag", field: "name", fallback: "Miscellaneous" }

// With custom fallback group
const groupBy2 = parseGroupByOption("@category(name|=Other)");
console.log(groupBy2);
// { directive: "category", field: "name", fallback: "Other" }

// Invalid format - will throw an error
parseGroupByOption("invalid-format");
// Error: Invalid "invalid-format"
```
