# options/builder

Option builder for handling CLI/config/default option precedence.

This utility provides a fluent interface for merging options from multiple
sources (CLI, config file, defaults) with consistent precedence rules:
1. CLI options (highest priority)
2. Config file options
3. Default values (lowest priority)

Precedence is enforced semantically via the setIfProvided() method,
regardless of the order in which methods are called. Each value tracks its
source, and only higher-precedence sources can override existing values.

Eliminates repetitive if/coalesce patterns throughout the codebase.

## Classes

### OptionBuilder

Defined in: [options/builder.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L49)

Builder for constructing options from multiple sources with priority precedence.

Precedence is enforced semantically via source tracking, not by call order.
CLI values always override config values, which always override defaults,
regardless of the order in which methods are called.

#### Example

```typescript
const options = new OptionBuilder<MyOptions>()
  // Add in order: default -> config -> cli
  .addDefault(false, "pretty")
  .addFromConfig(undefined, "pretty")
  .addFromCli(true, "pretty")  // CLI overrides default
  .addDefault("/", "baseURL")
  .addFromConfig("/api", "baseURL")  // Config overrides default
  .addFromCli(undefined, "baseURL")
  .build();
// Result: { pretty: true, baseURL: "/api" }
```

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

The type of the options object being built

#### Constructors

##### Constructor

```ts
new OptionBuilder<T>(): OptionBuilder<T>;
```

###### Returns

[`OptionBuilder`](#optionbuilder)\<`T`\>

#### Methods

##### addDefault()

```ts
addDefault<K>(value, key): this;
```

Defined in: [options/builder.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L73)

Adds a default value (lowest priority).
Sets a value that can be overwritten by config or CLI options.
This method can be called at any time; precedence is enforced semantically.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### value

`Maybe`\<`T`\[`K`\]\>

The default value

###### key

`K`

The key to store the value under

###### Returns

`this`

This builder for method chaining

###### Example

```typescript
builder.addDefault(3000, "port")
```

##### addFromCli()

```ts
addFromCli<K>(value, key): this;
```

Defined in: [options/builder.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L109)

Adds a value from CLI options if provided (highest priority).
Can override both default and config values for this key.
This method can be called at any time; precedence is enforced semantically.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### value

`Maybe`\<`T`\[`K`\]\>

The CLI option value

###### key

`K`

The key to store the value under

###### Returns

`this`

This builder for method chaining

###### Example

```typescript
builder.addFromCli(cliOpts.port, "port")
```

##### addFromConfig()

```ts
addFromConfig<K>(value, key): this;
```

Defined in: [options/builder.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L91)

Adds a value from config file if provided (medium priority).
Can override default values if the config value exists.
This method can be called at any time; precedence is enforced semantically.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### value

`Maybe`\<`T`\[`K`\]\>

The config file option value

###### key

`K`

The key to store the value under

###### Returns

`this`

This builder for method chaining

###### Example

```typescript
builder.addFromConfig(config.port, "port")
```

##### build()

```ts
build(): Partial<T>;
```

Defined in: [options/builder.ts:222](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L222)

Returns the built options object with all accumulated values.
The object contains all keys that were set during the building process.

Note: The returned object may be a partial object containing only the keys
that were set. Callers should handle potentially missing properties.
Returns a defensive copy of the object to prevent external mutations of
internal state. Arrays and objects are shallow-copied to protect against
external modifications.

###### Returns

`Partial`\<`T`\>

The constructed options object with type Partial<T> (may not have all properties of T)

##### get()

```ts
get<K>(key): T[K] | undefined;
```

Defined in: [options/builder.ts:199](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L199)

Gets the current value for a key without building.
Useful for conditional logic during building.
Returns a shallow copy for arrays and objects to prevent external mutations.
Note: Nested objects and arrays are not deep copied.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### key

`K`

The key to get

###### Returns

`T`\[`K`\] \| `undefined`

The current value for the key, or undefined if not set

##### transform()

```ts
transform<K>(key, fn): this;
```

Defined in: [options/builder.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L158)

Transforms a value using a function if the key exists.
Useful for processing values after they've been set.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### key

`K`

The key to transform

###### fn

(`v`) => `T`\[`K`\]

Function that transforms the current value

###### Returns

`this`

This builder for method chaining

###### Example

```typescript
builder.transform("path", (p) => resolve(p))
```

##### transformIf()

```ts
transformIf<K>(
   key, 
   predicate, 
   fn): this;
```

Defined in: [options/builder.ts:179](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/options/builder.ts#L179)

Conditionally applies a transformation if a predicate is true.
Useful for applying different transformations based on other values.

###### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### key

`K`

The key to potentially transform

###### predicate

(`merged`) => `boolean`

Function that determines if transformation should apply

###### fn

(`v`) => `T`\[`K`\]

Function that transforms the value if predicate is true

###### Returns

`this`

This builder for method chaining

###### Example

```typescript
builder.transformIf("path", () => force, (p) => resolve(p))
```
