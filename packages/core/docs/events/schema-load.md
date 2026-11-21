# events/schema-load

Schema loading event class.

## Events

### SchemaEvent

Defined in: [packages/core/src/events/schema-load.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L16)

Event emitted before/after loading a GraphQL schema.

#### Extends

- `DataEvent`&lt;\{
  `rootTypes?`: `SchemaMap`;
  `schema?`: `GraphQLSchema` \| `null`;
  `schemaLocation?`: `string`;
  \}&gt;

#### Constructors

##### Constructor

```ts
new SchemaEvent(data, options?): SchemaEvent;
```

Defined in: [packages/core/src/events/schema-load.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L21)

###### Parameters

###### data

###### rootTypes?

`SchemaMap`

###### schema?

`GraphQLSchema` \| `null`

###### schemaLocation?

`string`

###### options?

`CancellableEventOptions`

###### Returns

[`SchemaEvent`](#schemaevent)

###### Overrides

DataEvent\<\{ schemaLocation?: string; schema?: GraphQLSchema \| null; rootTypes?: SchemaMap; \}\>.constructor

#### Properties

##### data

```ts
readonly data: object;
```

Defined in: packages/utils/dist/events.d.ts:111

Read-only event data payload.

###### rootTypes?

```ts
rootTypes?: SchemaMap;
```

###### schema?

```ts
schema?: GraphQLSchema | null;
```

###### schemaLocation?

```ts
schemaLocation?: string;
```

###### Inherited from

`DataEvent.data`

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: packages/utils/dist/events.d.ts:78

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Inherited from

`DataEvent.defaultAction`

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: packages/utils/dist/events.d.ts:70

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: packages/utils/dist/events.d.ts:82

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

`DataEvent.defaultPrevented`

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: packages/utils/dist/events.d.ts:74

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: packages/utils/dist/events.d.ts:86

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

`DataEvent.propagationStopped`

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: packages/utils/dist/events.d.ts:91

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Inherited from

`DataEvent.preventDefault`

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: packages/utils/dist/events.d.ts:100

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Inherited from

`DataEvent.runDefaultAction`

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: packages/utils/dist/events.d.ts:96

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Inherited from

`DataEvent.stopPropagation`
