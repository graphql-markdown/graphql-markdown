# printer

## Functions

### getPrinter()

```ts
function getPrinter(
   printerModule?, 
   config?, 
   options?, 
mdxModule?): Promise<typeof IPrinter>
```

Defined in: [printer.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/printer.ts#L60)

Loads and initializes a printer module for GraphQL schema documentation.

This function dynamically imports the specified printer module and initializes it
with the provided configuration and options. The printer is responsible for rendering
GraphQL schema documentation in the desired format.

#### Parameters

##### printerModule?

`Maybe`\<`PackageName`\>

The name/path of the printer module to load

##### config?

`Maybe`\<`PrinterConfig`\>

Configuration for the printer including schema, baseURL, and linkRoot

##### options?

`Maybe`\<`PrinterOptions`\>

Additional options for customizing the printer's behavior

##### mdxModule?

`unknown`

Optional MDX module for MDX-specific functionality

#### Returns

`Promise`\<*typeof* `IPrinter`\>

A promise that resolves to the initialized Printer instance

#### Throws

Will throw an error if printerModule is not a string

#### Throws

Will throw an error if config is not provided

#### Throws

Will throw an error if the module specified by printerModule cannot be found

#### Example

```typescript
import { getPrinter } from '@graphql-markdown/core';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const printer = await getPrinter(
  '@graphql-markdown/printer-legacy',
  {
    schema,
    baseURL: '/docs',
    linkRoot: 'graphql'
  },
  {
    printTypeOptions: { includeDeprecationReasons: true }
  }
);

const output = printer.printSchema();
```
