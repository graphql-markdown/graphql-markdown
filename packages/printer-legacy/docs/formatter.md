# formatter

Formatter factories for GraphQL documentation output.

Provides factory functions to create formatters for different output targets.
The default formatter produces HTML-like markup suitable for most Markdown processors.

## Functions

### createDefaultFormatter()

```ts
function createDefaultFormatter(): Formatter;
```

Defined in: [printer-legacy/src/formatter.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/formatter.ts#L45)

Creates a default formatter for documentation output.

The default formatter produces HTML-like markup with CSS classes
that can be styled with custom CSS. This is suitable for most
Markdown processors that support inline HTML.

#### Returns

`Formatter`

A complete Formatter implementation

#### Example

```typescript
import { createDefaultFormatter } from "@graphql-markdown/printer-legacy";

const formatter = createDefaultFormatter();
const badge = formatter.formatMDXBadge({ text: "Required" });
```
