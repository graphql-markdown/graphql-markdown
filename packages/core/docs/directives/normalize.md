# directives/normalize

Directive name normalization and processing utilities.

This module consolidates utilities for handling directive names from multiple
sources (CLI, config file, etc.) ensuring consistent normalization across
the application.

## Functions

### combineDirectiveNames()

```ts
function combineDirectiveNames(...sources): DirectiveName[];
```

Defined in: [directives/normalize.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/normalize.ts#L92)

Combines and deduplicates directive names from multiple sources in one step.

This is a convenience function that combines normalizeDirectiveNames
with uniqueDirectiveNames for the common case where you need both
normalization and deduplication.

#### Parameters

##### sources

...`Maybe`\<`DirectiveName`[]\>[]

Multiple arrays of directive names or undefined/null values

#### Returns

`DirectiveName`[]

A single array of deduplicated directive names

#### Example

```typescript
import { combineDirectiveNames } from "@graphql-markdown/core/directives/normalize";

const cliDirectives = ["@example", "@internal"];
const configDirectives = ["@auth", "@example"]; // @example is duplicate

const all = combineDirectiveNames(cliDirectives, configDirectives);
// Result: ["@example", "@internal", "@auth"]
```

***

### normalizeDirectiveNames()

```ts
function normalizeDirectiveNames(...sources): DirectiveName[];
```

Defined in: [directives/normalize.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/normalize.ts#L42)

Normalizes directive names from multiple sources into a single flattened array.

This function:
1. Accepts multiple directive name arrays from different sources
2. Filters out null/undefined values and empty arrays
3. Flattens them into a single array
4. Returns the normalized array (may contain duplicates if sources contain duplicates)

Useful when combining directives from CLI, config file, and environment sources.

#### Parameters

##### sources

...`Maybe`\<`DirectiveName`[]\>[]

Multiple arrays of directive names or undefined/null values

#### Returns

`DirectiveName`[]

A single array of normalized directive names (may contain duplicates)

#### Example

```typescript
import { normalizeDirectiveNames } from "@graphql-markdown/core/directives/normalize";

const cliDirectives = ["@example", "@internal"];
const configDirectives = ["@auth"];

const all = normalizeDirectiveNames(cliDirectives, configDirectives);
// Result: ["@example", "@internal", "@auth"]

// Safely handles undefined:
const safe = normalizeDirectiveNames(cliDirectives, undefined, configDirectives);
// Result: ["@example", "@internal", "@auth"]
```

***

### uniqueDirectiveNames()

```ts
function uniqueDirectiveNames(directives): DirectiveName[];
```

Defined in: [directives/normalize.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/normalize.ts#L65)

Removes duplicate directive names from an array while preserving order.

#### Parameters

##### directives

`DirectiveName`[]

Array of directive names that may contain duplicates

#### Returns

`DirectiveName`[]

A new array with duplicate directive names removed

#### Example

```typescript
import { uniqueDirectiveNames } from "@graphql-markdown/core/directives/normalize";

const directives = ["@auth", "@example", "@auth", "@internal"];
const unique = uniqueDirectiveNames(directives);
// Result: ["@auth", "@example", "@internal"]
```
