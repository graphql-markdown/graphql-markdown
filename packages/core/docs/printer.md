# printer

Printer loader helpers for bootstrapping GraphQL-Markdown renderers.

## Functions

### getPrinter()

```ts
function getPrinter(
  config?,
  options?,
  formatter?,
  mdxDeclaration?,
  eventEmitter?,
): Promise<typeof IPrinter>;
```

Defined in: [core/src/printer.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/printer.ts#L65)

Loads and initializes a printer module for GraphQL schema documentation.

This function resolves the specified printer module and initializes it
with the provided configuration and options. The printer is responsible for rendering
GraphQL schema documentation in the desired format.

#### Parameters

##### config?

`Maybe`&lt;`PrinterConfig`&gt;

Configuration for the printer including schema, baseURL, and linkRoot

##### options?

`Maybe`&lt;`PrinterOptions`&gt;

Additional options for customizing the printer's behavior

##### formatter?

`Partial`&lt;`Formatter`&gt;

Optional formatter functions for customizing output format (e.g., MDX)

##### mdxDeclaration?

`Maybe`&lt;`string`&gt;

##### eventEmitter?

`Maybe`&lt;`PrinterEventEmitter`&gt;

#### Returns

`Promise`&lt;_typeof_ `IPrinter`&gt;

A promise that resolves to the initialized Printer instance

#### Throws

Will throw an error if config is not provided

#### Example

```typescript
import { getPrinter } from "@graphql-markdown/core";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const printer = await getPrinter(
  {
    schema,
    baseURL: "/docs",
    linkRoot: "graphql",
  },
  {
    printTypeOptions: { deprecated: "group" },
  },
);

const queryType = schema.getQueryType();
if (queryType) {
  const output = await printer.printType("Query", queryType);
}
```
