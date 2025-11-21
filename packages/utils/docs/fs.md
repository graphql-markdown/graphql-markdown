# fs

Library of helper functions for handling files and folders.

## Functions

### ensureDir()

```ts
function ensureDir(location, options?): Promise<void>;
```

Defined in: [fs.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L60)

Asynchronously create a folder structure if it does not exist.

#### Parameters

##### location

`string`

folder structure in path format.

##### options?

`EnsureDirOptions`

#### Returns

`Promise`\<`void`\>

#### Example

```js
import { ensureDir } from '@graphql-markdown/utils/fs';

await ensureDir("./.temp/local")

// Creates both folders if they do not exists.
```

***

### fileExists()

```ts
function fileExists(location): Promise<boolean>;
```

Defined in: [fs.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L35)

Asynchronously check if a file or folder exists at the path location.

#### Parameters

##### location

`string`

file or folder location.

#### Returns

`Promise`\<`boolean`\>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { fileExists } from '@graphql-markdown/utils/fs';

await fileExists("./.temp/local")

// Expected true if path is valid, false if not
```

***

### saveFile()

```ts
function saveFile(
   location, 
   content, 
prettify?): Promise<void>;
```

Defined in: [fs.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L97)

Asynchronously save a file with a string content at specified location in local FS.
Override the file content if the file already exists.
The function calls `ensureDir(dirname(location))` to create the folder structure if missing.

#### Parameters

##### location

`string`

file location.

##### content

`string`

data to be written into the file (UTF-8 string).

##### prettify?

`PrettifyCallbackFunction`

optional callback function for prettifying the content.

#### Returns

`Promise`\<`void`\>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { saveFile } from '@graphql-markdown/utils/fs';

await saveFile("./.temp/local.md", "foobar")

// Created .temp folder if it does not exists, and save data into local.md
```
