# Module: graphql/relation

Library supporting `relatedTypeSection` for displaying relations between GraphQL schema entities.

## See

[Option `relatedTypeSection`](https://graphql-markdown.github.io/docs/settings#printtypeoptions)

## Functions

### getRelationOfField()

```ts
getRelationOfField(type, schemaMap): Partial< Record< SchemaEntity, RelationOfField[] > >
```

Returns a map of fields and arguments where the GraphQL schema type matches the type.

#### See

mapRelationOf

#### Parameters

| Parameter   | Type                     | Description                              |
| :---------- | :----------------------- | :--------------------------------------- |
| `type`      | `unknown`                | the GraphQL schema type being processed. |
| `schemaMap` | `Maybe`\< `SchemaMap` \> | a GraphQL schema map (see getSchemaMap). |

#### Returns

`Partial`\< `Record`\< `SchemaEntity`, `RelationOfField`[] \> \>

a record map of fields and arguments relations.

#### Source

[packages/types/src/utils.d.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/utils.d.ts#L106)

---

### getRelationOfImplementation()

```ts
getRelationOfImplementation(type, schemaMap): Partial< Record< SchemaEntity, RelationOfImplementation[] > >
```

Returns a map of types (unions or interfaces) where the GraphQL schema type is implemented.

#### See

mapRelationOf

#### Parameters

| Parameter   | Type                     | Description                              |
| :---------- | :----------------------- | :--------------------------------------- |
| `type`      | `unknown`                | the GraphQL schema type being processed. |
| `schemaMap` | `Maybe`\< `SchemaMap` \> | a GraphQL schema map (see getSchemaMap). |

#### Returns

`Partial`\< `Record`\< `SchemaEntity`, `RelationOfImplementation`[] \> \>

a record map of unions or interfaces relations.

#### Source

[packages/types/src/utils.d.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/utils.d.ts#L106)

---

### getRelationOfInterface()

```ts
getRelationOfInterface(type, schemaMap): Partial< Record< SchemaEntity, RelationOfInterface[] > >
```

Returns a map of interfaces where the GraphQL schema type is extended.

#### See

mapRelationOf

#### Parameters

| Parameter   | Type                     | Description                              |
| :---------- | :----------------------- | :--------------------------------------- |
| `type`      | `unknown`                | the GraphQL schema type being processed. |
| `schemaMap` | `Maybe`\< `SchemaMap` \> | a GraphQL schema map (see getSchemaMap). |

#### Returns

`Partial`\< `Record`\< `SchemaEntity`, `RelationOfInterface`[] \> \>

a record map of interfaces relations.

#### Source

[packages/types/src/utils.d.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/utils.d.ts#L106)

---

### getRelationOfReturn()

```ts
getRelationOfReturn(type, schemaMap): Partial< Record< SchemaEntity, GraphQLOperationType[] > >
```

Returns a map of operations (queries, mutations, subscriptions) where the GraphQL schema type is the return type.

#### See

mapRelationOf

#### Parameters

| Parameter   | Type                     | Description                              |
| :---------- | :----------------------- | :--------------------------------------- |
| `type`      | `unknown`                | the GraphQL schema type being processed. |
| `schemaMap` | `Maybe`\< `SchemaMap` \> | a GraphQL schema map (see getSchemaMap). |

#### Returns

`Partial`\< `Record`\< `SchemaEntity`, `GraphQLOperationType`[] \> \>

a record map of operations relations.

#### Source

[packages/types/src/utils.d.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/utils.d.ts#L106)

---

### getRelationOfUnion()

```ts
getRelationOfUnion(type, schemaMap): Partial< Record< SchemaEntity, GraphQLUnionType[] > >
```

Returns a map of unions where the GraphQL schema type is part of it.

#### See

mapRelationOf

#### Parameters

| Parameter   | Type                     | Description                              |
| :---------- | :----------------------- | :--------------------------------------- |
| `type`      | `unknown`                | the GraphQL schema type being processed. |
| `schemaMap` | `Maybe`\< `SchemaMap` \> | a GraphQL schema map (see getSchemaMap). |

#### Returns

`Partial`\< `Record`\< `SchemaEntity`, `GraphQLUnionType`[] \> \>

a record map of unions relations.

#### Source

[packages/types/src/utils.d.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/utils.d.ts#L106)
