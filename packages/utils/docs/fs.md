# fs

Library of helper functions for handling files and folders.

## Functions

### ensureDir()

```ts
ensureDir(location): Promise<void>
```

Asynchronously create a folder structure if it does not exist.

#### Parameters

• **location**: `string`

folder structure in path format.

#### Returns

`Promise`\<`void`\>

#### Example

```js
import { ensureDir } from "@graphql-markdown/utils/fs";

await ensureDir("./.temp/local");

// Creates both folders if they do not exists.
```

#### Source

[fs.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L57)

---

### fileExists()

```ts
fileExists(location): Promise<boolean>
```

Asynchronously check if a file or folder exists at the path location.

#### Parameters

• **location**: `string`

file or folder location.

#### Returns

`Promise`\<`boolean`\>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { fileExists } from "@graphql-markdown/utils/fs";

await fileExists("./.temp/local");

// Expected true if path is valid, false if not
```

#### Source

[fs.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L32)

---

### saveFile()

```ts
saveFile(
   location,
   content,
prettify?): Promise<void>
```

Asynchronously save a file with a string content at specified location in local FS.
Override the file content if the file already exists.
The function calls `ensureDir(dirname(location))` to create the folder structure if missing.

#### Parameters

• **location**: `string`

file location.

• **content**: `string`

data to be written into the file (UTF-8 string).

• **prettify?**: `PrettifyCallbackFunction`

optional callback function for prettifying the content.

#### Returns

`Promise`\<`void`\>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { saveFile } from "@graphql-markdown/utils/fs";

await saveFile("./.temp/local.md", "foobar");

// Created .temp folder if it does not exists, and save data into local.md
```

#### Source

[fs.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L85)
