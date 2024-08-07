# prettier

Internal library for prettifying files using `prettier`.

## Functions

### prettify()

```ts
function prettify(content, parser): Promise<undefined | string>
```

Prettify a string using [prettier.format](https://prettier.io/docs/en/api#prettierformatsource-options).

#### Parameters

• **content**: `string`

the string to be prettified.

• **parser**: `string`

the `prettier` parser to use.

#### Returns

`Promise`\<`undefined` \| `string`\>

a prettified string, or undefined if an error occurred.

#### Remarks

This function logs a warning message on error.

#### See

https://prettier.io/docs/en/options#parser for the list of parsers.

#### Defined in

[prettier.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L29)

***

### prettifyMarkdown()

```ts
function prettifyMarkdown(content): Promise<undefined | string>
```

Prettify a Markdown string using [prettify](prettier.md#prettify) and `markdown` parser.

#### Parameters

• **content**: `string`

the string to be prettified.

#### Returns

`Promise`\<`undefined` \| `string`\>

a prettified string, or undefined if an error occurred.

#### Remarks

Same as `prettify(content, "markdown")`.

#### See

[prettify](prettier.md#prettify)

#### Defined in

[prettier.ts:61](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L61)
