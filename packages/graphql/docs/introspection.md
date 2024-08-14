# introspection

Library for introspecting a GraphQL schema.
The entry point method is [getSchemaMap](introspection.md#getschemamap).

## Classes

### IntrospectionError

#### Extends

- `Error`

#### Constructors

##### new IntrospectionError()

```ts
new IntrospectionError(message?): IntrospectionError
```

###### Parameters

• **message?**: `string`

###### Returns

[`IntrospectionError`](introspection.md#introspectionerror)

###### Inherited from

`Error.constructor`

###### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

##### new IntrospectionError()

```ts
new IntrospectionError(message?, options?): IntrospectionError
```

###### Parameters

• **message?**: `string`

• **options?**: `ErrorOptions`

###### Returns

[`IntrospectionError`](introspection.md#introspectionerror)

###### Inherited from

`Error.constructor`

###### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

## Functions

### \_getFields()

```ts
function _getFields<T, V>(
   type, 
   processor?, 
fallback?): GraphQLFieldMap<unknown, unknown> | GraphQLInputFieldMap | V | GraphQLObjectType<any, any>
```

Returns the fields from a GraphQL schema type.

see [getOperation](introspection.md#getoperation), [getFields](introspection.md#getfields)

#### Type Parameters

• **T**

• **V**

#### Parameters

• **type**: `T`

the GraphQL schema type to parse.

• **processor?**

optional callback function to parse the fields map.

• **fallback?**: `V`

optional fallback value, `undefined` if not set.

#### Returns

`GraphQLFieldMap`\<`unknown`, `unknown`\> \| `GraphQLInputFieldMap` \| `V` \| `GraphQLObjectType`\<`any`, `any`\>

a map of fields as k/v records, or `fallback` value if no fields available.

#### Defined in

[packages/graphql/src/introspection.ts:317](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L317)

***

### getDirective()

```ts
function getDirective(entity, directives): GraphQLDirective[]
```

Returns a schema entity's list of directives matching a defined set.

#### Parameters

• **entity**: `unknown`

a GraphQL schema entity.

• **directives**: `Maybe`\<`GraphQLDirective`[]\>

a directive name or a list of directive names.

#### Returns

`GraphQLDirective`[]

a list of GraphQL directives matching the set, else `false`.

#### Defined in

[packages/graphql/src/introspection.ts:226](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L226)

***

### getDirectiveLocationForASTPath()

```ts
function getDirectiveLocationForASTPath(appliedTo): DirectiveLocation
```

#### Parameters

• **appliedTo**: `any`

#### Returns

`DirectiveLocation`

#### Defined in

[packages/graphql/src/introspection.ts:113](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L113)

***

### getFields()

```ts
function getFields(type): unknown[]
```

Returns fields map for a GraphQL schema type.

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

• **type**: `unknown`

the GraphQL schema type to parse.

#### Returns

`unknown`[]

a list of fields of type object.

#### Defined in

[packages/graphql/src/introspection.ts:386](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L386)

***

### getOperation()

```ts
function getOperation(operationType?): Record<string, GraphQLOperationType>
```

Returns fields map for a GraphQL operation type (query, mutation, subscription...).

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

• **operationType?**: `unknown`

the operation type to parse.

#### Returns

`Record`\<`string`, `GraphQLOperationType`\>

a map of fields as k/v records.

#### Defined in

[packages/graphql/src/introspection.ts:362](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L362)

***

### getSchemaMap()

```ts
function getSchemaMap(schema): SchemaMap
```

Returns an introspection map of the GraphQL schema.
This is the entry point for GraphQL-Markdown schema parsing features.

#### Parameters

• **schema**: `Maybe`\<`GraphQLSchema`\>

a GraphQL schema.

#### Returns

`SchemaMap`

a schema map by GraphQL entities (see SchemaEntity).

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

#### Defined in

[packages/graphql/src/introspection.ts:496](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L496)

***

### getTypeDirectiveArgValue()

```ts
function getTypeDirectiveArgValue(
   directive, 
   node, 
argName): Maybe<string | Record<string, unknown>>
```

Returns one directive's argument's value linked to a GraphQL schema type.
It calls [getTypeDirectiveValues](introspection.md#gettypedirectivevalues) and returns a matching record.

#### Parameters

• **directive**: `GraphQLDirective`

a GraphQL directive defined in the schema.

• **node**: `unknown`

• **argName**: `string`

the name of the GraphQL directive argument to fetch the value from.

#### Returns

`Maybe`\<`string` \| `Record`\<`string`, `unknown`\>\>

a record k/v with `argName` as key and the argument's value.

#### Defined in

[packages/graphql/src/introspection.ts:289](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L289)

***

### getTypeDirectiveValues()

```ts
function getTypeDirectiveValues(directive, type): Maybe<Record<string, unknown>>
```

Returns all directive's arguments' values linked to a GraphQL schema type.

#### Parameters

• **directive**: `GraphQLDirective`

a GraphQL directive defined in the schema.

• **type**: `unknown`

the GraphQL schema type to parse.

#### Returns

`Maybe`\<`Record`\<`string`, `unknown`\>\>

a record k/v with arguments' name as keys and arguments' value.

#### Defined in

[packages/graphql/src/introspection.ts:258](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L258)

***

### getTypeFromSchema()

```ts
function getTypeFromSchema<T>(schema, type): Maybe<Record<string, T>>
```

Returns a map of GraphQL named types from a schema for a defined GraphQL type.
When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.

#### Type Parameters

• **T**

#### Parameters

• **schema**: `Maybe`\<`GraphQLSchema`\>

a GraphQL schema.

• **type**: `unknown`

a GraphQL type, eg `GraphQLObjectType`.

#### Returns

`Maybe`\<`Record`\<`string`, `T`\>\>

a map of GraphQL named types for the matching GraphQL type, or undefined if no match.

#### See

[getSchemaMap](introspection.md#getschemamap)

#### Defined in

[packages/graphql/src/introspection.ts:61](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L61)

***

### getTypeName()

```ts
function getTypeName(type, defaultName): string
```

Resolves the name of a GraphQL schema type.

#### Parameters

• **type**: `unknown`

• **defaultName**: `string` = `""`

optional fallback value if the name resolution fails.

#### Returns

`string`

the type's name, or `defaultName`.

#### Defined in

[packages/graphql/src/introspection.ts:409](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L409)

***

### hasAstNode()

```ts
function hasAstNode<T>(node): node is AstNodeType<T>
```

Type guard for type with an AST node property.

#### Type Parameters

• **T**

#### Parameters

• **node**: `T`

a GraphQL schema named type.

#### Returns

`node is AstNodeType<T>`

`true` if the entity has an AST node property, else `false`.

#### Defined in

[packages/graphql/src/introspection.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L109)

***

### hasDirective()

```ts
function hasDirective(
   entity, 
   directives, 
   fallback): boolean
```

Checks if a schema entity as a directive belonging to a defined set.

#### Parameters

• **entity**: `unknown`

a GraphQL schema entity.

• **directives**: `Maybe`\<`GraphQLDirective`[]\>

a directive name or a list of directive names.

• **fallback**: `boolean` = `false`

default value if the entity type is not a valid location for directives.

#### Returns

`boolean`

`true` if the entity has at least one directive matching, else `false`.

#### Defined in

[packages/graphql/src/introspection.ts:188](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L188)

***

### isValidDirectiveLocation()

```ts
function isValidDirectiveLocation(entity, directive): boolean
```

Check if a directive can be applied to specific schema entity location.

#### Parameters

• **entity**: `unknown`

a GraphQL schema entity.

• **directive**: `GraphQLDirective`

a directive name.

#### Returns

`boolean`

`true` if the entity is a valid directive location, else `false`.

#### Defined in

[packages/graphql/src/introspection.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L167)
