# event-emitter

## Events

### EmitResult

Defined in: [event-emitter.ts:9](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L9)

Result object returned when emitting a cancellable event.

#### Properties

##### defaultPrevented

```ts
defaultPrevented: boolean;
```

Defined in: [event-emitter.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L20)

Whether any handler called preventDefault() on the event.
Only applicable if the event is cancellable.

##### errors

```ts
errors: Error[];
```

Defined in: [event-emitter.ts:14](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L14)

Array of errors that occurred during handler execution.
Handlers continue executing even if previous handlers throw errors.

---

### getEvents()

```ts
function getEvents(): CancellableEventEmitter;
```

Defined in: [event-emitter.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L134)

Get the singleton event emitter instance.

Creates the instance on first call, then returns the same instance on subsequent calls.
This ensures all parts of the application share the same event bus.

#### Returns

`CancellableEventEmitter`

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

Defined in: [event-emitter.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-emitter.ts#L158)

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
