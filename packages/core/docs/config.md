# config

Configuration management for GraphQL Markdown.

This module handles all aspects of configuration including:

- Loading and merging configuration from multiple sources
- Validating configuration values
- Providing defaults for missing options
- Processing special configuration options (directives, deprecated items, etc)

The configuration follows this precedence (highest to lowest):

1. CLI arguments
2. Config file options
3. GraphQL Config options
4. Default values

## Enumerations

### DeprecatedOption

Defined in: [core/src/config.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L102)

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

Defined in: [core/src/config.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L103)

##### GROUP

```ts
GROUP: "group";
```

Defined in: [core/src/config.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L104)

##### SKIP

```ts
SKIP: "skip";
```

Defined in: [core/src/config.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L105)

---

### DiffMethod

Defined in: [core/src/config.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L84)

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

Defined in: [core/src/config.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L86)

##### NONE

```ts
NONE: "NONE";
```

Defined in: [core/src/config.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L85)

---

### TypeHierarchy

Defined in: [core/src/config.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L66)

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

Defined in: [core/src/config.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L67)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [core/src/config.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L68)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [core/src/config.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L69)

## Variables

### ASSET_HOMEPAGE_LOCATION

```ts
const ASSET_HOMEPAGE_LOCATION: string;
```

Defined in: [core/src/config.ts:123](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L123)

Location of the default homepage template.

---

### DEFAULT_HIERARCHY

```ts
const DEFAULT_HIERARCHY: object;
```

Defined in: [core/src/config.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L134)

Default hierarchy configuration using the API hierarchy type.

#### Type Declaration

##### api

```ts
api: object = {};
```

---

### DEFAULT_OPTIONS

```ts
const DEFAULT_OPTIONS: Readonly<
  Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> &
    Required<
      Omit<
        ConfigOptions,
        | "customDirective"
        | "groupByDirective"
        | "loaders"
        | "mdxParser"
        | "printTypeOptions"
      >
    >
> &
  object;
```

Defined in: [core/src/config.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L143)

Default configuration options used when no user options are provided.
These values serve as fallbacks for any missing configuration.

#### Type Declaration

##### printTypeOptions

```ts
printTypeOptions: Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & object;
```

###### Type Declaration

###### hierarchy

```ts
hierarchy: Required<Pick<TypeHierarchyObjectType, API>>;
```

#### See

Options for the complete configuration interface

---

### DOCS_URL

```ts
const DOCS_URL: "https://graphql-markdown.dev/docs";
```

Defined in: [core/src/config.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L112)

Documentation website URL for reference in error messages and help text.

---

### PACKAGE_NAME

```ts
const PACKAGE_NAME: "@graphql-markdown/docusaurus";
```

Defined in: [core/src/config.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L118)

Default package name used for temporary directory creation and identification.

## Functions

### buildConfig()

```ts
function buildConfig(configFileOpts, cliOpts?, id?): Promise<Options>;
```

Defined in: [core/src/config.ts:820](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L820)

#### Parameters

##### configFileOpts

`Maybe`&lt;`ConfigOptions`&gt;

##### cliOpts?

`Maybe`&lt;`CliOptions`&gt;

##### id?

`Maybe`&lt;`string`&gt; = `"default"`

#### Returns

`Promise`&lt;`Options`&gt;

---

### getCustomDirectives()

```ts
function getCustomDirectives(
  customDirectiveOptions,
  skipDocDirective?,
): Maybe<CustomDirective>;
```

Defined in: [core/src/config.ts:392](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L392)

Processes custom directives, filtering out any that should be skipped.
Validates that each custom directive has the correct format with required functions.

#### Parameters

##### customDirectiveOptions

`Maybe`&lt;`CustomDirective`&gt;

The custom directive configuration object

##### skipDocDirective?

`Maybe`&lt;`DirectiveName`[]&gt;

Array of directive names that should be skipped

#### Returns

`Maybe`&lt;`CustomDirective`&gt;

The filtered custom directives object, or `undefined` if empty/invalid

#### Throws

Error if a custom directive has an invalid format

#### Example

```typescript
// Valid custom directive with descriptor function
const customDirectives = {
  example: {
    tag: (value) => `Example: ${value}`,
  },
  note: {
    descriptor: () => "Note items",
  },
};

// Filter out the "example" directive, keeping "note"
const filteredDirectives = getCustomDirectives(customDirectives, ["example"]);
console.log(filteredDirectives); // { note: { descriptor: [Function] } }

// Invalid format - will throw an error
getCustomDirectives({ example: { invalid: true } }, []);
// Error: Wrong format for plugin custom directive "example"...
```

#### See

