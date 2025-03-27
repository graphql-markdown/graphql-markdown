# @graphql-markdown/diff

## Enumerations

### CompareMethod

Defined in: [index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L23)

Comparison methods used to determine if a schema has changed.

#### Enumeration Members

##### DIFF

```ts
DIFF: "SCHEMA-DIFF";
```

Defined in: [index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L25)

Compare schemas by diffing the content

##### FORCE

```ts
FORCE: "FORCE";
```

Defined in: [index.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L29)

Force regeneration regardless of changes

##### HASH

```ts
HASH: "SCHEMA-HASH";
```

Defined in: [index.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L27)

Compare schemas by comparing hash values

##### NONE

```ts
NONE: "NONE";
```

Defined in: [index.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L31)

Skip comparison and assume no changes

## Variables

### checkSchemaChanges

```ts
const checkSchemaChanges: FunctionCheckSchemaChanges;
```

Defined in: [index.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L71)

Checks if a schema has changed compared to a previous version.
Uses either diff or hash-based comparison methods based on the method parameter.

#### Param

The current GraphQL schema

#### Param

Directory where schema or hash files will be saved

#### Param

Comparison method to use (defaults to DIFF)

#### Returns

A promise resolving to a boolean indicating whether the schema has changed

***

### SCHEMA\_HASH\_FILE

```ts
const SCHEMA_HASH_FILE: ".schema";
```

Defined in: [index.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L18)

***

### SCHEMA\_REF

```ts
const SCHEMA_REF: "schema.graphql";
```

Defined in: [index.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L19)

## Functions

### getDiff()

```ts
function getDiff(schemaNew, schemaOldLocation): Promise<Change<any>[]>
```

Defined in: [index.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L52)

Compares a new schema against an existing schema file and returns the differences.

#### Parameters

##### schemaNew

`GraphQLSchema`

The new GraphQL schema to compare

##### schemaOldLocation

`string`

File path to the old schema

#### Returns

`Promise`\<`Change`\<`any`\>[]\>

A promise resolving to an array of schema changes

***

### getSchemaHash()

```ts
function getSchemaHash(schema): string
```

Defined in: [index.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L40)

Generates a SHA-256 hash for a GraphQL schema.

#### Parameters

##### schema

`GraphQLSchema`

The GraphQL schema to generate a hash for

#### Returns

`string`

A SHA-256 hash string representing the schema
