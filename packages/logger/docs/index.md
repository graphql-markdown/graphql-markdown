# @graphql-markdown/logger

Logger singleton module.

## Enumerations

### LogLevel

Defined in: [index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L23)

Log levels supported by the logger.

#### Remarks

The logger supports standard console methods plus custom 'success' level
for framework-specific integrations like Docusaurus.

#### Enumeration Members

##### debug

```ts
debug: "debug";
```

Defined in: [index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)

##### error

```ts
error: "error";
```

Defined in: [index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L25)

##### info

```ts
info: "info";
```

Defined in: [index.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L26)

##### log

```ts
log: "log";
```

Defined in: [index.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L27)

##### success

```ts
success: "success";
```

Defined in: [index.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L28)

##### warn

```ts
warn: "warn";
```

Defined in: [index.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L29)

## Variables

### \_\_internal

```ts
const __internal: object;
```

Defined in: [index.ts:183](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L183)

**`Internal`**

Internal helpers exported for testing purposes only.
Not part of the public API — do not use in application code.

#### Type Declaration

##### hasLogMethod

```ts
hasLogMethod: (instance, level) => instance is Record<string, (args: unknown[]) => unknown>;
```

Type guard to check if an object has a log method for a given level.

###### Parameters

###### instance

`unknown`

The object to check

###### level

\| `"debug"`
\| `"error"`
\| `"info"`
\| `"log"`
\| `"success"`
\| `"warn"`
\| [`LogLevel`](#loglevel)

The log level to verify

###### Returns

`instance is Record<string, (args: unknown[]) => unknown>`

`true` if the instance has a function at the given level, `false` otherwise

##### resolveLoggerInstance

```ts
resolveLoggerInstance: (instance) =>
  | Partial<Record<LogLevel, (...unknown) => void>>
  | undefined;
```

Resolve a logger instance from a module export.

###### Parameters

###### instance

`unknown`

The module export or object to resolve

###### Returns

\| `Partial`&lt;`Record`&lt;`LogLevel`, (...`unknown`) => `void`&gt;&gt;
\| `undefined`

The logger instance if found, or `undefined` if no valid logger is detected (the caller is responsible for falling back to `globalThis.console`)

###### Remarks

Handles various module export patterns:

- Direct logger instance: `{ info: () => {}, ... }`
- Default export: `{ default: { info: () => {}, ... } }`
- Named export: `{ logger: { info: () => {}, ... } }`

## Functions

### log()

```ts
function log(message, level?): void;
```

Defined in: [index.ts:168](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L168)

Logs a message by calling the active logger instance.

#### Parameters

##### message

`string`

a string to be logged.

##### level?

\| `"debug"`
\| `"error"`
\| `"info"`
\| `"log"`
\| `"success"`
\| `"warn"`
\| [`LogLevel`](#loglevel)

optional log level, `"info"` by default.

#### Returns

`void`

#### Remarks

If a log level is not supported by the logger instance, then it defaults to `"info"`.

#### Example

```js
import { log } from "@graphql-markdown/logger";

log("Info message"); // Expected console output "Info message"
```

---

### Logger()

```ts
function Logger(moduleName?): Promise<void>;
```

Defined in: [index.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L111)

Instantiate a logger module.
By default, the logger module uses `globalThis.console`

#### Parameters

##### moduleName?

`string`

optional name of the logger package.

#### Returns

`Promise`&lt;`void`&gt;

#### Example

```js
import Logger, { log } from "@graphql-markdown/logger";

log("Info message"); // Expected console output "Info message"

Logger("@docusaurus/logger");
log("Info message", "info"); // Expected Docusaurus log output "Info message"
```
