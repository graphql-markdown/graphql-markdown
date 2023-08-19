# Module: graphql/directive

Library supporting `customDirective` for directive based customization.

## See

[Option `customDirective`](https://graphql-markdown.github.io/docs/advanced/custom-directive)

## Variables

### WILDCARD\_DIRECTIVE

```ts
const WILDCARD_DIRECTIVE: ""
```

Wildcard `*` character for matching any directive name.

See [getCustomDirectiveOptions](graphql_directive.md#getcustomdirectiveoptions), [isCustomDirective](graphql_directive.md#iscustomdirective)

#### Defined In

[packages/utils/src/graphql/directive.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/directive.ts#L27)

## Functions

### getConstDirectiveMap

```ts
getConstDirectiveMap(entity, customDirectiveMap): Maybe< CustomDirectiveMap >
```

Returns a map of custom directives for a schema entity.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `unknown` | a GraphQL schema entity. |
| `customDirectiveMap` | `Maybe`\< `CustomDirectiveMap` \> | a custom directive map (see [getCustomDirectives](graphql_directive.md#getcustomdirectives)). |

#### Returns

`Maybe`\< `CustomDirectiveMap` \>

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

#### Defined In

[packages/utils/src/graphql/directive.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/directive.ts#L246)

***

### getCustomDirectiveOptions

```ts
getCustomDirectiveOptions(schemaDirectiveName, customDirectiveOptions): Maybe< CustomDirectiveOptions >
```

Returns a record set of custom handlers from a directive by name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schemaDirectiveName` | `DirectiveName` | the GraphQL directive name. |
| `customDirectiveOptions` | `CustomDirective` | the `customDirective` option. |

#### Returns

`Maybe`\< `CustomDirectiveOptions` \>

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

#### Defined In

[packages/utils/src/graphql/directive.ts:156](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/directive.ts#L156)

***

### getCustomDirectives

```ts
getCustomDirectives(schemaMap, customDirectiveOptions?): Maybe< CustomDirectiveMap >
```

Returns a custom directives map with custom handlers from `customDirective`.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schemaMap` | `Pick`\< `SchemaMap`, `"directives"` \> | the GraphQL schema map returned by [getSchemaMap](graphql_introspection.md#getschemamap) |
| `customDirectiveOptions`? | `CustomDirective` | the `customDirective` option. |

#### Returns

`Maybe`\< `CustomDirectiveMap` \>

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

#### Defined In

[packages/utils/src/graphql/directive.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/directive.ts#L88)

***

### isCustomDirective

```ts
isCustomDirective(schemaDirectiveName, customDirectiveOptions): boolean
```

Checks if a directive name is referenced in `customDirective` option.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schemaDirectiveName` | `DirectiveName` | the GraphQL directive name. |
| `customDirectiveOptions` | `CustomDirective` | the `customDirective` option. |

#### Returns

`boolean`

`true` if the directive is declared or `*` is declared in `customDirective` option, else `false`.

#### Defined In

[packages/utils/src/graphql/directive.ts:180](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/directive.ts#L180)
