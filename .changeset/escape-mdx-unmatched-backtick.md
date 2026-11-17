---
"@graphql-markdown/utils": patch
---

Security fix (GHSA-x2g8-7ch4-h792): MDX special characters in schema descriptions are now always escaped outside real code. Before, a single unmatched backtick turned escaping off for the text before it, letting a schema author inject raw HTML or MDX into the generated pages. Code is now left unescaped only where Markdown is certain to parse it as code: inline code on a single line, and fenced code blocks starting at column 0 after the first line. Anything ambiguous is escaped, so its special characters show as HTML entities: inline code that wraps onto a second line, sits on a line with `|` or a link, or follows an unmatched backtick, and fenced code blocks that are indented, use `~~~`, or open the description.
