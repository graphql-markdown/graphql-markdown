# relation

Library supporting `relatedTypeSection` for displaying relations between GraphQL schema entities.

## See

[Option `relatedTypeSection`](https://graphql-markdown.github.io/docs/settings#printtypeoptions)

## Functions

### getRelationOfField()

```ts
getRelationOfField(type, schemaMap): Partial<Record<SchemaEntity, RelationOfField[]>>
```

Returns a map of fields and arguments where the GraphQL schema type matches the type.

#### Parameters

▪ **type**: `unknown`

the GraphQL schema type being processed.

▪ **schemaMap**: `Maybe`\<`SchemaMap`\>

a GraphQL schema map (see [introspection!getSchemaMap](introspection.md#getschemamap)).

#### Returns

`Partial`\<`Record`\<`SchemaEntity`, `RelationOfField`[]\>\>

a record map of fields and arguments relations.

#### See

[mapRelationOf]([object Object])

#### Source

[packages/types/src/graphql.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/graphql.d.ts#L78)

***

### getRelationOfImplementation()

```ts
getRelationOfImplementation(type, schemaMap): Partial<Record<SchemaEntity, RelationOfImplementation[]>>
```

Returns a map of types (unions or interfaces) where the GraphQL schema type is implemented.

#### Parameters

▪ **type**: `unknown`

the GraphQL schema type being processed.

▪ **schemaMap**: `Maybe`\<`SchemaMap`\>

a GraphQL schema map (see [introspection!getSchemaMap](introspection.md#getschemamap)).

#### Returns

`Partial`\<`Record`\<`SchemaEntity`, `RelationOfImplementation`[]\>\>

a record map of unions or interfaces relations.

#### See

[mapRelationOf]([object Object])

#### Source

[packages/types/src/graphql.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/graphql.d.ts#L78)

***

### getRelationOfInterface()

```ts
getRelationOfInterface(type, schemaMap): Partial<Record<SchemaEntity, RelationOfInterface[]>>
```

Returns a map of interfaces where the GraphQL schema type is extended.

#### Parameters

▪ **type**: `unknown`

the GraphQL schema type being processed.

▪ **schemaMap**: `Maybe`\<`SchemaMap`\>

a GraphQL schema map (see [introspection!getSchemaMap](introspection.md#getschemamap)).

#### Returns

`Partial`\<`Record`\<`SchemaEntity`, `RelationOfInterface`[]\>\>

a record map of interfaces relations.

#### See

[mapRelationOf]([object Object])

#### Source

[packages/types/src/graphql.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/graphql.d.ts#L78)

***

### getRelationOfReturn()

```ts
getRelationOfReturn(type, schemaMap): Partial<Record<SchemaEntity, GraphQLOperationType[]>>
```

Returns a map of operations (queries, mutations, subscriptions) where the GraphQL schema type is the return type.

#### Parameters

▪ **type**: `unknown`

the GraphQL schema type being processed.

▪ **schemaMap**: `Maybe`\<`SchemaMap`\>

a GraphQL schema map (see [introspection!getSchemaMap](introspection.md#getschemamap)).

#### Returns

`Partial`\<`Record`\<`SchemaEntity`, `GraphQLOperationType`[]\>\>

a record map of operations relations.

#### See

[mapRelationOf]([object Object])

#### Source

[packages/types/src/graphql.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/graphql.d.ts#L78)

***

### getRelationOfUnion()

```ts
getRelationOfUnion(type, schemaMap): Partial<Record<SchemaEntity, GraphQLUnionType[]>>
```

Returns a map of unions where the GraphQL schema type is part of it.

#### Parameters

▪ **type**: `unknown`

the GraphQL schema type being processed.

▪ **schemaMap**: `Maybe`\<`SchemaMap`\>

a GraphQL schema map (see [introspection!getSchemaMap](introspection.md#getschemamap)).

#### Returns

`Partial`\<`Record`\<`SchemaEntity`, `GraphQLUnionType`[]\>\>

a record map of unions relations.

#### See

[mapRelationOf]([object Object])

#### Source

[packages/types/src/graphql.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/graphql.d.ts#L78)
