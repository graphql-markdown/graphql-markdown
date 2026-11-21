# const/strings

String constants and helpers shared by the legacy printer when composing
Markdown fragments for GraphQL schemas.

## Variables

### DEPRECATED

```ts
const DEPRECATED: "deprecated";
```

Defined in: [printer-legacy/src/const/strings.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L34)

Label used when a schema element is flagged as deprecated.

---

### MARKDOWN\_CODE\_INDENTATION

```ts
const MARKDOWN_CODE_INDENTATION: "  ";
```

Defined in: utils/dist/markdown.d.ts:25

Standard indentation for code blocks (2 spaces).

---

### MARKDOWN\_EOL

```ts
const MARKDOWN_EOL: "\n";
```

Defined in: utils/dist/markdown.d.ts:9

End of line character for Markdown.

---

### MARKDOWN\_EOP

```ts
const MARKDOWN_EOP: string;
```

Defined in: utils/dist/markdown.d.ts:13

End of paragraph (double newline) for Markdown.

---

### NO\_DESCRIPTION\_TEXT

```ts
const NO_DESCRIPTION_TEXT: "No description";
```

Defined in: [printer-legacy/src/const/strings.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L43)

Default placeholder when no schema description is provided.

---

### NON\_NULL

```ts
const NON_NULL: "non-null";
```

Defined in: [printer-legacy/src/const/strings.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L37)

Copy fragment describing a non-null GraphQL modifier.

---

### ROOT\_TYPE\_LOCALE

```ts
const ROOT_TYPE_LOCALE: RootTypeLocale;
```

Defined in: [printer-legacy/src/const/strings.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L19)

Human-readable labels for each GraphQL root type used when rendering copy or badges.

## Functions

### printCodeBlock()

```ts
function printCodeBlock(code, language?): string;
```

Defined in: [printer-legacy/src/const/strings.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L54)

Wraps code in a fenced code block. The fence is longer than any run of
backticks in the code, so schema text inside cannot close it early.

#### Parameters

##### code

`string`

the code to wrap.

##### language?

`string` = `GRAPHQL`

the fence language, defaults to `graphql`.

#### Returns

`string`

the fenced code block, surrounded by line breaks.
