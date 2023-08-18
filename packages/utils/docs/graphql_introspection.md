# Module: graphql/introspection

## Functions

### \_\_getFields()

```ts
__getFields<T, V>(
  type,
  processor?,
  fallback?): GraphQLFieldMap< unknown, unknown > | GraphQLInputFieldMap | V
```

Returns the fields from a GraphQL schema type.

see [getOperation](graphql_introspection.md#getoperation), [getFields](graphql_introspection.md#getfields)

#### Type parameters

| Parameter |
| :-------- |
| `T`       |
| `V`       |

#### Parameters

| Parameter    | Type                | Description                                         |
| :----------- | :------------------ | :-------------------------------------------------- |
| `type`       | `T`                 | the GraphQL schema type to parse.                   |
| `processor`? | (`fieldMap`) => `V` | optional callback function to parse the fields map. |
| `fallback`?  | `V`                 | optional fallback value, `undefined` if not set.    |

#### Returns

`GraphQLFieldMap`\< `unknown`, `unknown` \> \| `GraphQLInputFieldMap` \| `V`

a map of fields as k/v records, or `fallback` value if no fields available.

#### Source

[packages/utils/src/graphql/introspection.ts:235](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L235)

---

### getDirective()

```ts
getDirective(entity, directives): GraphQLDirective[]
```

Returns a schema entity's list of directives matching a defined set.

#### Parameters

| Parameter    | Type                                | Description                                    |
| :----------- | :---------------------------------- | :--------------------------------------------- |
| `entity`     | `unknown`                           | a GraphQL schema entity.                       |
| `directives` | `Maybe`\< `string` \| `string`[] \> | a directive name or a list of directive names. |

#### Returns

`GraphQLDirective`[]

a list of GraphQL directives matching the set, else `false`.

#### Source

[packages/utils/src/graphql/introspection.ts:137](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L137)

---

### getFields()

```ts
getFields(type): unknown[]
```

Returns fields map for a GraphQL schema type.

see [getSchemaMap](graphql_introspection.md#getschemamap)

#### Parameters

| Parameter | Type      | Description                       |
| :-------- | :-------- | :-------------------------------- |
| `type`    | `unknown` | the GraphQL schema type to parse. |

#### Returns

`unknown`[]

a list of fields of type object.

#### Source

[packages/utils/src/graphql/introspection.ts:296](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L296)

---

### getOperation()

```ts
getOperation(operationType?): Record< string, GraphQLOperationType >
```

Returns fields map for a GraphQL operation type (query, mutation, subscription...).

see [getSchemaMap](graphql_introspection.md#getschemamap)

#### Parameters

| Parameter        | Type      | Description                  |
| :--------------- | :-------- | :--------------------------- |
| `operationType`? | `unknown` | the operation type to parse. |

#### Returns

`Record`\< `string`, `GraphQLOperationType` \>

a map of fields as k/v records.

#### Source

[packages/utils/src/graphql/introspection.ts:272](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L272)

---

### getSchemaMap()

```ts
getSchemaMap(schema): SchemaMap
```

Returns an introspection map of the GraphQL schema.
This is the entry point for GraphQL-Markdown schema parsing features.

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
     queries: {
       getStudyItems: GraphQLField,
       getStudyItem: GraphQLField,
     },
     mutations: {
       addStudyItem: GraphQLField,
     },
     subscriptions: {
       listStudyItems: GraphQLField,
     }
     directives: {
       include: GraphQLDirective,
       skip: GraphQLDirective,
       deprecated: GraphQLDirective,
       specifiedBy: GraphQLDirective,
     objects: {
       StudyItem: GraphQLObjectType,
     unions: {},
     interfaces: {
       Record: GraphQLInterfaceType,
     enums: {},
     inputs: {},
     scalars: {
       String: GraphQLScalarType,
       Int: GraphQLScalarType,
       Boolean: GraphQLScalarType,
     }
   }
```

#### Parameters

| Parameter | Type                         | Description       |
| :-------- | :--------------------------- | :---------------- |
| `schema`  | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema. |

#### Returns

`SchemaMap`

a schema map by GraphQL entities (see SchemaEntity).

#### Source

[packages/utils/src/graphql/introspection.ts:401](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L401)

---

### getTypeDirectiveArgValue()

```ts
getTypeDirectiveArgValue(
  directive,
  node,
  argName): Maybe< Record< string, unknown > >
```

Returns one directive's argument's value linked to a GraphQL schema type.
It calls [getTypeDirectiveValues](graphql_introspection.md#gettypedirectivevalues) and returns a matching record.

#### Parameters

| Parameter   | Type               | Description                                                         |
| :---------- | :----------------- | :------------------------------------------------------------------ |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema.                          |
| `node`      | `unknown`          | -                                                                   |
| `argName`   | `string`           | the name of the GraphQL directive argument to fetch the value from. |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with `argName` as key and the argument's value.

#### Source

[packages/utils/src/graphql/introspection.ts:178](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L178)

---

### getTypeDirectiveValues()

```ts
getTypeDirectiveValues(directive, type): Maybe< Record< string, unknown > >
```

Returns all directive's arguments' values linked to a GraphQL schema type.

#### Parameters

| Parameter   | Type               | Description                                |
| :---------- | :----------------- | :----------------------------------------- |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema. |
| `type`      | `unknown`          | the GraphQL schema type to parse.          |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with arguments' name as keys and arguments' value.

#### Source

[packages/utils/src/graphql/introspection.ts:201](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L201)

---

### getTypeFromSchema()

```ts
getTypeFromSchema<T>(schema, type): Maybe< Record< string, T > >
```

Returns a map of GraphQL named types from a schema for a defined GraphQL type.
When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.

#### See

[getSchemaMap](graphql_introspection.md#getschemamap)

#### Type parameters

| Parameter |
| :-------- |
| `T`       |

#### Parameters

| Parameter | Type                         | Description                             |
| :-------- | :--------------------------- | :-------------------------------------- |
| `schema`  | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema.                       |
| `type`    | `unknown`                    | a GraphQL type, eg `GraphQLObjectType`. |

#### Returns

`Maybe`\< `Record`\< `string`, `T` \> \>

a map of GraphQL named types for the matching GraphQL type, or undefined if no match.

#### Source

[packages/utils/src/graphql/introspection.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L50)

---

### getTypeName()

```ts
getTypeName(type, defaultName = ""): string
```

Resolves the name of a GraphQL schema type.

#### Parameters

| Parameter     | Type      | Default value | Description                                           |
| :------------ | :-------- | :------------ | :---------------------------------------------------- |
| `type`        | `unknown` | `undefined`   | -                                                     |
| `defaultName` | `string`  | `""`          | optional fallback value if the name resolution fails. |

#### Returns

`string`

the type's name, or `defaultName`.

#### Source

[packages/utils/src/graphql/introspection.ts:317](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L317)

---

### hasAstNode()

```ts
hasAstNode<T>(node): node is Required<Object> & T
```

Type guard for type with an AST node property.

#### Type parameters

| Parameter |
| :-------- |
| `T`       |

#### Parameters

| Parameter | Type | Description                  |
| :-------- | :--- | :--------------------------- |
| `node`    | `T`  | a GraphQL schema named type. |

#### Returns

`node is Required<Object> & T`

`true` if the entity has an AST node property, else `false`.

#### Source

[packages/utils/src/graphql/introspection.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L92)

---

### hasDirective()

```ts
hasDirective(entity, directives): boolean
```

Checks if a schema entity as a directive belonging to a defined set.

#### Parameters

| Parameter    | Type                                | Description                                    |
| :----------- | :---------------------------------- | :--------------------------------------------- |
| `entity`     | `unknown`                           | a GraphQL schema entity.                       |
| `directives` | `Maybe`\< `string` \| `string`[] \> | a directive name or a list of directive names. |

#### Returns

`boolean`

`true` if the entity has at least one directive matching, else `false`.

#### Source

[packages/utils/src/graphql/introspection.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/introspection.ts#L107)
