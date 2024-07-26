# @graphql-markdown/diff

## Enumerations

### CompareMethod

#### Enumeration Members

##### DIFF

```ts
DIFF: "SCHEMA-DIFF";
```

###### Defined in

[diff/src/index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L21)

##### FORCE

```ts
FORCE: "FORCE";
```

###### Defined in

[diff/src/index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L23)

##### HASH

```ts
HASH: "SCHEMA-HASH";
```

###### Defined in

[diff/src/index.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L22)

##### NONE

```ts
NONE: "NONE";
```

###### Defined in

[diff/src/index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L24)

## Variables

### SCHEMA\_HASH\_FILE

```ts
const SCHEMA_HASH_FILE: ".schema";
```

#### Defined in

[diff/src/index.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L18)

***

### SCHEMA\_REF

```ts
const SCHEMA_REF: "schema.graphql";
```

#### Defined in

[diff/src/index.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L19)

## Functions

### checkSchemaChanges()

```ts
function checkSchemaChanges(
   schema, 
   tmpDir, 
diffMethod?): Promise<boolean>
```

#### Parameters

• **schema**: `GraphQLSchema`

• **tmpDir**: `string`

• **diffMethod?**: `DiffMethodName`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[diff/src/index.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L42)

***

### getDiff()

```ts
function getDiff(schemaNew, schemaOldLocation): Promise<Change<any>[]>
```

#### Parameters

• **schemaNew**: `GraphQLSchema`

• **schemaOldLocation**: `string`

#### Returns

`Promise`\<`Change`\<`any`\>[]\>

#### Defined in

[diff/src/index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L32)

***

### getSchemaHash()

```ts
function getSchemaHash(schema): string
```

#### Parameters

• **schema**: `GraphQLSchema`

#### Returns

`string`

#### Defined in

[diff/src/index.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/diff/src/index.ts#L27)
