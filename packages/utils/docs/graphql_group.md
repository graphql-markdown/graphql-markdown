# Module: graphql/group

Library supporting `groupByDirective` for grouping GraphQL schema entities.

## See

[Option `groupByDirective`](https://graphql-markdown.github.io/docs/advanced/group-by-directive)

## Functions

### getGroupName()

```ts
getGroupName(type, groupByDirective): Maybe< string >
```

Gets the group name for a schema type based on the directive information.

#### Example

```js
import { buildSchema } from "graphql";
import { getGroupName } from "@graphql-markdown/utils/groups";

const schema = buildSchema(`
  directive @doc(
    category: String
  ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
  type Unicorn {
    name: String!
  }
  type Bird @doc(category: "animal") {
    name: String!
  }
  type Fish {
    name: String!
  }
  type Elf @doc(category: "fantasy") {
    name: String!
  }
  type Query {
    Fish: [Fish!]! @doc(category: "animal")
  }
`);

const groupOptions = {
  fallback: "common",
  directive: "doc",
  field: "category",
};

getGroupName(schema.getType("Bird"), groupOptions); // Expected result: "animal"

getGroupName(schema.getType("Unicorn"), groupOptions); // Expected result: "common"
```

#### Parameters

| Parameter          | Type                                   | Description                    |
| :----------------- | :------------------------------------- | :----------------------------- |
| `type`             | `unknown`                              | a GraphQL schema named type    |
| `groupByDirective` | `Maybe`\< `GroupByDirectiveOptions` \> | the `groupByDirective` option. |

#### Returns

`Maybe`\< `string` \>

the group name matching the type, or `groupByDirective.fallback` if no match found.

#### Source

[packages/utils/src/graphql/group.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/group.ts#L158)

---

### getGroups()

```ts
getGroups(schemaMap, groupByDirective): Maybe< SchemaEntitiesGroupMap >
```

Parses a GraphQL schema to build a map of entities with matching `groupByDirective` option.

#### Example

```js
import { buildSchema } from "graphql";
import { getGroups } from "@graphql-markdown/utils/groups";

const schema = buildSchema(`
  directive @doc(
    category: String
  ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
  type Unicorn {
    name: String!
  }
  type Bird @doc(category: "animal") {
    name: String!
  }
  type Fish {
    name: String!
  }
  type Elf @doc(category: "fantasy") {
    name: String!
  }
  type Query {
    Fish: [Fish!]! @doc(category: "animal")
  }
`);

const schemaMap = {
  objects: schema.getTypeMap(),
  queries: schema.getQueryType()?.getFields(),
};

const groupOptions = {
  fallback: "common",
  directive: "doc",
  field: "category",
};

const groupsMap = getGroups(schemaMap, groupOptions);

// Expected result: {
//   "objects": {
//     "Bird": "animal",
//     "Boolean": "common",
//     "Elf": "fantasy",
//     "Fish": "common",
//     "Query": "common",
//     "String": "common",
//     "Unicorn": "common",
//   },
//   "queries": {
//     "Fish": "animal",
//   },
// }
```

#### Parameters

| Parameter          | Type                                   | Description                                     |
| :----------------- | :------------------------------------- | :---------------------------------------------- |
| `schemaMap`        | `SchemaMap`                            | the GraphQL schema map returned by getSchemaMap |
| `groupByDirective` | `Maybe`\< `GroupByDirectiveOptions` \> | the `groupByDirective` option.                  |

#### Returns

`Maybe`\< `SchemaEntitiesGroupMap` \>

a map of entities with matching group name.

#### Source

[packages/utils/src/graphql/group.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/graphql/group.ts#L84)
