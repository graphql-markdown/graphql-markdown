# @graphql-markdown/logger

Logger singleton module.

## Enumerations

### LogLevel

Log levels.

#### Enumeration Members

##### debug

```ts
debug: "debug";
```

###### Defined in

[index.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L20)

##### error

```ts
error: "error";
```

###### Defined in

[index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L21)

##### info

```ts
info: "info";
```

###### Defined in

[index.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L22)

##### log

```ts
log: "log";
```

###### Defined in

[index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L23)

##### success

```ts
success: "success";
```

###### Defined in

[index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)

##### warn

```ts
warn: "warn";
```

###### Defined in

[index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L25)

## Functions

### Logger()

```ts
function Logger(moduleName?): void
```

Instantiate a logger module.
By default, the logger module uses `global.console`

#### Parameters

• **moduleName?**: `string`

optional name of the logger package.

#### Returns

`void`

#### Example

```js
import { Logger, log } from "@graphql-markdown/utils/logger";

log("Info message"); // Expected console output "Info message"

Logger("@docusaurus/logger");
log("Info message", "info"); // Expected Docusaurus log output "Info message"
```

#### Defined in

[index.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L45)

***

### log()

```ts
function log(message, level): void
```

Logs a message by calling the active logger instance.

#### Parameters

• **message**: `string`

a string to be logged.

• **level**: 
  \| `"debug"`
  \| `"error"`
  \| `"info"`
  \| `"log"`
  \| `"success"`
  \| `"warn"`
  \| [`LogLevel`](globals.md#loglevel) = `LogLevel.info`

optional log level, `"info"` by default.

#### Returns

`void`

#### Remarks

If a log level is not supported by the logger instance, then it defaults to `"info"`.

#### Example

```js
import { log } from "@graphql-markdown/utils/logger";

log("Info message"); // Expected console output "Info message"
```

#### Defined in

[index.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L85)
