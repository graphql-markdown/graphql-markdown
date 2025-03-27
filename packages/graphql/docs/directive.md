# directive

Library supporting `customDirective` for directive based customization.

## See

[Option `customDirective`](https://graphql-markdown.dev/docs/advanced/custom-directive)

## Variables

### WILDCARD\_DIRECTIVE

```ts
const WILDCARD_DIRECTIVE: "*";
```

Defined in: [packages/graphql/src/directive.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L29)

Wildcard `*` character for matching any directive name.

See [getCustomDirectiveOptions](#getcustomdirectiveoptions), [isCustomDirective](#iscustomdirective)

## Functions

### getConstDirectiveMap()

```ts
function getConstDirectiveMap(entity, customDirectiveMap): Maybe<CustomDirectiveMap>
```

Defined in: [packages/graphql/src/directive.ts:249](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L249)

Returns a map of custom directives for a schema entity.

#### Parameters

##### entity

`unknown`

a GraphQL schema entity.

##### customDirectiveMap

`Maybe`\<`CustomDirectiveMap`\>

a custom directive map (see [getCustomDirectives](#getcustomdirectives)).

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

***

### getCustomDirectiveOptions()

```ts
function getCustomDirectiveOptions(schemaDirectiveName, customDirectiveOptions): Maybe<Partial<Record<CustomDirectiveResolver, CustomDirectiveFunction>>>
```

Defined in: [packages/graphql/src/directive.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L77)

Returns a record set of custom handlers from a directive by name.

#### Parameters

##### schemaDirectiveName

`DirectiveName`

the GraphQL directive name.

##### customDirectiveOptions

`CustomDirective`

the `customDirective` option.

#### Returns

`Maybe`\<`Partial`\<`Record`\<`CustomDirectiveResolver`, `CustomDirectiveFunction`\>\>\>

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

***

### getCustomDirectives()

```ts
function getCustomDirectives(schemaMap, customDirectiveOptions?): Maybe<CustomDirectiveMap>
```

Defined in: [packages/graphql/src/directive.ts:151](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L151)

Returns a custom directives map with custom handlers from `customDirective`.

#### Parameters

##### schemaMap

`Pick`\<`SchemaMap`, `"directives"`\>

the GraphQL schema map returned by [introspection!getSchemaMap](introspection.md#getschemamap)

##### customDirectiveOptions?

`Maybe`\<`CustomDirective`\>

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

***

### isCustomDirective()

```ts
function isCustomDirective(schemaDirectiveName, customDirectiveOptions): boolean
```

Defined in: [packages/graphql/src/directive.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/directive.ts#L40)

Checks if a directive name is referenced in `customDirective` option.

#### Parameters

##### schemaDirectiveName

`DirectiveName`

the GraphQL directive name.

##### customDirectiveOptions

`CustomDirective`

the `customDirective` option.

#### Returns

`boolean`

`true` if the directive is declared or `*` is declared in `customDirective` option, else `false`.
