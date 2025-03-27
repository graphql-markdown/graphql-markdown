# @graphql-markdown/logger

Logger singleton module.

## Enumerations

### LogLevel

<<<<<<< Updated upstream
=======
Defined in: [index.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L19)

>>>>>>> Stashed changes
Log levels.

#### Enumeration Members

##### debug

```ts
debug: "debug";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L20)
=======
Defined in: [index.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L20)
>>>>>>> Stashed changes

##### error

```ts
error: "error";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L21)
=======
Defined in: [index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L21)
>>>>>>> Stashed changes

##### info

```ts
info: "info";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L22)
=======
Defined in: [index.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L22)
>>>>>>> Stashed changes

##### log

```ts
log: "log";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L23)
=======
Defined in: [index.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L23)
>>>>>>> Stashed changes

##### success

```ts
success: "success";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)
=======
Defined in: [index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)
>>>>>>> Stashed changes

##### warn

```ts
warn: "warn";
```

<<<<<<< Updated upstream
###### Defined in

[index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L25)
=======
Defined in: [index.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L25)
>>>>>>> Stashed changes

## Functions

### log()

```ts
function log(message, level): void
```

<<<<<<< Updated upstream
=======
Defined in: [index.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L85)

>>>>>>> Stashed changes
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

#### Defined in

<<<<<<< Updated upstream
[index.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L85)
=======
### Logger()

```ts
function Logger(moduleName?): Promise<void>
```

Defined in: [index.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L45)

Instantiate a logger module.
By default, the logger module uses `global.console`

#### Parameters

##### moduleName?

`string`

optional name of the logger package.

#### Returns

`Promise`\<`void`\>

#### Example

```js
import Logger, { log } from "@graphql-markdown/logger";

log("Info message"); // Expected console output "Info message"

Logger("@docusaurus/logger");
log("Info message", "info"); // Expected Docusaurus log output "Info message"
```
>>>>>>> Stashed changes
