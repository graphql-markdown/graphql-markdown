# state

## Interfaces

### TelemetryState

Defined in: [state.ts:14](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L14)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [state.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L15)

##### lastSentConfigs

```ts
lastSentConfigs: string[];
```

Defined in: [state.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L17)

##### noticeVersion

```ts
noticeVersion: number;
```

Defined in: [state.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L16)

##### reason?

```ts
reason?: string;
```

Defined in: [state.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L18)

## Functions

### getStatePath()

```ts
function getStatePath(dir?): string;
```

Defined in: [state.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L21)

#### Parameters

##### dir?

`string` = `...`

#### Returns

`string`

---

### readState()

```ts
function readState(path?): TelemetryState | null | undefined;
```

Defined in: [state.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L47)

Reads the state file.

#### Parameters

##### path?

`string` = `...`

#### Returns

[`TelemetryState`](#telemetrystate) \| `null` \| `undefined`

the state, `undefined` when the file does not exist, or `null` when
it is unreadable or corrupt (telemetry is then disabled for this run).

---

### writeState()

```ts
function writeState(next, path?): TelemetryState;
```

Defined in: [state.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/state.ts#L69)

Atomically writes the state (temp file + rename). Re-reads the current file
and merges `lastSentConfigs` first so parallel runs do not lose entries.

#### Parameters

##### next

`Partial`&lt;[`TelemetryState`](#telemetrystate)&gt;

##### path?

`string` = `...`

#### Returns

[`TelemetryState`](#telemetrystate)

the state that was written.
