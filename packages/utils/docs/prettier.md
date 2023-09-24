# Module: prettier

Internal library for prettifying files using `prettier`.

## Functions

### prettify

```ts
prettify(content, parser): Promise< undefined | string >
```

Prettify a string using [prettier.format](https://prettier.io/docs/en/api#prettierformatsource-options).

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | the string to be prettified. |
| `parser` | `string` | the `prettier` parser to use. |

#### Returns

`Promise`\< `undefined` \| `string` \>

a prettified string, or undefined if an error occurred.

#### Source

[prettier.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L27)

#### Remarks

This function logs a warning message on error.

#### See

https://prettier.io/docs/en/options#parser for the list of parsers.

***

### prettifyJavascript

```ts
prettifyJavascript(content): Promise< undefined | string >
```

Prettify a Javascript string using [prettify](prettier.md#prettify) and `babel` parser.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | the string to be prettified. |

#### Returns

`Promise`\< `undefined` \| `string` \>

a prettified string, or undefined if an error occurred.

#### Source

[prettier.ts:80](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L80)

#### Remarks

Same as `prettify(content, "babel")`.

#### See

[prettify](prettier.md#prettify)

***

### prettifyMarkdown

```ts
prettifyMarkdown(content): Promise< undefined | string >
```

Prettify a Markdown string using [prettify](prettier.md#prettify) and `markdown` parser.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | the string to be prettified. |

#### Returns

`Promise`\< `undefined` \| `string` \>

a prettified string, or undefined if an error occurred.

#### Source

[prettier.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L59)

#### Remarks

Same as `prettify(content, "markdown")`.

#### See

[prettify](prettier.md#prettify)
