# events/schema-load

Schema loading event class.

## Events

### SchemaEvent

Defined in: [events/schema-load.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L15)

Event emitted before/after loading a GraphQL schema.

#### Extends

- [`CancellableEvent`](base.md#cancellableevent)

#### Constructors

##### Constructor

```ts
new SchemaEvent(data, options?): SchemaEvent;
```

Defined in: [events/schema-load.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L23)

###### Parameters

###### data

###### rootTypes?

`Maybe`&lt;`SchemaMap`&gt;

###### schema?

`Maybe`&lt;`GraphQLSchema`&gt;

###### schemaLocation?

`string`

###### options?

[`CancellableEventOptions`](base.md#cancellableeventoptions)

###### Returns

[`SchemaEvent`](#schemaevent)

###### Overrides

[`CancellableEvent`](base.md#cancellableevent).[`constructor`](base.md#constructor)

#### Properties

##### data

```ts
readonly data: object;
```

Defined in: [events/schema-load.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/schema-load.ts#L17)

Event data containing schema location, schema, and root types

###### rootTypes?

```ts
optional rootTypes: Maybe<SchemaMap>;
```

###### schema?

```ts
optional schema: Maybe<GraphQLSchema>;
```

###### schemaLocation?

```ts
optional schemaLocation: string;
```

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: [events/base.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L109)

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

Defined in: [events/base.ts:95](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L95)

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

Defined in: [events/base.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L102)

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

Defined in: [events/base.ts:127](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L127)

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

Defined in: [events/base.ts:160](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L160)

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

Defined in: [events/base.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L146)

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
