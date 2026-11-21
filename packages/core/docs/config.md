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

Defined in: [packages/core/src/config.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L101)

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

Defined in: [packages/core/src/config.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L102)

##### GROUP

```ts
GROUP: "group";
```

Defined in: [packages/core/src/config.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L103)

##### SKIP

```ts
SKIP: "skip";
```

Defined in: [packages/core/src/config.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L104)

---

### DiffMethod

Defined in: [packages/core/src/config.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L83)

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

Defined in: [packages/core/src/config.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L85)

##### NONE

```ts
NONE: "NONE";
```

Defined in: [packages/core/src/config.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L84)

---

### TypeHierarchy

Defined in: [packages/core/src/config.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L65)

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

Defined in: [packages/core/src/config.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L66)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [packages/core/src/config.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L67)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [packages/core/src/config.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L68)

## Variables

### ASSET\_HOMEPAGE\_LOCATION

```ts
const ASSET_HOMEPAGE_LOCATION: unique symbol;
```

Defined in: [packages/core/src/config.ts:123](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L123)

Sentinel selecting the built-in (inlined) homepage template.
It is never a filesystem path and is never read from disk.

---

### DEFAULT\_HIERARCHY

```ts
const DEFAULT_HIERARCHY: object;
```

Defined in: [packages/core/src/config.ts:131](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L131)

Default hierarchy configuration using the API hierarchy type.

#### Type Declaration

##### api

```ts
api: Record<string, never>;
```

---

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Readonly<
  Pick<
    ConfigOptions,
    "decorators" | "groupByDirective" | "loaders" | "outputAdapter"
  > &
    Required<
      Omit<
        ConfigOptions,
        | "decorators"
        | "formatter"
        | "groupByDirective"
        | "homepage"
        | "loaders"
        | "outputAdapter"
        | "printTypeOptions"
        | "telemetry"
      >
    >
> &
  object;
```

Defined in: [packages/core/src/config.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L145)

Default configuration options used when no user options are provided.
These values serve as fallbacks for any missing configuration.

#### Type Declaration

##### homepage

```ts
homepage: typeof ASSET_HOMEPAGE_LOCATION;
```

##### printTypeOptions

```ts
printTypeOptions: Required<
  Omit<ConfigPrintTypeOptions, "exampleSection" | "hierarchy">
> & object;
```

###### Type Declaration

###### exampleSection

```ts
exampleSection: ConfigPrintTypeOptions["exampleSection"];
```

###### hierarchy

```ts
hierarchy: Required<Pick<TypeHierarchyObjectType, API>>;
```

#### See

Options for the complete configuration interface

---

### DOCS\_URL

```ts
const DOCS_URL: "https://graphql-markdown.dev/docs";
```

Defined in: [packages/core/src/config.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L111)

Documentation website URL for reference in error messages and help text.

---

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@graphql-markdown/docusaurus";
```

Defined in: [packages/core/src/config.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L117)

Default package name used for temporary directory creation and identification.

## Functions

### buildConfig()

```ts
function buildConfig(configFileOpts, cliOpts?, id?, context?): Promise<Options>;
```

Defined in: [packages/core/src/config.ts:900](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L900)

#### Parameters

##### configFileOpts

`Maybe`&lt;`ConfigOptions`&gt;

##### cliOpts?

`Maybe`&lt;`CliOptions`&gt;

##### id?

`Maybe`&lt;`string`&gt; = `"default"`

##### context?

[`BuildConfigContext`](telemetry.md#buildconfigcontext)

#### Returns

`Promise`&lt;`Options`&gt;

---

### getDecoratorsOption()

```ts
function getDecoratorsOption(decorators): Maybe<Decorators>;
```

Defined in: [packages/core/src/config.ts:720](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L720)

Validates the top-level `decorators` option.

The option is keyed by a free-form id — it is not required to name a
schema directive — and every entry must declare a `render` callback. An
invalid entry is a configuration error rather than something to silently
drop, as it would otherwise produce a page missing a section without any
indication why.

#### Parameters

##### decorators

`Maybe`&lt;`Decorators`&gt;

the `decorators` option declared in the config file.

#### Returns

`Maybe`&lt;`Decorators`&gt;

the validated decorators, or `undefined` when none is declared.

#### Throws

Error if an entry is malformed or claims a built-in section name.

#### Example

```js
getDecoratorsOption({
  responses: {
    predicate: hasDirectiveNamed("httpResponse"),
    title: "Responses",
    position: { after: "metadata" },
    render: (values) =>
      values.map((v) => `- \`${v.code}\` ${v.description}`).join("\n"),
  },
});
```

---

### getDiffMethod()

```ts
function getDiffMethod(diff): TypeDiffMethod;
```

Defined in: [packages/core/src/config.ts:398](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L398)

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

Defined in: [packages/core/src/config.ts:231](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L231)

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

Defined in: [packages/core/src/config.ts:452](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L452)

#### Parameters

##### cliOpts?

`Maybe`&lt;`CliOptions`&gt;

##### configOptions?

`Maybe`&lt;`ConfigDocOptions`&gt;

#### Returns

`Required`&lt;`ConfigDocOptions`&gt;

---

### getForcedDiffMethod()

```ts
function getForcedDiffMethod(): TypeDiffMethod;
```

Defined in: [packages/core/src/config.ts:389](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L389)

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

### getOnlyDocDirectives()

```ts
function getOnlyDocDirectives(cliOpts, configFileOpts): DirectiveName[];
```

Defined in: [packages/core/src/config.ts:262](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L262)

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

### getSkipDocDirectives()

```ts
function getSkipDocDirectives(cliOpts, configFileOpts): DirectiveName[];
```

Defined in: [packages/core/src/config.ts:297](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L297)

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

Defined in: [packages/core/src/config.ts:507](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L507)

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

Defined in: [packages/core/src/config.ts:351](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L351)

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
  _cliOpts?,
  _configOptions?,
): Record<string, never>;
```

Defined in: [packages/core/src/config.ts:403](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L403)

#### Parameters

##### \_cliOpts?

`Maybe`&lt;`CliOptions`&gt;

##### \_configOptions?

`Maybe`&lt;`ConfigDocOptions`&gt;

#### Returns

`Record`&lt;`string`, `never`&gt;

---

### parseDeprecatedPrintTypeOptions()

```ts
function parseDeprecatedPrintTypeOptions(
  _cliOpts?,
  _configOptions?,
): Record<string, never>;
```

Defined in: [packages/core/src/config.ts:552](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L552)

#### Parameters

##### \_cliOpts?

`Maybe`&lt;`CliOptions`&gt;

##### \_configOptions?

`Maybe`&lt;`ConfigPrintTypeOptions`&gt;

#### Returns

`Record`&lt;`string`, `never`&gt;

---

### parseGroupByOption()

```ts
function parseGroupByOption(groupOptions): Maybe<GroupByDirectiveOptions>;
```

Defined in: [packages/core/src/config.ts:810](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L810)

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
function parseHomepageOption(
  cliHomepage,
  configHomepage,
): Maybe<string | typeof ASSET_HOMEPAGE_LOCATION>;
```

Defined in: [packages/core/src/config.ts:831](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L831)

#### Parameters

##### cliHomepage

`Maybe`&lt;`string` \| `false`&gt;

##### configHomepage

`Maybe`&lt;`string` \| `false`&gt;

#### Returns

`Maybe`&lt;`string` \| _typeof_ [`ASSET_HOMEPAGE_LOCATION`](#asset_homepage_location)&gt;
