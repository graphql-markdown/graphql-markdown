# @graphql-markdown/logger

Logger singleton module.

## Enumerations

### LogLevel

Defined in: [index.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L19)

Log levels.

#### Enumeration Members

##### debug

```ts
debug: "debug";
```

Defined in: [index.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L20)

##### error

```ts
error: "error";
```

Defined in: [index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L21)

##### info

```ts
info: "info";
```

Defined in: [index.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L22)

##### log

```ts
log: "log";
```

Defined in: [index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L23)

##### success

```ts
success: "success";
```

Defined in: [index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)

##### warn

```ts
warn: "warn";
```

Defined in: [index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L25)

## Functions

### log()

```ts
function log(message, level): void;
```

Defined in: [index.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L86)

Logs a message by calling the active logger instance.

#### Parameters

##### message

`string`

a string to be logged.

##### level

optional log level, `"info"` by default.

`"debug"` | `"error"` | `"info"` | `"log"` | `"success"` | `"warn"` | [`LogLevel`](#loglevel)

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

Defined in: [index.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L45)

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
