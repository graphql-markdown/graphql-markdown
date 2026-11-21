# url

Alias `path.posix` to normalize URL handling on Windows.

## Interfaces

### RelativeGeneratedDocLinkOptions

Defined in: [url.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L16)

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [url.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L17)

##### currentFilePath

```ts
currentFilePath: string;
```

Defined in: [url.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L18)

##### extension?

```ts
extension?: string;
```

Defined in: [url.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L19)

##### knownDocPaths?

```ts
knownDocPaths?: ReadonlySet<string>;
```

Defined in: [url.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L23)

Root-level generated doc paths (without extensions), known before they are written.

##### linkRoot?

```ts
linkRoot?: string;
```

Defined in: [url.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L21)

Optional URL prefix (e.g. `/docs`) the printer puts before generated paths.

##### outputDir

```ts
outputDir: string;
```

Defined in: [url.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L24)

##### targetUrlPath

```ts
targetUrlPath: string;
```

Defined in: [url.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L25)

## Functions

### toRelativeGeneratedDocLink()

```ts
function toRelativeGeneratedDocLink(__namedParameters): string | undefined;
```

Defined in: [url.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L91)

Converts a generated absolute GraphQL-Markdown doc URL into a page-relative file path.
Returns `undefined` when the target URL does not belong to the configured `baseURL`.

#### Parameters

##### \_\_namedParameters

[`RelativeGeneratedDocLinkOptions`](#relativegenerateddoclinkoptions)

#### Returns

`string` \| `undefined`
