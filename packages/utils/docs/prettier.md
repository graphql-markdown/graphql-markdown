# Module: prettier

Internal library for prettifying files using `prettier`.

## Functions

### prettify()

```ts
prettify(content, parser): Promise< string | undefined >
```

Prettify a string using [prettier.format](https://prettier.io/docs/en/api#prettierformatsource-options).

#### Remarks

This function logs a warning message on error.

#### See

https://prettier.io/docs/en/options#parser for the list of parsers.

#### Parameters

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `content` | `string` | the string to be prettified.  |
| `parser`  | `string` | the `prettier` parser to use. |

#### Returns

`Promise`\< `string` \| `undefined` \>

a prettified string, or undefined if an error occurred.

#### Source

[packages/utils/src/prettier.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L29)

---

### prettifyJavascript()

```ts
prettifyJavascript(content): Promise< string | undefined >
```

Prettify a Javascript string using [prettify](prettier.md#prettify) and `babel` parser.

#### Remarks

Same as `prettify(content, "babel")`.

#### See

[prettify](prettier.md#prettify)

#### Parameters

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `content` | `string` | the string to be prettified. |

#### Returns

`Promise`\< `string` \| `undefined` \>

a prettified string, or undefined if an error occurred.

#### Source

[packages/utils/src/prettier.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L78)

---

### prettifyMarkdown()

```ts
prettifyMarkdown(content): Promise< string | undefined >
```

Prettify a Markdown string using [prettify](prettier.md#prettify) and `markdown` parser.

#### Remarks

Same as `prettify(content, "markdown")`.

#### See

[prettify](prettier.md#prettify)

#### Parameters

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `content` | `string` | the string to be prettified. |

#### Returns

`Promise`\< `string` \| `undefined` \>

a prettified string, or undefined if an error occurred.

#### Source

[packages/utils/src/prettier.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L57)
