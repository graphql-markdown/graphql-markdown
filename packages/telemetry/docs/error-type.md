# error-type

## Variables

### ERROR\_TYPES

```ts
const ERROR_TYPES: readonly [
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "ReferenceError",
  "GraphQLError",
  "AggregateError",
  "AbortError",
  "SystemError",
];
```

Defined in: [error-type.ts:2](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/error-type.ts#L2)

Error class names that may be reported as-is.

---

### NO\_SCHEMA\_ERROR

```ts
const NO_SCHEMA_ERROR: "<no-schema>" = "<no-schema>";
```

Defined in: [error-type.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/error-type.ts#L15)

Reported when no schema could be loaded.

---

### POST\_ERROR\_PREFIX

```ts
const POST_ERROR_PREFIX: "post:" = "post:";
```

Defined in: [error-type.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/error-type.ts#L18)

Prefix for failures happening after generation (post-generation hooks).

## Functions

### errorTypeOf()

```ts
function errorTypeOf(error): string;
```

Defined in: [error-type.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/error-type.ts#L29)

Maps any thrown value to an anonymous error type: an allowlisted class
name (optionally suffixed with a system code), or `<custom-error>`.
Never throws.

#### Parameters

##### error

`unknown`

#### Returns

`string`
