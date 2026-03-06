# events/print-type

Print type event classes.

Event classes for print operations that allow handlers to modify the generated output.

## Events

### PrintCodeEvent

Defined in: [events/print-type.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L45)

Event emitted before/after generating the code block for a GraphQL type.

The `output` property is mutable, allowing event handlers to modify
the generated code before it's included in the documentation.

#### Example

```typescript
events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
  // Add a comment to all generated code
  event.output = `# Auto-generated\n${event.output}`;
});
```

#### Extends

- [`CancellableEvent`](base.md#abstract-cancellableevent)

#### Constructors

##### Constructor

```ts
new PrintCodeEvent(
   data,
   initialOutput,
   options?): PrintCodeEvent;
```

Defined in: [events/print-type.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L55)

###### Parameters

###### data

[`PrintCodeEventData`](#printcodeeventdata-1)

###### initialOutput

`string`

###### options?

[`CancellableEventOptions`](base.md#cancellableeventoptions)

###### Returns

[`PrintCodeEvent`](#printcodeevent)

###### Overrides

[`CancellableEvent`](base.md#abstract-cancellableevent).[`constructor`](base.md#constructor)

#### Properties

##### data

```ts
readonly data: PrintCodeEventData;
```

Defined in: [events/print-type.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L47)

Read-only event data

##### output

```ts
output: string;
```

Defined in: [events/print-type.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L53)

The generated code output.
Handlers can modify this property to change the final output.

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`defaultAction`](base.md#defaultaction)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`defaultPrevented`](base.md#defaultprevented)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`propagationStopped`](base.md#propagationstopped)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`preventDefault`](base.md#preventdefault)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`runDefaultAction`](base.md#rundefaultaction)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`stopPropagation`](base.md#stoppropagation)

---

### PrintTypeEvent

Defined in: [events/print-type.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L94)

Event emitted before/after generating the full documentation for a GraphQL type.

The `output` property is mutable, allowing event handlers to modify
the complete generated documentation.

#### Example

```typescript
events.on(PrintTypeEvents.AFTER_PRINT_TYPE, (event: PrintTypeEvent) => {
  // Add a footer to all type documentation
  event.output = `${event.output}\n\n---\nGenerated by GraphQL-Markdown`;
});
```

#### Extends

- [`CancellableEvent`](base.md#abstract-cancellableevent)

#### Constructors

##### Constructor

```ts
new PrintTypeEvent(
   data,
   initialOutput,
   options?): PrintTypeEvent;
```

Defined in: [events/print-type.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L104)

###### Parameters

###### data

[`PrintTypeEventData`](#printtypeeventdata-1)

###### initialOutput

`Maybe`&lt;`MDXString`&gt;

###### options?

[`CancellableEventOptions`](base.md#cancellableeventoptions)

###### Returns

[`PrintTypeEvent`](#printtypeevent)

###### Overrides

[`CancellableEvent`](base.md#abstract-cancellableevent).[`constructor`](base.md#constructor)

#### Properties

##### data

```ts
readonly data: PrintTypeEventData;
```

Defined in: [events/print-type.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L96)

Read-only event data

##### output

```ts
output: Maybe<MDXString>;
```

Defined in: [events/print-type.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L102)

The generated documentation output.
Handlers can modify this property to change the final output.

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`defaultAction`](base.md#defaultaction)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`defaultPrevented`](base.md#defaultprevented)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`propagationStopped`](base.md#propagationstopped)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`preventDefault`](base.md#preventdefault)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`runDefaultAction`](base.md#rundefaultaction)

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

[`CancellableEvent`](base.md#abstract-cancellableevent).[`stopPropagation`](base.md#stoppropagation)

## Other

### PrintCodeEventData

Defined in: [events/print-type.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L20)

Data payload for print code events.

#### Properties

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [events/print-type.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L26)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [events/print-type.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L22)

The GraphQL type being printed

##### typeName

```ts
readonly typeName: string;
```

Defined in: [events/print-type.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L24)

The name of the type

---

### PrintTypeEventData

Defined in: [events/print-type.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L69)

Data payload for print type events.

#### Properties

##### name

```ts
readonly name: Maybe<string>;
```

Defined in: [events/print-type.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L73)

The name identifier for the type

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [events/print-type.ts:75](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L75)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [events/print-type.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type.ts#L71)

The GraphQL type being printed
