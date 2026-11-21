# escape

Escaping helpers for values interpolated into generated markup.

Each helper encodes a value for one output context. They are internal to
the formatters package and are not part of the public API.

## Functions

### escapeHTMLAttribute()

```ts
function escapeHTMLAttribute(value): string;
```

Defined in: [escape.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/escape.ts#L21)

Escapes a value for use inside a double-quoted HTML attribute or an MDX/JSX
string attribute. Both contexts decode character references, so the encoded
value is read back unchanged while quotes, angle brackets, and curly braces
cannot end the attribute or start markup. `&` is encoded first so that the
other replacements are not double-encoded.

#### Parameters

##### value

`string`

Raw value to escape

#### Returns

`string`

Value with HTML-significant characters replaced by character references

---

### escapeMarkdownURL()

```ts
function escapeMarkdownURL(value): string;
```

Defined in: [escape.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/escape.ts#L41)

Percent-encodes characters that could end a Markdown link destination or
start markup when the value is written as plain text. Whitespace is encoded
as well, which keeps the value a single link destination. ASCII characters
are encoded as `%XX` with uppercase hex; non-ASCII whitespace is encoded as
UTF-8 percent sequences.

#### Parameters

##### value

`string`

Raw value to escape

#### Returns

`string`

Value with Markdown-significant characters percent-encoded
