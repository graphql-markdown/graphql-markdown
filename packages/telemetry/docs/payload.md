# payload

## Interfaces

### PayloadInput

Defined in: [payload.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L16)

#### Properties

##### cli?

```ts
cli?: CliOptions;
```

Defined in: [payload.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L24)

##### config?

```ts
config?: ConfigOptions;
```

Defined in: [payload.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L23)

##### durationMs?

```ts
durationMs?: number;
```

Defined in: [payload.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L30)

##### env?

```ts
env?: ProcessEnv;
```

Defined in: [payload.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L34)

##### errorType?

```ts
errorType?: string;
```

Defined in: [payload.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L31)

##### event?

```ts
event?: TelemetryEvent;
```

Defined in: [payload.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L17)

##### graphqlMajor?

```ts
graphqlMajor?: unknown;
```

Defined in: [payload.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L22)

`versionInfo.major` of the loaded `graphql`.

##### mode?

```ts
mode?: "scaffold" | "wire";
```

Defined in: [payload.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L27)

##### noStateBefore?

```ts
noStateBefore?: boolean;
```

Defined in: [payload.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L33)

True only when no state file existed before this run.

##### pages?

```ts
pages?: number;
```

Defined in: [payload.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L29)

Generate events only.

##### pkg

```ts
pkg: string;
```

Defined in: [payload.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L19)

##### pkgVersion

```ts
pkgVersion: string;
```

Defined in: [payload.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L20)

##### target?

```ts
target?: string;
```

Defined in: [payload.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L26)

Create events only.

##### trigger

```ts
trigger: TelemetryTrigger;
```

Defined in: [payload.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L18)

## Functions

### buildPayload()

```ts
function buildPayload(input): TelemetryPayload;
```

Defined in: [payload.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L112)

#### Parameters

##### input

[`PayloadInput`](#payloadinput)

#### Returns

`TelemetryPayload`

---

### fingerprint()

```ts
function fingerprint(payload): string;
```

Defined in: [payload.ts:190](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/payload.ts#L190)

SHA-256 of the canonical sorted-key JSON, excluding `firstRun`.

#### Parameters

##### payload

`TelemetryPayload`

#### Returns

`string`
