# Module: introspection

Library for introspecting a GraphQL schema.
The entry point method is [getSchemaMap](introspection.md#getschemamap).

## Functions

### \_getFields

```ts
_getFields<T, V>(
  type,
  processor?,
  fallback?): GraphQLFieldMap< unknown, unknown > | GraphQLInputFieldMap | V
```

Returns the fields from a GraphQL schema type.

see [getOperation](introspection.md#getoperation), [getFields](introspection.md#getfields)

#### Type parameters

| Parameter |
| :------ |
| `T` |
| `V` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | the GraphQL schema type to parse. |
| `processor`? | (`fieldMap`) => `V` | optional callback function to parse the fields map. |
| `fallback`? | `V` | optional fallback value, `undefined` if not set. |

#### Returns

`GraphQLFieldMap`\< `unknown`, `unknown` \> \| `GraphQLInputFieldMap` \| `V`

a map of fields as k/v records, or `fallback` value if no fields available.

#### Source

[packages/graphql/src/introspection.ts:310](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L310)

***

### getDirective

```ts
getDirective(entity, directives): GraphQLDirective[]
```

Returns a schema entity's list of directives matching a defined set.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `unknown` | a GraphQL schema entity. |
| `directives` | `Maybe`\< `GraphQLDirective`[] \> | a directive name or a list of directive names. |

#### Returns

`GraphQLDirective`[]

a list of GraphQL directives matching the set, else `false`.

#### Source

[packages/graphql/src/introspection.ts:219](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L219)

***

### getDirectiveLocationForASTPath

```ts
getDirectiveLocationForASTPath(appliedTo): DirectiveLocation
```

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appliedTo` | `Maybe`\< `ASTNode` \> |

#### Returns

`DirectiveLocation`

#### Source

[packages/graphql/src/introspection.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L111)

***

### getFields

```ts
getFields(type): unknown[]
```

Returns fields map for a GraphQL schema type.

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type` | `unknown` | the GraphQL schema type to parse. |

#### Returns

`unknown`[]

a list of fields of type object.

#### Source

[packages/graphql/src/introspection.ts:375](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L375)

***

### getOperation

```ts
getOperation(operationType?): Record< string, GraphQLOperationType >
```

Returns fields map for a GraphQL operation type (query, mutation, subscription...).

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `operationType`? | `unknown` | the operation type to parse. |

#### Returns

`Record`\< `string`, `GraphQLOperationType` \>

a map of fields as k/v records.

#### Source

[packages/graphql/src/introspection.ts:351](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L351)

***

### getSchemaMap

```ts
getSchemaMap(schema): SchemaMap
```

Returns an introspection map of the GraphQL schema.
This is the entry point for GraphQL-Markdown schema parsing features.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schema` | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema. |

#### Returns

`SchemaMap`

a schema map by GraphQL entities (see SchemaEntity).

#### Source

[packages/graphql/src/introspection.ts:485](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L485)

#### Example

```js
import { buildSchema } from "graphql";
import { getSchemaMap } from "@graphql-markdown/utils/graphql";

const schema = buildSchema(`
  interface Record {
    id: String!
  }
  type StudyItem implements Record {
    id: String!
    subject: String!
    duration: Int!
  }
  type Query {
    getStudyItems(subject: String): [StudyItem!]
    getStudyItem(id: String!): StudyItem
  }
  type Mutation {
    addStudyItem(subject: String!, duration: Int!): StudyItem
  }
  type Subscription {
    listStudyItems: [StudyItem!]
  }
`);

const schemaTypeMap = getSchemaMap(schema);

// expected result: {
//   queries: {
//     getStudyItems: GraphQLField,
//     getStudyItem: GraphQLField,
//   },
//   mutations: {
//     addStudyItem: GraphQLField,
//   },
//   subscriptions: {
//     listStudyItems: GraphQLField,
//   }
//   directives: {
//     include: GraphQLDirective,
//     skip: GraphQLDirective,
//     deprecated: GraphQLDirective,
//     specifiedBy: GraphQLDirective,
//   objects: {
//     StudyItem: GraphQLObjectType,
//   unions: {},
//   interfaces: {
//     Record: GraphQLInterfaceType,
//   enums: {},
//   inputs: {},
//   scalars: {
//     String: GraphQLScalarType,
//     Int: GraphQLScalarType,
//     Boolean: GraphQLScalarType,
//   }
// }
```

***

### getTypeDirectiveArgValue

```ts
getTypeDirectiveArgValue(
  directive,
  node,
  argName): Maybe< Record< string, unknown > >
```

Returns one directive's argument's value linked to a GraphQL schema type.
It calls [getTypeDirectiveValues](introspection.md#gettypedirectivevalues) and returns a matching record.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema. |
| `node` | `unknown` | - |
| `argName` | `string` | the name of the GraphQL directive argument to fetch the value from. |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with `argName` as key and the argument's value.

#### Source

[packages/graphql/src/introspection.ts:282](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L282)

***

### getTypeDirectiveValues

```ts
getTypeDirectiveValues(directive, type): Maybe< Record< string, unknown > >
```

Returns all directive's arguments' values linked to a GraphQL schema type.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema. |
| `type` | `unknown` | the GraphQL schema type to parse. |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with arguments' name as keys and arguments' value.

#### Source

[packages/graphql/src/introspection.ts:251](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L251)

***

### getTypeFromSchema

```ts
getTypeFromSchema<T>(schema, type): Maybe< Record< string, T > >
```

Returns a map of GraphQL named types from a schema for a defined GraphQL type.
When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.

#### Type parameters

| Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schema` | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema. |
| `type` | `unknown` | a GraphQL type, eg `GraphQLObjectType`. |

#### Returns

`Maybe`\< `Record`\< `string`, `T` \> \>

a map of GraphQL named types for the matching GraphQL type, or undefined if no match.

#### Source

[packages/graphql/src/introspection.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L59)

#### See

[getSchemaMap](introspection.md#getschemamap)

***

### getTypeName

```ts
getTypeName(type, defaultName = ""): string
```

Resolves the name of a GraphQL schema type.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `unknown` | `undefined` | - |
| `defaultName` | `string` | `""` | optional fallback value if the name resolution fails. |

#### Returns

`string`

the type's name, or `defaultName`.

#### Source

[packages/graphql/src/introspection.ts:398](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L398)

***

### hasAstNode

```ts
hasAstNode<T>(node): node is AstNodeType<T>
```

Type guard for type with an AST node property.

#### Type parameters

| Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `node` | `T` | a GraphQL schema named type. |

#### Returns

`node is AstNodeType<T>`

`true` if the entity has an AST node property, else `false`.

#### Source

[packages/graphql/src/introspection.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L107)

***

### hasDirective

```ts
hasDirective(
  entity,
  directives,
  checkLocation = false): boolean
```

Checks if a schema entity as a directive belonging to a defined set.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `entity` | `unknown` | `undefined` | a GraphQL schema entity. |
| `directives` | `Maybe`\< `GraphQLDirective`[] \> | `undefined` | a directive name or a list of directive names. |
| `checkLocation` | `boolean` | `false` | optional flag to check if a directive can be applied to the entity location. |

#### Returns

`boolean`

`true` if the entity has at least one directive matching, else `false`.

#### Source

[packages/graphql/src/introspection.ts:181](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L181)

***

### isValidDirectiveLocation

```ts
isValidDirectiveLocation(entity, directive): boolean
```

Check if a directive can be applied to specific schema entity location.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `unknown` | a GraphQL schema entity. |
| `directive` | `GraphQLDirective` | a directive name. |

#### Returns

`boolean`

`true` if the entity is a valid directive location, else `false`.

#### Source

[packages/graphql/src/introspection.ts:160](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L160)
