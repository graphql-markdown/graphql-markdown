# track

## Interfaces

### TrackInput

Defined in: [track.ts:11](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L11)

#### Extends

- `Omit`&lt;[`PayloadInput`](payload.md#payloadinput), `"noStateBefore"`&gt;

#### Properties

##### cli?

```ts
cli?: CliOptions;
```

Defined in: [payload.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L24)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`cli`](payload.md#cli)

##### config?

```ts
config?: ConfigOptions;
```

Defined in: [payload.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L23)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`config`](payload.md#config)

##### durationMs?

```ts
durationMs?: number;
```

Defined in: [payload.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L30)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`durationMs`](payload.md#durationms)

##### env?

```ts
env?: ProcessEnv;
```

Defined in: [payload.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L34)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`env`](payload.md#env)

##### errorType?

```ts
errorType?: string;
```

Defined in: [payload.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L31)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`errorType`](payload.md#errortype)

##### event?

```ts
event?: TelemetryEvent;
```

Defined in: [payload.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L17)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`event`](payload.md#event)

##### graphqlMajor?

```ts
graphqlMajor?: unknown;
```

Defined in: [payload.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L22)

`versionInfo.major` of the loaded `graphql`.

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`graphqlMajor`](payload.md#graphqlmajor)

##### mode?

```ts
mode?: "scaffold" | "wire";
```

Defined in: [payload.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L27)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`mode`](payload.md#mode)

##### onFullNotice?

```ts
onFullNotice?: (notice) => void;
```

Defined in: [track.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L17)

Receives the full notice instead of stderr (e.g. a prompt UI).

###### Parameters

###### notice

`string`

###### Returns

`void`

##### option?

```ts
option?: boolean;
```

Defined in: [track.ts:13](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L13)

Value of the `telemetry` option.

##### pages?

```ts
pages?: number;
```

Defined in: [payload.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L29)

Generate events only.

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`pages`](payload.md#pages)

##### pkg

```ts
pkg: string;
```

Defined in: [payload.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L19)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`pkg`](payload.md#pkg)

##### pkgVersion

```ts
pkgVersion: string;
```

Defined in: [payload.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L20)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`pkgVersion`](payload.md#pkgversion)

##### statePath?

```ts
statePath?: string;
```

Defined in: [track.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L15)

Override of the `telemetry.json` location (tests).

##### target?

```ts
target?: string;
```

Defined in: [payload.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L26)

Create events only.

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`target`](payload.md#target)

##### trigger

```ts
trigger: TelemetryTrigger;
```

Defined in: [payload.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L18)

###### Inherited from

[`PayloadInput`](payload.md#payloadinput).[`trigger`](payload.md#trigger)

## Functions

### encodeBody()

```ts
function encodeBody(json): object;
```

Defined in: [track.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L21)

Builds the request body, gzipped above the size threshold.

#### Parameters

##### json

`string`

#### Returns

`object`

##### body

```ts
body: BodyInit;
```

##### headers

```ts
headers: Record<string, string>;
```

---

### track()

```ts
function track(input): Promise<void>;
```

Defined in: [track.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/track.ts#L37)

Sends one anonymous config event. Never throws and never rejects.

#### Parameters

##### input

[`TrackInput`](#trackinput)

#### Returns

`Promise`&lt;`void`&gt;
