# @graphql-markdown/logger

Logger singleton module.

## Functions

### Logger

```ts
Logger(moduleName?): LoggerType
```

Returns a logger module, if a package name is provided then instantiates it.
By default, the logger module uses `global.console`

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `moduleName`? | `string` | optional name of the logger package. |

#### Returns

`LoggerType`

an instance of the logger.

#### Example

```js
import { Logger } from "@graphql-markdown/utils/logger";

Logger().info("Info message"); // Expected console output "Info message"

const loggerModule = require.resolve("@docusaurus/logger");
Logger(loggerModule).info("Info message"); // Expected Docusaurus log output "Info message"
```

#### Defined In

index.ts:36
