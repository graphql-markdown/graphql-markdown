# disclaimer

## Variables

### FULL\_NOTICE

```ts
const FULL_NOTICE: "ℹ GraphQL-Markdown collects anonymous usage data to help improve the tool.\n  Sent: package/Node versions, OS, schema loader type, the settings you use,\n  and the page count, duration and error type of each run.\n  Custom strings, URLs and paths are masked; schema content is never sent.\n  Details: https://graphql-markdown.dev/docs/reference/telemetry\n  Opt out: `gqlmd telemetry disable` or DO_NOT_TRACK=1\n";
```

Defined in: [disclaimer.ts:5](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/disclaimer.ts#L5)

## Functions

### isNoticeDue()

```ts
function isNoticeDue(state, ci?): boolean;
```

Defined in: [disclaimer.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/disclaimer.ts#L17)

Whether the full notice is due (never in CI, where it is not recorded).

#### Parameters

##### state

[`TelemetryState`](state.md#telemetrystate) \| `null` \| `undefined`

##### ci?

[`CiInfo`](ci.md#ciinfo) = `...`

#### Returns

`boolean`

---

### printDisclaimer()

```ts
function printDisclaimer(state, ci, onFullNotice?): boolean;
```

Defined in: [disclaimer.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/disclaimer.ts#L39)

Writes the notice straight to stderr, bypassing the logger, at most once per process.

When `onFullNotice` is given, the full notice is passed to it instead.

#### Parameters

##### state

[`TelemetryState`](state.md#telemetrystate) \| `null` \| `undefined`

##### ci

[`CiInfo`](ci.md#ciinfo)

##### onFullNotice?

(`notice`) => `void`

#### Returns

`boolean`

`true` when the full notice is due, shown now or earlier in this
process (it must then be recorded before anything is sent).

---

### resetDisclaimer()

```ts
function resetDisclaimer(): void;
```

Defined in: [disclaimer.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/disclaimer.ts#L27)

**`Internal`**

Resets the once-per-process guard.

#### Returns

`void`
