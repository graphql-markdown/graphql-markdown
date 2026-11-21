# events/schema-events

Schema loading event constants.

## Variables

### SchemaEvents

```ts
const SchemaEvents: object;
```

Defined in: [packages/core/src/events/schema-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-events.ts#L10)

Event names for schema loading lifecycle.

#### Type Declaration

##### AFTER\_LOAD

```ts
readonly AFTER_LOAD: "schema:afterLoad" = "schema:afterLoad";
```

Emitted after loading GraphQL schema

##### AFTER\_MAP

```ts
readonly AFTER_MAP: "schema:afterMap" = "schema:afterMap";
```

Emitted after mapping GraphQL schema

##### BEFORE\_LOAD

```ts
readonly BEFORE_LOAD: "schema:beforeLoad" = "schema:beforeLoad";
```

Emitted before loading GraphQL schema

##### BEFORE\_MAP

```ts
readonly BEFORE_MAP: "schema:beforeMap" = "schema:beforeMap";
```

Emitted before mapping GraphQL schema
