# relation

Library supporting `relatedTypeSection` for displaying relations between GraphQL schema entities.

## See

[Option `relatedTypeSection`](https://graphql-markdown.dev/docs/settings#printtypeoptions)

## Variables

### getRelationOfField

```ts
const getRelationOfField: IGetRelation<RelationOfField>;
```

Defined in: [packages/graphql/src/relation.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/relation.ts#L167)

Returns a map of fields and arguments where the GraphQL schema type matches the type.

#### See

mapRelationOf

#### Type Param

the type of the GraphQL schema type.

#### Type Param

the return type of map of relations (see IGetRelation).

#### Param

the GraphQL schema type being processed.

#### Param

a GraphQL schema map (see getSchemaMap).

#### Returns

a record map of fields and arguments relations.

***

### getRelationOfImplementation

```ts
const getRelationOfImplementation: IGetRelation<RelationOfImplementation>;
```

Defined in: [packages/graphql/src/relation.ts:353](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/relation.ts#L353)

Returns a map of types (unions or interfaces) where the GraphQL schema type is implemented.

#### See

mapRelationOf

#### Type Param

the type of the GraphQL schema type.

#### Type Param

the return type of map of relations (see IGetRelation).

#### Param

the GraphQL schema type being processed.

#### Param

a GraphQL schema map (see getSchemaMap).

#### Returns

a record map of unions or interfaces relations.

***

### getRelationOfInterface

```ts
const getRelationOfInterface: IGetRelation<RelationOfInterface>;
```

Defined in: [packages/graphql/src/relation.ts:296](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/relation.ts#L296)

Returns a map of interfaces where the GraphQL schema type is extended.

#### See

mapRelationOf

#### Type Param

the type of the GraphQL schema type.

#### Type Param

the return type of map of relations (see IGetRelation).

#### Param

the GraphQL schema type being processed.

#### Param

a GraphQL schema map (see getSchemaMap).

#### Returns

a record map of interfaces relations.

***

### getRelationOfReturn

```ts
const getRelationOfReturn: IGetRelation<GraphQLOperationType>;
```

Defined in: [packages/graphql/src/relation.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/relation.ts#L106)

Returns a map of operations (queries, mutations, subscriptions) where the GraphQL schema type is the return type.

#### See

mapRelationOf

#### Type Param

the type of the GraphQL schema type.

#### Type Param

the return type of map of relations (see IGetRelation).

#### Param

the GraphQL schema type being processed.

#### Param

a GraphQL schema map (see getSchemaMap).

#### Returns

a record map of operations relations.

***

### getRelationOfUnion

```ts
const getRelationOfUnion: IGetRelation<GraphQLUnionType>;
```

Defined in: [packages/graphql/src/relation.ts:240](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/relation.ts#L240)

Returns a map of unions where the GraphQL schema type is part of it.

#### See

mapRelationOf

#### Type Param

the type of the GraphQL schema type.

#### Type Param

the return type of map of relations (see IGetRelation).

#### Param

the GraphQL schema type being processed.

#### Param

a GraphQL schema map (see getSchemaMap).

#### Returns

a record map of unions relations.
