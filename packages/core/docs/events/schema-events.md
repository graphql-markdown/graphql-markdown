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

##### BEFORE_LOAD

```ts
readonly BEFORE_LOAD: "schema:beforeLoad" = "schema:beforeLoad";
```

Emitted before loading GraphQL schema
