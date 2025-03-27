# introspection

Library for introspecting a GraphQL schema.
The entry point method is [getSchemaMap](#getschemamap).

## Classes

### IntrospectionError

Defined in: [packages/graphql/src/introspection.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L49)

#### Example

```ts

```

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new IntrospectionError(message?): IntrospectionError
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1082

###### Parameters

###### message?

`string`

###### Returns

[`IntrospectionError`](#introspectionerror)

###### Inherited from

```ts
Error.constructor
```

##### Constructor

```ts
new IntrospectionError(message?, options?): IntrospectionError
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1082

###### Parameters

###### message?

`string`

###### options?

`ErrorOptions`

###### Returns

[`IntrospectionError`](#introspectionerror)

###### Inherited from

```ts
Error.constructor
```

## Functions

### \_getFields()

```ts
function _getFields<T, V>(
   type, 
   processor?, 
   fallback?): 
  | GraphQLFieldMap<unknown, unknown>
  | GraphQLInputFieldMap
  | V
| GraphQLObjectType<any, any>
```

Defined in: [packages/graphql/src/introspection.ts:324](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L324)

**`Internal`**

Returns the fields from a GraphQL schema type.

see [getOperation](#getoperation), [getFields](#getfields)

#### Type Parameters

##### T

`T`

##### V

`V`

#### Parameters

##### type

`T`

the GraphQL schema type to parse.

##### processor?

(`fieldMap`) => `V`

optional callback function to parse the fields map.

##### fallback?

`V`

optional fallback value, `undefined` if not set.

#### Returns

  \| `GraphQLFieldMap`\<`unknown`, `unknown`\>
  \| `GraphQLInputFieldMap`
  \| `V`
  \| `GraphQLObjectType`\<`any`, `any`\>

a map of fields as k/v records, or `fallback` value if no fields available.

***

### getDirective()

```ts
function getDirective(entity, directives): GraphQLDirective[]
```

Defined in: [packages/graphql/src/introspection.ts:233](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L233)

Returns a schema entity's list of directives matching a defined set.

#### Parameters

##### entity

`unknown`

a GraphQL schema entity.

##### directives

`Maybe`\<`GraphQLDirective`[]\>

a directive name or a list of directive names.

#### Returns

`GraphQLDirective`[]

a list of GraphQL directives matching the set, else `false`.

***

### getDirectiveLocationForASTPath()

```ts
function getDirectiveLocationForASTPath(appliedTo): DirectiveLocation
```

Defined in: [packages/graphql/src/introspection.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L120)

#### Parameters

##### appliedTo

`Maybe`\<`ASTNode`\>

#### Returns

`DirectiveLocation`

***

### getFields()

```ts
function getFields(type): unknown[]
```

Defined in: [packages/graphql/src/introspection.ts:393](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L393)

Returns fields map for a GraphQL schema type.

see [getSchemaMap](#getschemamap)

#### Parameters

##### type

`unknown`

the GraphQL schema type to parse.

#### Returns

`unknown`[]

a list of fields of type object.

***

### getOperation()

```ts
function getOperation(operationType?): Record<string, GraphQLOperationType>
```

Defined in: [packages/graphql/src/introspection.ts:369](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L369)

**`Internal`**

Returns fields map for a GraphQL operation type (query, mutation, subscription...).

see [getSchemaMap](#getschemamap)

#### Parameters

##### operationType?

`unknown`

the operation type to parse.

#### Returns

`Record`\<`string`, `GraphQLOperationType`\>

a map of fields as k/v records.

***

### getSchemaMap()

```ts
function getSchemaMap(schema): SchemaMap
```

Defined in: [packages/graphql/src/introspection.ts:503](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L503)

Returns an introspection map of the GraphQL schema.
This is the entry point for GraphQL-Markdown schema parsing features.

#### Parameters

##### schema

`Maybe`\<`GraphQLSchema`\>

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

***

### getTypeDirectiveArgValue()

```ts
function getTypeDirectiveArgValue(
   directive, 
   node, 
argName): Maybe<string | Record<string, unknown>>
```

Defined in: [packages/graphql/src/introspection.ts:296](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L296)

Returns one directive's argument's value linked to a GraphQL schema type.
It calls [getTypeDirectiveValues](#gettypedirectivevalues) and returns a matching record.

#### Parameters

##### directive

`GraphQLDirective`

a GraphQL directive defined in the schema.

##### node

`unknown`

##### argName

`string`

the name of the GraphQL directive argument to fetch the value from.

#### Returns

`Maybe`\<`string` \| `Record`\<`string`, `unknown`\>\>

a record k/v with `argName` as key and the argument's value.

***

### getTypeDirectiveValues()

```ts
function getTypeDirectiveValues(directive, type): Maybe<Record<string, unknown>>
```

Defined in: [packages/graphql/src/introspection.ts:265](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L265)

Returns all directive's arguments' values linked to a GraphQL schema type.

#### Parameters

##### directive

`GraphQLDirective`

a GraphQL directive defined in the schema.

##### type

`unknown`

the GraphQL schema type to parse.

#### Returns

`Maybe`\<`Record`\<`string`, `unknown`\>\>

a record k/v with arguments' name as keys and arguments' value.

***

### getTypeFromSchema()

```ts
function getTypeFromSchema<T>(schema, type): Maybe<Record<string, T>>
```

Defined in: [packages/graphql/src/introspection.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L65)

**`Internal`**

Returns a map of GraphQL named types from a schema for a defined GraphQL type.
When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.

#### Type Parameters

##### T

`T`

#### Parameters

##### schema

`Maybe`\<`GraphQLSchema`\>

a GraphQL schema.

##### type

`unknown`

a GraphQL type, eg `GraphQLObjectType`.

#### Returns

`Maybe`\<`Record`\<`string`, `T`\>\>

a map of GraphQL named types for the matching GraphQL type, or undefined if no match.

#### See

[getSchemaMap](#getschemamap)

***

### getTypeName()

```ts
function getTypeName(type, defaultName): string
```

Defined in: [packages/graphql/src/introspection.ts:416](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L416)

Resolves the name of a GraphQL schema type.

#### Parameters

##### type

`unknown`

##### defaultName

`string` = `""`

optional fallback value if the name resolution fails.

#### Returns

`string`

the type's name, or `defaultName`.

***

### hasAstNode()

```ts
function hasAstNode<T>(node): node is AstNodeType<T>
```

Defined in: [packages/graphql/src/introspection.ts:113](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L113)

**`Internal`**

Type guard for type with an AST node property.

#### Type Parameters

##### T

`T`

#### Parameters

##### node

`T`

a GraphQL schema named type.

#### Returns

`node is AstNodeType<T>`

`true` if the entity has an AST node property, else `false`.

***

### hasDirective()

```ts
function hasDirective(
   entity, 
   directives, 
   fallback): boolean
```

Defined in: [packages/graphql/src/introspection.ts:195](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L195)

Checks if a schema entity as a directive belonging to a defined set.

#### Parameters

##### entity

`unknown`

a GraphQL schema entity.

##### directives

`Maybe`\<`GraphQLDirective`[]\>

a directive name or a list of directive names.

##### fallback

`boolean` = `false`

default value if the entity type is not a valid location for directives.

#### Returns

`boolean`

`true` if the entity has at least one directive matching, else `false`.

***

### isValidDirectiveLocation()

```ts
function isValidDirectiveLocation(entity, directive): boolean
```

Defined in: [packages/graphql/src/introspection.ts:174](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L174)

Check if a directive can be applied to specific schema entity location.

#### Parameters

##### entity

`unknown`

a GraphQL schema entity.

##### directive

`GraphQLDirective`

a directive name.

#### Returns

`boolean`

`true` if the entity is a valid directive location, else `false`.
