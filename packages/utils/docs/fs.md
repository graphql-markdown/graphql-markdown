# Module: fs

Library of helper functions for handling files and folders.

## Functions

### ensureDir

```ts
ensureDir(location): Promise< void >
```

Asynchronously create a folder structure if it does not exist.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `location` | `string` | folder structure in path format. |

#### Returns

`Promise`\< `void` \>

#### Example

```js
import { ensureDir } from '@graphql-markdown/utils/fs';

await ensureDir("./.temp/local")

// Creates both folders if they do not exists.
```

#### Defined In

[fs.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L30)

***

### fileExists

```ts
fileExists(location): Promise< boolean >
```

Asynchronously check if a file or folder exists at the path location.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `location` | `string` | file or folder location. |

#### Returns

`Promise`\< `boolean` \>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { fileExists } from '@graphql-markdown/utils/fs';

await fileExists("./.temp/local")

// Expected true if path is valid, false if not
```

#### Defined In

[fs.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L54)

***

### saveFile

```ts
saveFile(
  location,
  content,
  prettify?): Promise< void >
```

Asynchronously save a file with a string content at specified location in local FS.
Override the file content if the file already exists.
The function calls `ensureDir(dirname(location))` to create the folder structure if missing.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `location` | `string` | file location. |
| `content` | `string` | data to be written into the file (UTF-8 string). |
| `prettify`? | `PrettifyCallbackFunction` | optional callback function for prettifying the content. |

#### Returns

`Promise`\< `void` \>

`true` if the path is valid, else `false` if not.

#### Example

```js
import { saveFile } from '@graphql-markdown/utils/fs';

await saveFile("./.temp/local.md", "foobar")

// Created .temp folder if it does not exists, and save data into local.md
```

#### Defined In

[fs.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L85)
