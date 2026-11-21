# enabled

## Interfaces

### EnabledContext

Defined in: [enabled.ts:6](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L6)

#### Properties

##### env?

```ts
env?: ProcessEnv;
```

Defined in: [enabled.ts:13](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L13)

##### option?

```ts
option?: boolean;
```

Defined in: [enabled.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L10)

Value of the `telemetry` option (config, programmatic or CLI).

##### state?

```ts
state?: TelemetryState | null;
```

Defined in: [enabled.ts:12](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L12)

State file content; `null` means corrupt, `undefined` means absent.

##### trigger?

```ts
trigger?: TelemetryTrigger;
```

Defined in: [enabled.ts:8](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L8)

Entry point; without it only `telemetry: true` enables (programmatic).

## Functions

### getEndpoint()

```ts
function getEndpoint(env?): string;
```

Defined in: [enabled.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L16)

#### Parameters

##### env?

`ProcessEnv` = `process.env`

#### Returns

`string`

---

### isEnabled()

```ts
function isEnabled(ctx?):
  | {
      enabled: false;
    }
  | {
      enabled: true;
      trigger: TelemetryTrigger;
    };
```

Defined in: [enabled.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/enabled.ts#L30)

Resolves whether telemetry is enabled and with which trigger.
User-level and environment signals always beat project config.

#### Parameters

##### ctx?

[`EnabledContext`](#enabledcontext) = `{}`

#### Returns

\| \{
`enabled`: `false`;
\}
\| \{
`enabled`: `true`;
`trigger`: `TelemetryTrigger`;
\}