[DOCS_URL](#docs_url)/advanced/custom-directive for custom directive format documentation

---

### getDiffMethod()

```ts
function getDiffMethod(diff): TypeDiffMethod;
```

Defined in: [core/src/config.ts:447](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L447)

#### Parameters

##### diff

`TypeDiffMethod`

#### Returns

`TypeDiffMethod`

---

### getDocDirective()

```ts
function getDocDirective(name): DirectiveName;
```

Defined in: [core/src/config.ts:217](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L217)

Retrieves a directive name from a string by parsing and validating the format.
Directive names should be prefixed with '@' (e.g., '@example').

#### Parameters

##### name

`Maybe`&lt;`DirectiveName`&gt;

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

---

### getDocOptions()

```ts
function getDocOptions(cliOpts?, configOptions?): Required<ConfigDocOptions>;
```

Defined in: [core/src/config.ts:486](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L486)

Builds the document options by merging CLI options, config file options, and defaults.
Handles index generation flag and front matter configuration.

#### Parameters

##### cliOpts?

`Maybe`&lt;`CliOptions` & `Omit`&lt;`DeprecatedCliOptions`, `"never"`&gt;&gt;

CLI options for document generation

##### configOptions?

`Maybe`&lt;`ConfigDocOptions` & `Omit`&lt;`DeprecatedConfigDocOptions`, `"never"`&gt;&gt;

Config file options for document generation

#### Returns

`Required`&lt;`ConfigDocOptions`&gt;

The resolved document options with all required fields

#### Example

```typescript
const cliOptions = { index: true };
const configOptions = { frontMatter: { sidebar_label: "API" } };

const docOptions = getDocOptions(cliOptions, configOptions);
console.log(docOptions);
// {
//   index: true,
//   frontMatter: { sidebar_label: 'API' }
// }
```

---

### getForcedDiffMethod()

```ts
function getForcedDiffMethod(): TypeDiffMethod;
```

Defined in: [core/src/config.ts:437](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L437)

Returns FORCE as the diff method.
This function is used when documentation should be forcefully regenerated.

#### Returns

`TypeDiffMethod`

The FORCE diff method

#### Example

```typescript
const method = getForcedDiffMethod();
console.log(method); // "FORCE"
```

#### See

[DiffMethod](#diffmethod) for available diff methods

---

### getNormalizedDiffMethod()

```ts
function getNormalizedDiffMethod(diff): TypeDiffMethod;
```

Defined in: [core/src/config.ts:441](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L441)

#### Parameters

##### diff

`TypeDiffMethod`

#### Returns

`TypeDiffMethod`

---

### getOnlyDocDirectives()

```ts
function getOnlyDocDirectives(cliOpts, configFileOpts): DirectiveName[];
```

Defined in: [core/src/config.ts:248](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L248)

Retrieves the list of "only" directives from CLI and config options.
These directives specify which schema elements should be included in the documentation.

#### Parameters

##### cliOpts

`Maybe`&lt;`CliOptions`&gt;

CLI options containing "only" directives

##### configFileOpts

`Maybe`&lt;`Pick`&lt;`ConfigOptions`, `"onlyDocDirective"`&gt;&gt;

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

---

### getPrintTypeOptions()

```ts
function getPrintTypeOptions(
  cliOpts,
  configOptions,
): Required<ConfigPrintTypeOptions>;
```

Defined in: [core/src/config.ts:671](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L671)

Builds the print type options by merging CLI options, config file options, and defaults.
Handles various formatting options for type documentation.

#### Parameters

##### cliOpts

`Maybe`&lt;`CliOptions` & `Omit`&lt;`DeprecatedCliOptions`, `"never"`&gt;&gt;

CLI options for print type configuration

##### configOptions

`Maybe`&lt;`ConfigPrintTypeOptions` & `Omit`&lt;`DeprecatedConfigPrintTypeOptions`, `"never"`&gt;&gt;

Config file options for print type configuration

#### Returns

`Required`&lt;`ConfigPrintTypeOptions`&gt;

The resolved print type options with all required fields

#### Example

```typescript
const cliOptions = { noCode: true, deprecated: "group" };
const configOptions = {
  exampleSection: true,
  hierarchy: "entity",
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

---

### getSkipDocDirectives()

```ts
function getSkipDocDirectives(cliOpts, configFileOpts): DirectiveName[];
```

Defined in: [core/src/config.ts:283](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L283)

Retrieves the list of "skip" directives from CLI and config options.
These directives specify which schema elements should be excluded from the documentation.
Additionally, if deprecated handling is set to SKIP, adds the "deprecated" directive.

#### Parameters

##### cliOpts

`Maybe`&lt;`CliOptions`&gt;

CLI options containing "skip" directives

##### configFileOpts

`Maybe`&lt;`Pick`&lt;`ConfigOptions`, `"printTypeOptions"` \| `"skipDocDirective"`&gt;&gt;

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

---

### getTypeHierarchyOption()

```ts
function getTypeHierarchyOption(
  cliOption?,
  configOption?,
): Maybe<Partial<Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>>>;
```

Defined in: [core/src/config.ts:539](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L539)

Resolves the type hierarchy configuration by merging CLI and config file options.
Validates that CLI and config don't specify conflicting hierarchy types.

#### Parameters

##### cliOption?

`Maybe`&lt;`TypeHierarchyValueType`&gt;

The hierarchy option specified via CLI (string value)

##### configOption?

`Maybe`&lt;`TypeHierarchyType`&gt;

The hierarchy option from the config file (string or object)

#### Returns

`Maybe`&lt;`Partial`&lt;`Record`&lt;`TypeHierarchyValueType`, `TypeHierarchyTypeOptions`&gt;&gt;&gt;

The resolved type hierarchy object

#### Throws

Error if CLI and config specify conflicting hierarchy types

#### Example

```typescript
// Using hierarchy from CLI (string format)
const hierarchy1 = getTypeHierarchyOption("api", undefined);
console.log(hierarchy1); // { api: {} }

// Using hierarchy from config (object format)
const hierarchy2 = getTypeHierarchyOption(undefined, {
  entity: { User: ["posts"] },
});
console.log(hierarchy2); // { entity: { User: ["posts"] } }

// Error case - conflicting hierarchies
getTypeHierarchyOption("api", { entity: {} });
// Error: Hierarchy option mismatch in CLI flag 'api' and config 'entity'
```

#### See

[TypeHierarchy](#typehierarchy) for available hierarchy types

---

### getVisibilityDirectives()

```ts
function getVisibilityDirectives(cliOpts, configFileOpts): object;
```

Defined in: [core/src/config.ts:337](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L337)

Combines and validates visibility directives (only and skip) from both CLI and config sources.
Ensures that no directive appears in both "only" and "skip" lists simultaneously.

#### Parameters

##### cliOpts

`Maybe`&lt;`CliOptions`&gt;

CLI options containing "only" and "skip" directives

##### configFileOpts

`Maybe`&lt;`Pick`&lt;`ConfigOptions`, `"onlyDocDirective"` \| `"printTypeOptions"` \| `"skipDocDirective"`&gt;&gt;

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
getVisibilityDirectives({ only: ["@example"], skip: ["@example"] }, {}); // Error: The same directive cannot be declared in 'onlyDocDirective' and 'skipDocDirective'.
```

#### See

[getOnlyDocDirectives](#getonlydocdirectives) and [getSkipDocDirectives](#getskipdocdirectives) for directive retrieval

---

### parseDeprecatedDocOptions()

```ts
function parseDeprecatedDocOptions(
  _cliOpts,
  _configOptions,
): Record<string, never>;
```

Defined in: [core/src/config.ts:459](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L459)

Placeholder function for handling deprecated document options.
Currently returns an empty object as these options are deprecated.

#### Parameters

##### \_cliOpts

`Maybe`&lt;`Omit`&lt;`DeprecatedCliOptions`, `"never"`&gt;&gt;

Deprecated CLI options (unused)

##### \_configOptions

`Maybe`&lt;`Omit`&lt;`DeprecatedConfigDocOptions`, `"never"`&gt;&gt;

Deprecated config options (unused)

#### Returns

`Record`&lt;`string`, `never`&gt;

An empty object

---

### parseDeprecatedPrintTypeOptions()

```ts
function parseDeprecatedPrintTypeOptions(
  cliOpts,
  configOptions,
): Record<string, never>;
```

Defined in: [core/src/config.ts:593](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L593)

Handles deprecated print type options.

Emits deprecation warnings when legacy section toggle options are detected
from CLI flags or config file values.

#### Parameters

##### cliOpts

`Maybe`&lt;`Pick`&lt;`CliOptions`, `"noCode"` \| `"noExample"` \| `"noRelatedType"`&gt;&gt;

CLI options containing deprecated print type flags

##### configOptions

`Maybe`&lt;`Pick`&lt;`ConfigPrintTypeOptions`, `"codeSection"` \| `"exampleSection"` \| `"relatedTypeSection"`&gt;&gt;

Config options containing deprecated print type settings

#### Returns

`Record`&lt;`string`, `never`&gt;

An empty object reserved for backward compatibility

---

### parseGroupByOption()

```ts
function parseGroupByOption(groupOptions): Maybe<GroupByDirectiveOptions>;
```

Defined in: [core/src/config.ts:732](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L732)

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

`Maybe`&lt;`GroupByDirectiveOptions`&gt;

A parsed `GroupByDirectiveOptions` object or `undefined` if invalid

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

---

### parseHomepageOption()

```ts
function parseHomepageOption(cliHomepage, configHomepage): Maybe<string>;
```

Defined in: [core/src/config.ts:752](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L752)

#### Parameters

##### cliHomepage

`Maybe`&lt;`string` \| `false`&gt;

##### configHomepage

`Maybe`&lt;`string` \| `false`&gt;

#### Returns

`Maybe`&lt;`string`&gt;
