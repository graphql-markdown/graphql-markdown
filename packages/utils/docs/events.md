# events

Base event class and utilities for GraphQL-Markdown events.

## Events

### `abstract` CancellableEvent

Defined in: [events.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L55)

Base class for all cancellable events in GraphQL-Markdown.

Provides common functionality:

- preventDefault() to cancel default actions
- stopPropagation() to halt handler chain
- Configurable cancellability
- Optional default action function

#### Extended by

- [`DataEvent`](#abstract-dataevent)

#### Implements

- `ICancellableEvent`

#### Constructors

##### Constructor

```ts
new CancellableEvent(options?): CancellableEvent;
```

Defined in: [events.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L88)

Creates a new CancellableEvent.

###### Parameters

###### options?

[`CancellableEventOptions`](#cancellableeventoptions)

Configuration options for the event

###### Returns

[`CancellableEvent`](#abstract-cancellableevent)

###### Remarks

options.cancellable controls whether this event can be cancelled (default: true).
options.defaultAction defines an optional function to execute as default action.

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: [events.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L110)

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Implementation of

```ts
ICancellableEvent.defaultAction;
```

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: [events.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L96)

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: [events.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L117)

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
ICancellableEvent.defaultPrevented;
```

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: [events.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L103)

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: [events.ts:126](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L126)

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
ICancellableEvent.propagationStopped;
```

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: [events.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L136)

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Implementation of

```ts
ICancellableEvent.preventDefault;
```

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: [events.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L153)

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Implementation of

```ts
ICancellableEvent.runDefaultAction;
```

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: [events.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L146)

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Implementation of

```ts
ICancellableEvent.stopPropagation;
```

---

### `abstract` DataEvent

Defined in: [events.ts:168](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L168)

Abstract base for events that carry a typed, read-only data payload.

#### Extends

- [`CancellableEvent`](#abstract-cancellableevent)

#### Extended by

- [`DataOutputEvent`](#abstract-dataoutputevent)

#### Type Parameters

##### TData

`TData`

Type of the event data payload.

#### Constructors

##### Constructor

```ts
new DataEvent<TData>(data, options?): DataEvent<TData>;
```

Defined in: [events.ts:172](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L172)

###### Parameters

###### data

`TData`

###### options?

[`CancellableEventOptions`](#cancellableeventoptions)

###### Returns

[`DataEvent`](#abstract-dataevent)&lt;`TData`&gt;

###### Overrides

[`CancellableEvent`](#abstract-cancellableevent).[`constructor`](#constructor)

#### Properties

##### data

```ts
readonly data: TData;
```

Defined in: [events.ts:170](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L170)

Read-only event data payload.

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: [events.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L110)

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`defaultAction`](#defaultaction)

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: [events.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L96)

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: [events.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L117)

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`defaultPrevented`](#defaultprevented)

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: [events.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L103)

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: [events.ts:126](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L126)

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`propagationStopped`](#propagationstopped)

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: [events.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L136)

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`preventDefault`](#preventdefault)

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: [events.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L153)

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`runDefaultAction`](#rundefaultaction)

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: [events.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L146)

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Inherited from

[`CancellableEvent`](#abstract-cancellableevent).[`stopPropagation`](#stoppropagation)

---

### `abstract` DataOutputEvent

Defined in: [events.ts:186](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L186)

Abstract base for events that carry typed data and a mutable output value.

#### Extends

- [`DataEvent`](#abstract-dataevent)&lt;`TData`&gt;

#### Type Parameters

##### TData

`TData`

Type of the event data payload.

##### TOutput

`TOutput`

Type of the mutable output value.

#### Constructors

##### Constructor

```ts
new DataOutputEvent<TData, TOutput>(
   data,
   initialOutput,
   options?): DataOutputEvent<TData, TOutput>;
```

Defined in: [events.ts:193](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L193)

###### Parameters

###### data

`TData`

###### initialOutput

`TOutput`

###### options?

[`CancellableEventOptions`](#cancellableeventoptions)

###### Returns

[`DataOutputEvent`](#abstract-dataoutputevent)&lt;`TData`, `TOutput`&gt;

###### Overrides

[`DataEvent`](#abstract-dataevent).[`constructor`](#constructor-1)

#### Properties

##### data

```ts
readonly data: TData;
```

Defined in: [events.ts:170](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L170)

Read-only event data payload.

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`data`](#data)

##### output

```ts
output: TOutput;
```

Defined in: [events.ts:191](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L191)

The generated output.
Handlers can modify this property to change the final result.

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: [events.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L110)

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`defaultAction`](#defaultaction-1)

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: [events.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L96)

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: [events.ts:117](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L117)

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`defaultPrevented`](#defaultprevented-1)

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: [events.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L103)

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: [events.ts:126](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L126)

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`propagationStopped`](#propagationstopped-1)

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: [events.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L136)

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`preventDefault`](#preventdefault-1)

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: [events.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L153)

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`runDefaultAction`](#rundefaultaction-1)

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: [events.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L146)

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Inherited from

[`DataEvent`](#abstract-dataevent).[`stopPropagation`](#stoppropagation-1)

## Other

### CancellableEventOptions

Defined in: [events.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L39)

#### Properties

##### cancellable?

```ts
optional cancellable?: boolean;
```

Defined in: [events.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L41)

##### defaultAction?

```ts
optional defaultAction?: DefaultAction;
```

Defined in: [events.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L40)

---

### deepFreeze()

```ts
function deepFreeze<T>(obj): T;
```

Defined in: [events.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/events.ts#L23)

Deep freezes an object to make it immutable at runtime.
Recursively freezes all nested objects and arrays.

#### Type Parameters

##### T

`T` _extends_ `Record`&lt;`PropertyKey`, `any`&gt;

#### Parameters

##### obj

`T`

The object to freeze

#### Returns

`T`

The frozen object (same reference)

#### Example

```typescript
const data = { user: { name: "John" } };
deepFreeze(data);
data.user.name = "Jane"; // Throws error in strict mode
```
