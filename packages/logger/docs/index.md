# @graphql-markdown/logger

Logger singleton module.

## Enumerations

### LogLevel

Defined in: [index.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L46)

Log levels supported by the logger.

#### Remarks

The logger supports standard console methods plus custom 'success' level
for framework-specific integrations like Docusaurus.

#### Enumeration Members

##### debug

```ts
debug: "debug";
```

Defined in: [index.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L47)

##### error

```ts
error: "error";
```

Defined in: [index.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L48)

##### info

```ts
info: "info";
```

Defined in: [index.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L49)

##### log

```ts
log: "log";
```

Defined in: [index.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L50)

##### success

```ts
success: "success";
```

Defined in: [index.ts:51](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L51)

##### warn

```ts
warn: "warn";
```

Defined in: [index.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L52)

## Variables

### \_\_internal

```ts
const __internal: object;
```

Defined in: [index.ts:212](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L212)

**`Internal`**

Internal helpers exported for testing purposes only.
Not part of the public API — do not use in application code.

#### Type Declaration

##### hasLogMethod

```ts
hasLogMethod: typeof hasLogMethod;
```

##### resolveLoggerInstance

```ts
resolveLoggerInstance: typeof resolveLoggerInstance;
```

## Functions

### log()

```ts
function log(message, level?): void;
```

Defined in: [index.ts:198](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L198)

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
\| [`LogLevel`](#loglevel) = `LogLevel.info`

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

Defined in: [index.ts:137](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L137)

Instantiate a logger module.
By default, the logger module uses `globalThis.console`

#### Parameters

##### moduleName?

`string` \| `Record`&lt;`string`, `unknown`&gt;

optional name of the logger package, or a logger instance to use directly.

#### Returns

`Promise`&lt;`void`&gt;

#### Example

```js
import Logger, { log } from "@graphql-markdown/logger";

log("Info message"); // Expected console output "Info message"

Logger("@docusaurus/logger");
log("Info message", "info"); // Expected Docusaurus log output "Info message"

Logger({ info: (message) => process.stdout.write(message) }); // Logger instance
log("Info message", "info"); // Expected custom logger output "Info message"
```

---

### runtimeModuleSpecifier()

```ts
function runtimeModuleSpecifier(name): string;
```

Defined in: [index.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/logger/src/index.ts#L24)

**`Internal`**

Resolves a module specifier for dynamic `import()` at runtime.

#### Parameters

##### name

`string`

the module specifier.

#### Returns

`string`

the specifier to pass to `import()`.

#### Remarks

Inlined from `runtimeModuleSpecifier` in `@graphql-markdown/utils` (logger must not depend on utils).
On Deno, bare specifiers are not resolved from inside a JSR package and need a prefix:
`@graphql-markdown/*` names get `jsr:`, other bare names get `npm:`.
