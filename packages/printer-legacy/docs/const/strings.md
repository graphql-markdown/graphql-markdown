# const/strings

String constants and helpers shared by the legacy printer when composing
Markdown fragments for GraphQL schemas.

## Variables

### DEPRECATED

```ts
const DEPRECATED: "deprecated";
```

Defined in: [printer-legacy/src/const/strings.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L36)

Label used when a schema element is flagged as deprecated.

---

### FRONT_MATTER_DELIMITER

```ts
const FRONT_MATTER_DELIMITER: "---";
```

Defined in: utils/dist/markdown.d.ts:17

Frontmatter delimiter for YAML frontmatter blocks.

---

### GRAPHQL

```ts
const GRAPHQL: "graphql";
```

Defined in: [printer-legacy/src/const/strings.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L42)

Short identifier for the GraphQL language tag used in fenced blocks.

---

### MARKDOWN_CODE_INDENTATION

```ts
const MARKDOWN_CODE_INDENTATION: "  ";
```

Defined in: utils/dist/markdown.d.ts:25

Standard indentation for code blocks (2 spaces).

---

### MARKDOWN_CODE_SNIPPET

```ts
const MARKDOWN_CODE_SNIPPET: "``";
```

Defined in: utils/dist/markdown.d.ts:21

Code snippet delimiter for fenced code blocks.

---

### MARKDOWN_EOC

```ts
const MARKDOWN_EOC: "\n``\n";
```

Defined in: [printer-legacy/src/const/strings.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L48)

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

Defined in: [printer-legacy/src/const/strings.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L52)

Helper for inserting the code-block start delimiter targeting GraphQL syntax.

---

### NO_DESCRIPTION_TEXT

```ts
const NO_DESCRIPTION_TEXT: "No description";
```

Defined in: [printer-legacy/src/const/strings.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L45)

Default placeholder when no schema description is provided.

---

### NON_NULL

```ts
const NON_NULL: "non-null";
```

Defined in: [printer-legacy/src/const/strings.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L39)

Copy fragment describing a non-null GraphQL modifier.

---

### ROOT_TYPE_LOCALE

```ts
const ROOT_TYPE_LOCALE: RootTypeLocale;
```

Defined in: [printer-legacy/src/const/strings.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/strings.ts#L21)

Human-readable labels for each GraphQL root type used when rendering copy or badges.
