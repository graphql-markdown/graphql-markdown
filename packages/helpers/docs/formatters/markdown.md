# formatters/markdown

Shared markdown-oriented helpers used by formatter presets.

## Functions

### appendExtensionToAbsolutePathWithoutExtension()

```ts
function appendExtensionToAbsolutePathWithoutExtension(url, extension): string;
```

Defined in: [formatters/markdown.ts:159](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L159)

Appends an extension only when URL is an absolute path without a file extension.

Fragment-only and already suffixed paths are returned unchanged.

#### Parameters

##### url

`string`

Link URL to evaluate.

##### extension

`string`

Extension suffix to append when eligible.

#### Returns

`string`

Updated or original URL depending on path shape.

---

### appendLinkExtension()

```ts
function appendLinkExtension(url, extension): string;
```

Defined in: [formatters/markdown.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L146)

Appends an extension to a link URL.

#### Parameters

##### url

`string`

Link URL to update.

##### extension

`string`

Extension suffix (for example `.mdx`).

#### Returns

`string`

URL with appended extension.

---

### extractFrontmatterTitle()

```ts
function extractFrontmatterTitle(formatted): string;
```

Defined in: [formatters/markdown.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L64)

Extracts a title value from pre-formatted frontmatter lines.

#### Parameters

##### formatted

`string`[] \| `null` \| `undefined`

Serialized frontmatter lines without delimiters.

#### Returns

`string`

Parsed title value, or an empty string when no `title:` line exists.

---

### formatMarkdownFrontmatter()

```ts
function formatMarkdownFrontmatter(formatted, delimiter?, eol?): string;
```

Defined in: [formatters/markdown.ts:127](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L127)

Formats a markdown frontmatter block from preformatted lines.

#### Parameters

##### formatted

`string`[] \| `null` \| `undefined`

Serialized frontmatter lines without delimiters.

##### delimiter?

`string` = `"---"`

Frontmatter delimiter marker.

##### eol?

`string` = "\n"

End-of-line separator.

#### Returns

`string`

Complete frontmatter block or an empty string when input is absent.

---

### indentMarkdownLines()

```ts
function indentMarkdownLines(text, spaces, eol?): string;
```

Defined in: [formatters/markdown.ts:178](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L178)

Indents non-empty markdown lines by a fixed amount of spaces.

#### Parameters

##### text

`string`

Multiline markdown block to indent.

##### spaces

`number`

Number of spaces to prepend to non-empty lines.

##### eol?

`string` = "\n"

Line separator used to split and join lines.

#### Returns

`string`

Indented multiline string.

---

### mergeFrontmatterLines()

```ts
function mergeFrontmatterLines(props, formatted): string[];
```

Defined in: [formatters/markdown.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L84)

Merges frontmatter object entries with preformatted frontmatter lines.

Preformatted lines take precedence over object values when keys overlap.
Lines without a `key: value` shape and comment lines are ignored.

#### Parameters

##### props

`Record`&lt;`string`, `unknown`&gt; \| `null` \| `undefined`

Frontmatter key-value object.

##### formatted

`string`[] \| `null` \| `undefined`

Serialized frontmatter lines without delimiters.

#### Returns

`string`[]

Merged frontmatter lines in insertion order.

---

### parseFrontmatterTitleLine()

```ts
function parseFrontmatterTitleLine(line): string;
```

Defined in: [formatters/markdown.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L34)

Parses a YAML-like frontmatter title line and returns its string value.

Accepts unquoted values (`title: My Title`) and quoted values
(`title: "My Title"` or `title: 'My Title'`).

#### Parameters

##### line

`string`

Candidate frontmatter line.

#### Returns

`string`

Parsed title value, or an empty string when the line is not a title.

---

### quoteMarkdownLines()

```ts
function quoteMarkdownLines(text, eol?): string;
```

Defined in: [formatters/markdown.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/formatters/markdown.ts#L16)

Prefixes each line with a Markdown blockquote marker.

#### Parameters

##### text

`string`

Multiline text to transform into blockquote content.

##### eol?

`string` = "\n"

Line separator used to split and join lines.

#### Returns

`string`

Text where every line starts with `> `.
