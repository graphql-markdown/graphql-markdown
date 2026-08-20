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

### MARKDOWN_CODE_INDENTATION

```ts
const MARKDOWN_CODE_INDENTATION: "  ";
```

Defined in: utils/dist/markdown.d.ts:25

Standard indentation for code blocks (2 spaces).

---

### MARKDOWN_EOC

```ts
const MARKDOWN_EOC: "\n``\n";
```

Defined in: [printer-legacy/src/const/strings.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L46)

Helper for inserting the code-block end delimiter in generated Markdown.

---

### MARKDOWN_EOL

```ts
const MARKDOWN_EOL: "\n";
```

Defined in: utils/dist/markdown.d.ts:9

End of line character for Markdown.

---

### MARKDOWN_EOP

```ts
const MARKDOWN_EOP: string;
```

Defined in: utils/dist/markdown.d.ts:13

End of paragraph (double newline) for Markdown.

---

### MARKDOWN_SOC

```ts
const MARKDOWN_SOC: "\n``graphql\n";
```

Defined in: [printer-legacy/src/const/strings.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L50)

Helper for inserting the code-block start delimiter targeting GraphQL syntax.

---

### NO_DESCRIPTION_TEXT

```ts
const NO_DESCRIPTION_TEXT: "No description";
```

Defined in: [printer-legacy/src/const/strings.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L43)

Default placeholder when no schema description is provided.

---

### NON_NULL

```ts
const NON_NULL: "non-null";
```

Defined in: [printer-legacy/src/const/strings.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L37)

Copy fragment describing a non-null GraphQL modifier.

---

### ROOT_TYPE_LOCALE

```ts
const ROOT_TYPE_LOCALE: RootTypeLocale;
```

Defined in: [printer-legacy/src/const/strings.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L19)

Human-readable labels for each GraphQL root type used when rendering copy or badges.
