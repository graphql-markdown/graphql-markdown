# group

Utility module for handling GraphQL schema entity grouping.

## Functions

### getGroup()

```ts
function getGroup(
   type, 
   groups, 
   typeCategory): string;
```

Defined in: [group.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/group.ts#L24)

Retrieves the group name for a given GraphQL type based on its category and group mapping.

#### Parameters

##### type

`unknown`

The GraphQL type to get the group for

##### groups

`Maybe`\<`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>\>

Mapping of schema entities to their group names

##### typeCategory

`Maybe`\<`SchemaEntity`\>

The category of the schema entity

#### Returns

`string`

The slugified group name or empty string if no group is found
