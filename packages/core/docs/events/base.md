# events/base

Base event class and utilities for GraphQL-Markdown events.

## Events

### `abstract` CancellableEvent

Defined in: [events/base.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L55)

Base class for all cancellable events in GraphQL-Markdown.

Provides common functionality:

- preventDefault() to cancel default actions
- stopPropagation() to halt handler chain
- Configurable cancellability
- Optional default action function

#### Extended by

- [`DiffCheckEvent`](diff-check.md#diffcheckevent)
- [`FormatEvent`](format.md#formatevent)
- [`GenerateIndexMetafileEvent`](generate-index-metafile.md#generateindexmetafileevent)
- [`RenderHomepageEvent`](render-homepage.md#renderhomepageevent)
- [`RenderRootTypesEvent`](render-root-types.md#renderroottypesevent)
- [`RenderTypeEntitiesEvent`](render-type-entities.md#rendertypeentitiesevent)
- [`SchemaEvent`](schema-load.md#schemaevent)

#### Constructors

##### Constructor

```ts
new CancellableEvent(options?): CancellableEvent;
```

Defined in: [events/base.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L87)

Creates a new CancellableEvent.

###### Parameters

###### options?

[`CancellableEventOptions`](#cancellableeventoptions)

Configuration options for the event

###### Returns

[`CancellableEvent`](#cancellableevent)

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

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: [events/base.ts:95](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L95)

Gets whether the default action has been prevented.

###### Returns

`boolean`

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: [events/base.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L102)

Gets whether propagation has been stopped.

###### Returns

`boolean`

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

## Other

### CancellableEventOptions

Defined in: [events/base.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L39)

#### Properties

##### cancellable?

```ts
optional cancellable: boolean;
```

Defined in: [events/base.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L41)

##### defaultAction?

```ts
optional defaultAction: DefaultAction;
```

Defined in: [events/base.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L40)

---

### deepFreeze()

```ts
function deepFreeze<T>(obj): T;
```

Defined in: [events/base.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/base.ts#L23)

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
