# fs

Library of helper functions for handling files and folders.

## Variables

### fsOutputAdapter

```ts
const fsOutputAdapter: OutputAdapter;
```

Defined in: [fs.ts:124](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L124)

The default output destination: the local filesystem.

Used whenever no custom `outputAdapter` is configured, so the out-of-the-box
behaviour is unchanged. Content arrives already prettified - prettifying is
the renderer's job, not the destination's.

#### Example

```js
import { fsOutputAdapter } from "@graphql-markdown/utils/fs";

await fsOutputAdapter.writeFile("./docs/api/query.md", "# Query");
```

## Functions

### ensureDir()

```ts
function ensureDir(location, options?): Promise<void>;
```

Defined in: [fs.ts:61](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L61)

Asynchronously create a folder structure if it does not exist.

#### Parameters

##### location

`string`

folder structure in path format.

##### options?

`EnsureDirOptions`

#### Returns

`Promise`&lt;`void`&gt;

#### Example

```js
import { ensureDir } from "@graphql-markdown/utils/fs";

await ensureDir("./.temp/local");

// Creates both folders if they do not exists.
```

---

### fileExists()

```ts
function fileExists(location): Promise<boolean>;
```

Defined in: [fs.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L36)

Asynchronously check if a file or folder exists at the path location.

#### Parameters

##### location

`string`

file or folder location.

#### Returns

`Promise`&lt;`boolean`&gt;

`true` if the path is valid, else `false` if not.

#### Example

```js
import { fileExists } from "@graphql-markdown/utils/fs";

await fileExists("./.temp/local");

// Expected true if path is valid, false if not
```

---

### saveFile()

```ts
function saveFile(location, content, prettify?): Promise<void>;
```

Defined in: [fs.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/fs.ts#L98)

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

`Promise`&lt;`void`&gt;

`true` if the path is valid, else `false` if not.

#### Example

```js
import { saveFile } from "@graphql-markdown/utils/fs";

await saveFile("./.temp/local.md", "foobar");

// Created .temp folder if it does not exists, and save data into local.md
```
