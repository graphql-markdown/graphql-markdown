# url

Alias `path.posix` to normalize URL handling on Windows.

## Interfaces

### RelativeGeneratedDocLinkOptions

Defined in: [url.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L15)

#### Properties

##### baseURL

```ts
baseURL: string;
```

Defined in: [url.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L16)

##### currentFilePath

```ts
currentFilePath: string;
```

Defined in: [url.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L17)

##### extension?

```ts
optional extension?: string;
```

Defined in: [url.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L18)

##### outputDir

```ts
outputDir: string;
```

Defined in: [url.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L19)

##### targetUrlPath

```ts
targetUrlPath: string;
```

Defined in: [url.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L20)

## Functions

### toRelativeGeneratedDocLink()

```ts
function toRelativeGeneratedDocLink(__namedParameters): string | undefined;
```

Defined in: [url.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/url.ts#L34)

Converts a generated absolute GraphQL-Markdown doc URL into a page-relative file path.
Returns `undefined` when the target URL does not belong to the configured `baseURL`.

#### Parameters

##### \_\_namedParameters

[`RelativeGeneratedDocLinkOptions`](#relativegenerateddoclinkoptions)

#### Returns

`string` \| `undefined`
