# events/render-files

Render files event class.

## Events

### RenderFilesEvent

Defined in: [packages/core/src/events/render-files.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/render-files.ts#L16)

Event emitted after all output files (entities + homepage) have been written.

#### Extends

- `DataEvent`&lt;\{
  `baseURL`: `string`;
  `outputAdapter?`: `OutputAdapter`;
  `outputDir`: `string`;
  `pages`: `unknown`;
  `rootDir`: `string`;
  \}&gt;

#### Constructors

##### Constructor

```ts
new RenderFilesEvent(data, options?): RenderFilesEvent;
```

Defined in: [packages/core/src/events/render-files.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/render-files.ts#L24)

###### Parameters

###### data

###### baseURL

`string`

###### outputAdapter?

`OutputAdapter`

###### outputDir

`string`

###### pages

`unknown`

###### rootDir

`string`

###### options?

`CancellableEventOptions`

###### Returns

[`RenderFilesEvent`](#renderfilesevent)

###### Overrides

`DataEvent<{ baseURL: string; outputDir: string; rootDir: string; pages: unknown; /** Destination the pages were written to; use it for any summary file. */ outputAdapter?: OutputAdapter; }>.constructor`

#### Properties

##### data

```ts
readonly data: object;
```

Defined in: packages/utils/dist/events.d.ts:111

Read-only event data payload.

###### baseURL

```ts
baseURL: string;
```

###### outputAdapter?

```ts
outputAdapter?: OutputAdapter;
```

Destination the pages were written to; use it for any summary file.

###### outputDir

```ts
outputDir: string;
```

###### pages

```ts
pages: unknown;
```

###### rootDir

```ts
rootDir: string;
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
