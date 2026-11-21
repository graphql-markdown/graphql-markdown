# telemetry

Anonymous usage telemetry hook for `buildConfig`.

Fire and forget: nothing here can throw, reject or delay the caller.

## Interfaces

### BuildConfigContext

Defined in: [packages/core/src/telemetry.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L18)

Internal context passed by our own entry points.

#### Properties

##### trigger?

```ts
trigger?: TelemetryTrigger;
```

Defined in: [packages/core/src/telemetry.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L19)

---

### GenerationReport

Defined in: [packages/core/src/telemetry.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L37)

Outcome of a documentation generation run.

#### Properties

##### durationMs

```ts
durationMs: number;
```

Defined in: [packages/core/src/telemetry.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L40)

##### error?

```ts
error?: unknown;
```

Defined in: [packages/core/src/telemetry.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L42)

Error thrown by the run, if any.

##### errorType?

```ts
errorType?: string;
```

Defined in: [packages/core/src/telemetry.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L44)

Explicit error type, takes precedence over `error`.

##### noSchema?

```ts
noSchema?: boolean;
```

Defined in: [packages/core/src/telemetry.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L46)

The run failed without throwing because the schema could not be loaded.

##### pages

```ts
pages: number;
```

Defined in: [packages/core/src/telemetry.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L39)

##### postError?

```ts
postError?: unknown;
```

Defined in: [packages/core/src/telemetry.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L48)

First post-processing error, when the run completed incompletely.

##### telemetry?

```ts
telemetry?: TelemetryContext;
```

Defined in: [packages/core/src/telemetry.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L38)

---

### TelemetryContext

Defined in: [packages/core/src/telemetry.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L31)

Telemetry decision made once by `buildConfig`, reused at generation time.

#### Properties

##### option?

```ts
option?: boolean;
```

Defined in: [packages/core/src/telemetry.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L33)

##### trigger?

```ts
trigger?: TelemetryTrigger;
```

Defined in: [packages/core/src/telemetry.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L32)

---

### TelemetryReport

Defined in: [packages/core/src/telemetry.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L22)

#### Properties

##### cliOpts

```ts
cliOpts: Maybe<CliOptions>;
```

Defined in: [packages/core/src/telemetry.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L25)

##### configFileOpts

```ts
configFileOpts: Maybe<ConfigOptions>;
```

Defined in: [packages/core/src/telemetry.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L23)

##### extension

```ts
extension: Maybe<ConfigOptions>;
```

Defined in: [packages/core/src/telemetry.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L24)

##### id

```ts
id: Maybe<string>;
```

Defined in: [packages/core/src/telemetry.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L26)

##### trigger?

```ts
trigger?: TelemetryTrigger;
```

Defined in: [packages/core/src/telemetry.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L27)

## Functions

### reportGeneration()

```ts
function reportGeneration(report): Promise<void>;
```

Defined in: [packages/core/src/telemetry.ts:188](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L188)

Reports the outcome of a generation run.
Never throws and never rejects.

#### Parameters

##### report

[`GenerationReport`](#generationreport)

#### Returns

`Promise`&lt;`void`&gt;

---

### reportTelemetry()

```ts
function reportTelemetry(report): Promise<void>;
```

Defined in: [packages/core/src/telemetry.ts:144](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L144)

Reports the resolved configuration once per distinct config and process.
Never throws and never rejects.

#### Parameters

##### report

[`TelemetryReport`](#telemetryreport)

#### Returns

`Promise`&lt;`void`&gt;

---

### resolveTelemetryContext()

```ts
function resolveTelemetryContext(report): TelemetryContext;
```

Defined in: [packages/core/src/telemetry.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/telemetry.ts#L100)

Resolves the telemetry opt-in and trigger from the configuration sources.

#### Parameters

##### report

`Pick`&lt;[`TelemetryReport`](#telemetryreport), `"cliOpts"` \| `"configFileOpts"` \| `"extension"` \| `"trigger"`&gt;

#### Returns

[`TelemetryContext`](#telemetrycontext)
