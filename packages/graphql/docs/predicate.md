# predicate

Predicate and resolver helpers for `decorators`.

A decorator (see `@graphql-markdown/types`'s `DecoratorDefinition`) is
selected by a predicate over the node being printed, rather than by a fixed
directive name. This module provides the common building blocks: matching a
directive, matching an entity kind, composing predicates, and reading a
directive's occurrences as decorator values.

## Functions

### always()

```ts
function always(): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:191](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L191)

A predicate that always matches, regardless of the node being printed.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate that is always `true`.

---

### and()

```ts
function and(...predicates): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L145)

Combines predicates with logical AND. An empty list is vacuously `true`.

#### Parameters

##### predicates

...`DecoratorPredicate`[]

the predicates to combine.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when every one of `predicates` is true.

---

### directiveOccurrence()

```ts
function directiveOccurrence(name): DecoratorResolver;
```

Defined in: [packages/graphql/src/predicate.ts:277](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L277)

Builds a resolver reading a single, non-repeatable directive's argument
values off the node being printed (see [getTypeDirectiveValues](introspection.md#gettypedirectivevalues),
which this delegates to). Use [directiveOccurrences](#directiveoccurrences) instead for a
`repeatable` directive, where more than one occurrence can carry values.

#### Parameters

##### name

`string`

the schema directive name to read.

#### Returns

`DecoratorResolver`

a DecoratorResolver resolving that directive's single
occurrence as a one-record array, or an empty array when the schema, the
directive, or that occurrence is absent.

---

### directiveOccurrences()

```ts
function directiveOccurrences(name): DecoratorResolver;
```

Defined in: [packages/graphql/src/predicate.ts:260](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L260)

Builds a resolver reading every occurrence of a directive off the node being
printed, as one record of arguments per occurrence (see
[getTypeDirectiveValuesList](introspection.md#gettypedirectivevalueslist), which this delegates to and which also
covers repeatable directives).

#### Parameters

##### name

`string`

the schema directive name to read.

#### Returns

`DecoratorResolver`

a DecoratorResolver resolving that directive's occurrences,
or an empty array when the schema or the directive is absent.

---

### getDirectiveFromSchema()

```ts
function getDirectiveFromSchema(name, options): Maybe<GraphQLDirective>;
```

Defined in: [packages/graphql/src/predicate.ts:214](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L214)

Resolves a schema directive definition by name.

Shared by [directiveOccurrences](#directiveoccurrences) (which reads a directive's argument
values off a node) and `@graphql-markdown/printer-legacy`'s decorator
resolution (which also needs the directive definition itself, for a
decorator's render context) — both need "look up this named directive on
`options.schema`, safely", so it lives here once rather than being
reimplemented at each call site.

#### Parameters

##### name

`string`

the schema directive name to resolve.

##### options

`PrintTypeOptions`

the print options in effect; `options.schema` is read.

#### Returns

`Maybe`&lt;`GraphQLDirective`&gt;

the directive definition, or `undefined` when `options.schema` is
absent, not a `GraphQLSchema`, or does not declare a directive named `name`.

---

### getSchemaEntity()

```ts
function getSchemaEntity(type, options): Maybe<SchemaEntity>;
```

Defined in: [packages/graphql/src/predicate.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L52)

Resolves the schema entity kind of the type being printed.

The kind is taken from the print options when the caller knows it, as only
the caller can tell a query from a mutation. It falls back to the type guards
otherwise, which cover every kind but the operations.

#### Parameters

##### type

`unknown`

the GraphQL type being printed.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

`Maybe`&lt;`SchemaEntity`&gt;

the schema entity kind, or `undefined` when it cannot be determined.

---

### hasAnyDirective()

```ts
function hasAnyDirective(): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:115](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L115)

Builds a predicate matching a node carrying any directive at all.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when the node carries at least one directive.

---

### hasDirectiveNamed()

```ts
function hasDirectiveNamed(name): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L97)

Builds a predicate matching a node carrying a specific directive.

#### Parameters

##### name

`string`

the schema directive name to match.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when the node carries `@name`.

#### Example

```js
decorators: {
  responses: {
    predicate: hasDirectiveNamed("httpResponse"),
    render: (values) => values.map((v) => `- ${v.code}`).join("\n"),
  },
}
```

---

### isEntity()

```ts
function isEntity(...kinds): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L130)

Builds a predicate matching one of the given schema entity kinds.

#### Parameters

##### kinds

...`SchemaEntity`[]

the schema entity kinds to match.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when the node's resolved entity kind is one of `kinds`.

---

### not()

```ts
function not(predicate): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:179](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L179)

Negates a predicate.

#### Parameters

##### predicate

`DecoratorPredicate`

the predicate to negate.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when `predicate` is false.

---

### or()

```ts
function or(...predicates): DecoratorPredicate;
```

Defined in: [packages/graphql/src/predicate.ts:163](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/predicate.ts#L163)

Combines predicates with logical OR. An empty list is vacuously `false`.

#### Parameters

##### predicates

...`DecoratorPredicate`[]

the predicates to combine.

#### Returns

`DecoratorPredicate`

a DecoratorPredicate true when at least one of `predicates` is true.
