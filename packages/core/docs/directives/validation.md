# directives/validation

Configuration validation utilities for directive and configuration options.

Provides type guard functions and validators for checking configuration object shapes,
function types, and property existence patterns commonly used across the codebase.

## Functions

### hasDescriptor()

```ts
function hasDescriptor(
  config,
): config is Record<"descriptor", (args: unknown[]) => unknown>;
```

Defined in: [directives/validation.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L39)

Type guard to check if an object has a `descriptor` function property.

Validates that the object is a proper type object and contains a function named `descriptor`.

#### Parameters

##### config

`unknown`

The configuration object to check

#### Returns

`config is Record<"descriptor", (args: unknown[]) => unknown>`

True if config has a descriptor function property

#### Example

```typescript
if (hasDescriptor(option)) {
  // option.descriptor is guaranteed to be a function
  const result = option.descriptor(directive);
}
```

---

### hasTag()

```ts
function hasTag(config): config is Record<"tag", (args: unknown[]) => unknown>;
```

Defined in: [directives/validation.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L65)

Type guard to check if an object has a `tag` function property.

Validates that the object is a proper type object and contains a function named `tag`.

#### Parameters

##### config

`unknown`

The configuration object to check

#### Returns

`config is Record<"tag", (args: unknown[]) => unknown>`

True if config has a tag function property

#### Example

```typescript
if (hasTag(option)) {
  // option.tag is guaranteed to be a function
  const result = option.tag(directive);
}
```

---

### isGroupsObject()

```ts
function isGroupsObject(groups): groups is Record<string, string>;
```

Defined in: [directives/validation.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L153)

Type guard to check if a value is a configuration group object.

Validates that the value is a type object (not null, not array, not primitive).

#### Parameters

##### groups

`unknown`

The groups value to check

#### Returns

`groups is Record<string, string>`

True if groups is an object mapping (not an array)

#### Example

```typescript
if (isGroupsObject(options.groups)) {
  // groups is an object with configuration overrides
  folderNames = { ...API_GROUPS, ...groups };
}
```

---

### isInvalidFunctionProperty()

```ts
function isInvalidFunctionProperty(
  config,
  property,
): config is Record<string, unknown>;
```

Defined in: [directives/validation.ts:196](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L196)

Type guard to check if a descriptor or tag property is NOT a function.

Used for validation to detect invalid configuration where descriptor or tag
are defined but are not callable functions.

#### Parameters

##### config

`unknown`

The configuration object to check

##### property

The property name to check ("descriptor" or "tag")

`"descriptor"` | `"tag"`

#### Returns

`config is Record<string, unknown>`

True if the property exists but is not a function

#### Example

```typescript
if (isInvalidFunctionProperty(option, "descriptor")) {
  throw new Error("descriptor must be a function");
}
```

---

### isLoaderString()

```ts
function isLoaderString(loader): loader is string;
```

Defined in: [directives/validation.ts:175](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L175)

Type guard to check if a value is a loader module name (string).

Validates that the value is a string representing a module name for dynamic loading.

#### Parameters

##### loader

`unknown`

The loader value to check

#### Returns

`loader is string`

True if loader is a string module name

#### Example

```typescript
if (isLoaderString(loaders[name])) {
  // loaders[name] is a string module name that needs wrapping
  loaders[name] = { module: loaders[name], options };
}
```

---

### isPath()

```ts
function isPath(path): path is string;
```

Defined in: [directives/validation.ts:133](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L133)

Type guard to check if a value is a valid non-empty path string.

Validates that the value is a string and not empty, suitable for file paths or URLs.

#### Parameters

##### path

`unknown`

The path value to check

#### Returns

`path is string`

True if path is a non-empty string

#### Example

```typescript
if (isPath(folderPath)) {
  // folderPath is guaranteed to be a non-empty string
  const fullPath = join(basePath, folderPath);
}
```

---

### isSchemaObject()

```ts
function isSchemaObject(schema): schema is Record<string, unknown>;
```

Defined in: [directives/validation.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L111)

Type guard to check if a value is a schema object (key-value mapping).

Validates that the value is a type object, not null, not an array, and can be treated as a schema map.

#### Parameters

##### schema

`unknown`

The schema value to check

#### Returns

`schema is Record<string, unknown>`

True if schema is an object mapping (not an array)

#### Example

```typescript
if (isSchemaObject(projectConfig.schema)) {
  // Extract first key from schema map
  const key = Object.keys(schema)[0];
}
```

---

### isSchemaString()

```ts
function isSchemaString(schema): schema is string;
```

Defined in: [directives/validation.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/directives/validation.ts#L91)

Type guard to check if a value is a schema string.

Validates that the value is a string representing a GraphQL schema path or URL.

#### Parameters

##### schema

`unknown`

The schema value to check

#### Returns

`schema is string`

True if schema is a string

#### Example

```typescript
if (isSchemaString(config.schema)) {
  // config.schema is a string path/URL
  const schemaUrl = config.schema;
}
```
