# Module: logger

Logger singleton module.

## Functions

### Logger()

```ts
Logger(moduleName?): LoggerType
```

Returns a logger module, if a package name is provided then instantiates it.
By default, the logger module uses `global.console`

#### Example

```js
import { Logger } from "@graphql-markdown/utils/logger";

Logger().info("Info message"); // Expected console output "Info message"

const loggerModule = require.resolve("@docusaurus/logger");
Logger(loggerModule).info("Info message"); // Expected Docusaurus log output "Info message"
```

#### Parameters

| Parameter     | Type     | Description                          |
| :------------ | :------- | :----------------------------------- |
| `moduleName`? | `string` | optional name of the logger package. |

#### Returns

`LoggerType`

an instance of the logger.

#### Source

[packages/utils/src/logger.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/f79e0c1c/packages/utils/src/logger.ts#L36)
