# events/schema-load

Schema loading event class.

## Events

### SchemaLoadEvent

Defined in: [events/schema-load.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L15)

Event emitted before/after loading a GraphQL schema.

#### Extends

- [`CancellableEvent`](base.md#cancellableevent)

#### Constructors

##### Constructor

```ts
new SchemaLoadEvent(data): SchemaLoadEvent;
```

Defined in: [events/schema-load.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L19)

###### Parameters

###### data

###### cancellable?

`boolean`

###### defaultAction?

`DefaultAction`

###### schemaLocation

`string`

###### Returns

[`SchemaLoadEvent`](#schemaloadevent)

###### Overrides

[`CancellableEvent`](base.md#cancellableevent).[`constructor`](base.md#constructor)

#### Properties

##### schemaLocation

```ts
readonly schemaLocation: string;
```

Defined in: [events/schema-load.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L17)

Path or pointer to the schema location

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: [events/base.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L103)

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`defaultAction`](base.md#defaultaction)

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: [events/base.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L89)

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`defaultPrevented`](base.md#defaultprevented)

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: [events/base.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L96)

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`propagationStopped`](base.md#propagationstopped)

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: [events/base.ts:121](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L121)

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Example

```typescript
events.on("beforeLoadSchema", (event) => {
  if (shouldUseCustomLoader) {
    event.preventDefault(); // Stops default schema loading
    // Custom logic here
  }
});
```

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`preventDefault`](base.md#preventdefault)

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: [events/base.ts:154](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L154)

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

A promise that resolves when the default action completes, or void if the action was prevented or no default action is defined

###### Remarks

This method will only execute the `_defaultAction` if:

- The event's default has not been prevented (`_defaultPrevented` is false)
- A default action function has been defined (`_defaultAction` is a function)

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`runDefaultAction`](base.md#rundefaultaction)

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: [events/base.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L140)

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Example

```typescript
events.on("beforeLoadSchema", (event) => {
  if (criticalError) {
    event.stopPropagation(); // No more handlers run
  }
});
```

###### Inherited from

[`CancellableEvent`](base.md#cancellableevent).[`stopPropagation`](base.md#stoppropagation)
