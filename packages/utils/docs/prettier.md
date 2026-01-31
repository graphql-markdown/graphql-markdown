# prettier

Internal library for prettifying files using `prettier`.

## Functions

### prettify()

```ts
function prettify(content, parser): Promise<string | undefined>;
```

Defined in: [prettier.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L25)

**`Internal`**

Prettify a string using

#### Parameters

##### content

`string`

the string to be prettified.

##### parser

`string`

the `prettier` parser to use.

#### Returns

`Promise`&lt;`string` \| `undefined`&gt;

a prettified string, or `undefined` if an error occurred.

#### See

- [prettier.format](https://prettier.io/docs/en/api#prettierformatsource-options)
- [Prettier doc for the list of parsers](https://prettier.io/docs/en/options#parser)

#### Remarks

This function logs a warning message on error.

---

### prettifyMarkdown()

```ts
function prettifyMarkdown(content): Promise<string | undefined>;
```

Defined in: [prettier.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/prettier.ts#L67)

**`Internal`**

Prettify a Markdown string using [prettify](#prettify) and `markdown` parser.

#### Parameters

##### content

`string`

the string to be prettified.

#### Returns

`Promise`&lt;`string` \| `undefined`&gt;

a prettified string, or `undefined` if an error occurred.

#### Remarks

Same as `prettify(content, "mdx")`.

#### See

[prettify](#prettify)
