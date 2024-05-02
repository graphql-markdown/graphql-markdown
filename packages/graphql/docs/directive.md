# directive

Library supporting `customDirective` for directive based customization.

## See

[Option `customDirective`](https://graphql-markdown.dev/docs/advanced/custom-directive)

## Variables

### WILDCARD\_DIRECTIVE

```ts
const WILDCARD_DIRECTIVE: "*";
```

Wildcard `*` character for matching any directive name.

See [getCustomDirectiveOptions](directive.md#getcustomdirectiveoptions), [isCustomDirective](directive.md#iscustomdirective)

#### Source

[packages/graphql/src/directive.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L30)

## Functions

### executableDirectiveLocation()

```ts
function executableDirectiveLocation(directive): boolean
```

Checks if a directive is executable (related to operations).

#### Parameters

• **directive**: `GraphQLDirective`

#### Returns

`boolean`

#### Source

[packages/graphql/src/directive.ts:285](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L285)

***

### getConstDirectiveMap()

```ts
function getConstDirectiveMap(entity, customDirectiveMap): Maybe<CustomDirectiveMap>
```

Returns a map of custom directives for a schema entity.

#### Parameters

• **entity**: `unknown`

a GraphQL schema entity.

• **customDirectiveMap**: `Maybe`\<`CustomDirectiveMap`\>

a custom directive map (see [getCustomDirectives](directive.md#getcustomdirectives)).

#### Returns

`Maybe`\<`CustomDirectiveMap`\>

a map of GraphQL directives matching the custom directives defined, else `undefined`.

#### Example

```js
import { buildSchema } from "graphql";
import { getConstDirectiveMap } from "@graphql-markdown/utils/directive";

const schema = buildSchema(`
    directive @testA(
      arg: ArgEnum = ARGA
    ) on OBJECT | FIELD_DEFINITION

    directive @testB(
      argA: Int!,
      argB: [String!]
    ) on FIELD_DEFINITION

    enum ArgEnum {
      ARGA
      ARGB
      ARGC
    }

    type Test @testA {
      id: ID!
      fieldA: [String!]
        @testA(arg: ARGC)
        @testB(argA: 10, argB: ["testArgB"])
    }

    type TestWithoutDirective {
      id: ID!
    }
  `);

const customDirectives = {
  testA: {
    type: schema.getDirective("testA"),
    descriptor: (_, constDirectiveType) => `${constDirectiveType.name}`;
  },
};

const map = getConstDirectiveMap(schema.getType("Test"), customDirectives);
// Expected result: {
//   "descriptor": (_, constDirectiveType) => `${constDirectiveType.name}`,
//   "type": schema.getDirective("testA"),
// }

```

#### Source

[packages/graphql/src/directive.ts:250](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L250)

***

### getCustomDirectiveOptions()

```ts
function getCustomDirectiveOptions(schemaDirectiveName, customDirectiveOptions): Maybe<CustomDirectiveOptions>
```

Returns a record set of custom handlers from a directive by name.

#### Parameters

• **schemaDirectiveName**: `DirectiveName`

the GraphQL directive name.

• **customDirectiveOptions**: `CustomDirective`

the `customDirective` option.

#### Returns

`Maybe`\<`CustomDirectiveOptions`\>

a record set of custom handlers for the matching directive (or if `*` is declared), or undefined if no match.

#### Example

```js
import { getCustomDirectiveOptions } from "@graphql-markdown/utils/directive";

const customDirectiveOptions = {
  "*": {
    descriptor: (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`;
  },
};

const customDirectives = getCustomDirectiveOptions("testB", customDirectiveOptions);

// Expected result: {
//   "descriptor": (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`,
//   "type": "@testB",
// }
```

#### Source

[packages/graphql/src/directive.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L78)

***

### getCustomDirectives()

```ts
function getCustomDirectives(schemaMap, customDirectiveOptions?): Maybe<CustomDirectiveMap>
```

Returns a custom directives map with custom handlers from `customDirective`.

#### Parameters

• **schemaMap**: `Pick`\<`SchemaMap`, `"directives"`\>

the GraphQL schema map returned by [introspection!getSchemaMap](introspection.md#getschemamap)

• **customDirectiveOptions?**: `Maybe`\<`CustomDirective`\>

the `customDirective` option.

#### Returns

`Maybe`\<`CustomDirectiveMap`\>

a custom directive map, or undefined if no match.

#### Example

```js
import { buildSchema } from "graphql";
import { getCustomDirectives } from "@graphql-markdown/utils/directive";

const schema = buildSchema(`
  directive @testA(
    arg: ArgEnum = ARGA
  ) on OBJECT | FIELD_DEFINITION
  directive @testB(
    argA: Int!,
    argB: [String!]
  ) on FIELD_DEFINITION
  enum ArgEnum {
    ARGA
    ARGB
    ARGC
  }
`);

const schemaMap = {
  directives: {
    testA: schema.getDirective("testA"),
    testB: schema.getDirective("testB"),
  },
};

const customDirectiveOptions = {
  testA: {
    descriptor: (_, constDirectiveType) => `Named directive ${constDirectiveType.name}`;
  },
  "*": {
    descriptor: (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`;
  },
};

const customDirectives = getCustomDirectives(schemaMap, customDirectiveOptions);

// Expected result: {
//   "testA": {
//     "descriptor": (_, constDirectiveType) => `Named directive ${constDirectiveType.name}`,
//     "type": "@testA",
//   },
//   "testB": {
//     "descriptor": (_, constDirectiveType) => `Wildcard ${constDirectiveType.name}`,
//     "type": "@testB",
//   },
// }
```

#### Source

[packages/graphql/src/directive.ts:152](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L152)

***

### isCustomDirective()

```ts
function isCustomDirective(schemaDirectiveName, customDirectiveOptions): boolean
```

Checks if a directive name is referenced in `customDirective` option.

#### Parameters

• **schemaDirectiveName**: `DirectiveName`

the GraphQL directive name.

• **customDirectiveOptions**: `CustomDirective`

the `customDirective` option.

#### Returns

`boolean`

`true` if the directive is declared or `*` is declared in `customDirective` option, else `false`.

#### Source

[packages/graphql/src/directive.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L41)

***

### typeSystemDirectiveLocation()

```ts
function typeSystemDirectiveLocation(directive): boolean
```

Checks if a directive is system (related to schema definition).

#### Parameters

• **directive**: `GraphQLDirective`

#### Returns

`boolean`

#### Source

[packages/graphql/src/directive.ts:308](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L308)
