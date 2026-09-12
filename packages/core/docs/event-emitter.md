# event-emitter

## Events

### CancellableEventEmitter

Defined in: [packages/core/src/event-emitter.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L34)

Custom EventEmitter that supports cancellable events with sequential handler execution.

Features:

- Executes async handlers sequentially (one after another)
- Collects errors without stopping handler execution
- Supports stopPropagation to halt handler chain
- Returns execution results to emitters

#### Extends

- `EventEmitter`

#### Constructors

##### Constructor

```ts
new CancellableEventEmitter(options?): CancellableEventEmitter;
```

Defined in: node_modules/.bun/@types+node@26.4.1/node_modules/@types/node/events.d.ts:54

###### Parameters

###### options?

`EventEmitterOptions`

###### Returns

[`CancellableEventEmitter`](#cancellableeventemitter)

###### Inherited from

```ts
EventEmitter.constructor;
```

#### Methods

##### emitAsync()

```ts
emitAsync(eventName, event): Promise<EmitResult>;
```

Defined in: [packages/core/src/event-emitter.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L77)

Emit an event asynchronously with cancellable event support.

Handlers are executed sequentially in registration order.
If a handler throws an error, it's collected but execution continues.
If event.propagationStopped becomes true, remaining handlers are skipped.

After all handlers execute, if the event has a defaultAction function and
preventDefault() was not called, the default action is automatically executed.

###### Parameters

###### eventName

`string`

Name of the event to emit

###### event

`ICancellableEvent`

Cancellable event object with preventDefault() and stopPropagation() methods

###### Returns

`Promise`&lt;[`EmitResult`](#emitresult)&gt;

Promise resolving to EmitResult with errors and cancellation status

###### Example

```typescript
const events = getEvents();
const event = new SchemaLoadEvent({
  schemaLocation: "/path/to/schema",
  defaultAction: async () => {
    // This runs automatically if not prevented
    await loadSchema("/path/to/schema");
  },
});

const { errors, defaultPrevented } = await events.emitAsync(
  "beforeLoadSchema",
  event,
);

if (errors.length > 0) {
  console.error("Errors occurred:", errors);
}
```

---

### EmitResult

Defined in: [packages/core/src/event-emitter.ts:9](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L9)

Result object returned when emitting a cancellable event.

#### Properties

##### defaultPrevented

```ts
defaultPrevented: boolean;
```

Defined in: [packages/core/src/event-emitter.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L20)

Whether any handler called preventDefault() on the event.
Only applicable if the event is cancellable.

##### errors

```ts
errors: Error[];
```

Defined in: [packages/core/src/event-emitter.ts:14](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L14)

Array of errors that occurred during handler execution.
Handlers continue executing even if previous handlers throw errors.

---

### getEvents()

```ts
function getEvents(): CancellableEventEmitter;
```

Defined in: [packages/core/src/event-emitter.ts:172](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L172)

Get the singleton event emitter instance.

Creates the instance on first call, then returns the same instance on subsequent calls.
This ensures all parts of the application share the same event bus.

#### Returns

[`CancellableEventEmitter`](#cancellableeventemitter)

The singleton CancellableEventEmitter instance

#### Example

```typescript
// In generator.ts
const events = getEvents();
events.on("beforeLoadSchema", handler);

// In renderer.ts - same instance!
const events = getEvents();
await events.emitAsync("beforeLoadSchema", event);
```

---

### resetEvents()

```ts
function resetEvents(): void;
```

Defined in: [packages/core/src/event-emitter.ts:196](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L196)

Reset the event emitter singleton.

Removes all event listeners and clears the instance.
The next call to getEvents() will create a fresh instance.

**Important:** This should only be used in tests to ensure test isolation.

#### Returns

`void`

#### Example

```typescript
// In test setup
afterEach(() => {
  resetEvents();
  jest.restoreAllMocks();
});
```
