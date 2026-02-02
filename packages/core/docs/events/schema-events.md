# events/schema-events

Schema loading event constants.

## Variables

### SchemaEvents

```ts
const SchemaEvents: object;
```

Defined in: [events/schema-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-events.ts#L10)

Event names for schema loading lifecycle.

#### Type Declaration

##### AFTER_LOAD

```ts
readonly AFTER_LOAD: "schema:afterLoad" = "schema:afterLoad";
```

Emitted after loading GraphQL schema

##### AFTER_MAP

```ts
readonly AFTER_MAP: "schema:afterMap" = "schema:afterMap";
```

Emitted after mapping GraphQL schema

##### BEFORE_LOAD

```ts
readonly BEFORE_LOAD: "schema:beforeLoad" = "schema:beforeLoad";
```

Emitted before loading GraphQL schema

##### BEFORE_MAP

```ts
readonly BEFORE_MAP: "schema:beforeMap" = "schema:beforeMap";
```

Emitted before mapping GraphQL schema
