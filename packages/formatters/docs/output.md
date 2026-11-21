# output

Output helpers for formatter lifecycle hooks.

Hooks post-process pages the renderer has already written, so they must go
through the same destination the renderer used. Reaching for the filesystem
directly works only as long as the default adapter is in play, and silently
misses every page when the output is redirected elsewhere.

## Functions

### createInternalLinksRewriter()

```ts
function createInternalLinksRewriter(
  extension?,
): (content, filePath, outputDir, baseURL, linkRoot?, knownDocPaths?) => string;
```

Defined in: [output.ts:183](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/output.ts#L183)

Creates a rewriter turning absolute generated doc links into page-relative ones.

#### Parameters

##### extension?

`string`

Page extension to resolve targets with (defaults to `.md`)

#### Returns

A rewrite function usable with [rewriteRenderedPage](#rewriterenderedpage)

(`content`, `filePath`, `outputDir`, `baseURL`, `linkRoot?`, `knownDocPaths?`) => `string`

---

### readOptionalOutput()

```ts
function readOptionalOutput(
  filePath,
  outputAdapter,
): Promise<string | undefined>;
```

Defined in: [output.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/output.ts#L87)

Reads a file the formatter maintains itself, where absence is expected.

Unlike [readOutput](#readoutput) this reports nothing when there is no content: a
navigation or metadata file legitimately does not exist until the formatter
creates it on the first page of a directory.

#### Parameters

##### filePath

`string`

Path of the file to read

##### outputAdapter

`Maybe`&lt;`OutputAdapter`&gt;

Adapter carried by the hook event, if any

#### Returns

`Promise`&lt;`string` \| `undefined`&gt;

The file content, or `undefined` when there is none

---

### readOutput()

```ts
function readOutput(filePath, outputAdapter): Promise<string | undefined>;
```

Defined in: [output.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/output.ts#L55)

Reads back a page the renderer has written, through its output destination.

The page was just written, so nothing coming back means the destination
cannot be read - a write-only adapter, a stubbed `readFile`, or a store that
is not read-your-writes consistent. Post-processing cannot run without it,
which is reported rather than silently skipped.

#### Parameters

##### filePath

`string`

Path of the generated page

##### outputAdapter

`Maybe`&lt;`OutputAdapter`&gt;

Adapter carried by the hook event, if any

#### Returns

`Promise`&lt;`string` \| `undefined`&gt;

The page content, or `undefined` if it cannot be read back

#### Throws

An error the first time this adapter cannot read a page back, so the
skipped post-processing surfaces once instead of once per page.

---

### rewriteRenderedPage()

```ts
function rewriteRenderedPage(event, rewrite): Promise<void>;
```

Defined in: [output.ts:126](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/output.ts#L126)

Rewrites the content of a page a formatter has just rendered.

The read-modify-write around an `afterRenderTypeEntities` hook is identical
for every preset that post-processes its own output; only the rewriting
differs. Presets supply that and nothing else.

#### Parameters

##### event

`unknown`

The hook event, carrying the page path and its destination

##### rewrite

(`content`, `filePath`, `outputDir`, `baseURL`, `linkRoot?`, `knownDocPaths?`) => `string`

Returns the new content, or the content unchanged to skip

#### Returns

`Promise`&lt;`void`&gt;

---

### writeOutput()

```ts
function writeOutput(filePath, content, outputAdapter, dirPath?): Promise<void>;
```

Defined in: [output.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/output.ts#L101)

Writes a file through the output destination, creating its directory first.

#### Parameters

##### filePath

`string`

Path of the file to write

##### content

`string`

File content

##### outputAdapter

`Maybe`&lt;`OutputAdapter`&gt;

Adapter carried by the hook event, if any

##### dirPath?

`string`

#### Returns

`Promise`&lt;`void`&gt;
