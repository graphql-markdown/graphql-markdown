# events/render-type-entities

Render type entities event class.

## Events

### RenderTypeEntitiesEvent

Defined in: [packages/core/src/events/render-type-entities.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/render-type-entities.ts#L16)

Event emitted before/after rendering type entities.

#### Extends

- `DataEvent`&lt;\{
  `baseURL`: `string`;
  `filePath`: `string`;
  `knownDocPaths?`: `ReadonlySet`&lt;`string`&gt;;
  `linkRoot?`: `string`;
  `name`: `string`;
  `outputAdapter?`: `OutputAdapter`;
  `outputDir`: `string`;
  \}&gt;

#### Constructors

##### Constructor

```ts
new RenderTypeEntitiesEvent(data, options?): RenderTypeEntitiesEvent;
```

Defined in: [packages/core/src/events/render-type-entities.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/render-type-entities.ts#L28)

###### Parameters

###### data

###### baseURL

`string`

###### filePath

`string`

###### knownDocPaths?

`ReadonlySet`&lt;`string`&gt;

###### linkRoot?

`string`

###### name

`string`

###### outputAdapter?

`OutputAdapter`

###### outputDir

`string`

###### options?

`CancellableEventOptions`

###### Returns

[`RenderTypeEntitiesEvent`](#rendertypeentitiesevent)

###### Overrides

`DataEvent<{ baseURL: string; /** Root for documentation links, as used when printing them. */ linkRoot?: string; name: string; filePath: string; outputDir: string; /** Destination the page was written to; use it to read the page back. */ outputAdapter?: OutputAdapter; /** Root-level generated doc paths, known before concurrent pages are written. */ knownDocPaths?: ReadonlySet<string>; }>.constructor`

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

###### filePath

```ts
filePath: string;
```

###### knownDocPaths?

```ts
knownDocPaths?: ReadonlySet<string>;
```

Root-level generated doc paths, known before concurrent pages are written.

###### linkRoot?

```ts
linkRoot?: string;
```

Root for documentation links, as used when printing them.

###### name

```ts
name: string;
```

###### outputAdapter?

```ts
outputAdapter?: OutputAdapter;
```

Destination the page was written to; use it to read the page back.

###### outputDir

```ts
outputDir: string;
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
