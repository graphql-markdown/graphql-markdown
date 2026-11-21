# printer

GraphQL Schema Printer Module

This module provides functionality for printing GraphQL schema types into Markdown documentation.
It includes utilities for handling various GraphQL types, custom directives, and formatting options.

## Classes

### Printer

Defined in: [printer-legacy/src/printer.ts:182](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L182)

The Printer class implements the core functionality for generating Markdown documentation
from GraphQL schema types.

#### Remarks

This class provides static methods for rendering different components of the documentation:

- Headers and frontmatter
- Type descriptions and code blocks
- Custom directives and metadata
- Examples and relations

#### Example

```typescript
const printer = new Printer();
await printer.init(schema, "/docs", "graphql", options);
const docs = printer.printType("Query", queryType);
```

#### Implements

- `IPrinter`

#### Constructors

##### Constructor

```ts
new Printer(): Printer;
```

###### Returns

[`Printer`](#printer)

#### Properties

##### printDecorators

```ts
readonly static printDecorators: (type, options) => PageSections;
```

Defined in: [printer-legacy/src/printer.ts:191](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L191)

Prints predicate-driven decorators

Prints every decorator declared in the print options, excluding those
targeting a named slot (`position: { into }`) — those are not part of the
page's section order and are printed separately, into their slot.

Every declared decorator yields an entry, so that composition hooks can
restore one which rendered no content. Decorators with a reserved or
repeated id are dropped.

###### Parameters

###### type

`unknown`

the GraphQL type being printed.

###### options

`PrintTypeOptions`

the print options in effect.

###### Returns

[`PageSections`](events.md#pagesections)

a map of decorator id to rendered section, empty when none is declared.

##### printDescription

```ts
readonly static printDescription: (type, options, noText?) => string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:186](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L186)

Prints type descriptions

Prints the complete description for a GraphQL type, including deprecation warnings and custom directives.

###### Parameters

###### type

`unknown`

The GraphQL type to document

###### options

`PrintTypeOptions`

Configuration options for printing

###### noText?

`string`

Optional text to display when no description exists

###### Returns

`string` \| `MDXString`

Combined description, deprecation notices, and custom directives as MDX content

#### Accessors

##### eventEmitter

###### Get Signature

```ts
get static eventEmitter(): Maybe<PrinterEventEmitter>;
```

Defined in: [printer-legacy/src/printer.ts:211](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L211)

Optional event emitter for print events.
When set, the printer will emit events before/after printCode and printType,
allowing external code to intercept and modify the output.

###### Returns

`Maybe`&lt;`PrinterEventEmitter`&gt;

###### Set Signature

```ts
set static eventEmitter(eventEmitter): void;
```

Defined in: [printer-legacy/src/printer.ts:226](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L226)

###### Parameters

###### eventEmitter

`Maybe`&lt;`PrinterEventEmitter`&gt;

###### Returns

`void`

##### mdxDeclaration

###### Get Signature

```ts
get static mdxDeclaration(): Readonly<Maybe<string>>;
```

Defined in: [printer-legacy/src/printer.ts:218](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L218)

Prints mdx modules import declaration

###### Returns

`Readonly`&lt;`Maybe`&lt;`string`&gt;&gt;

###### Set Signature

```ts
set static mdxDeclaration(mdxDeclaration): void;
```

Defined in: [printer-legacy/src/printer.ts:230](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L230)

###### Parameters

###### mdxDeclaration

`Readonly`&lt;`Maybe`&lt;`string`&gt;&gt;

###### Returns

`void`

##### options

###### Get Signature

```ts
get static options(): Readonly<Maybe<PrintTypeOptions>>;
```

Defined in: [printer-legacy/src/printer.ts:202](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L202)

Global printer configuration options

###### Returns

`Readonly`&lt;`Maybe`&lt;`PrintTypeOptions`&gt;&gt;

###### Set Signature

```ts
set static options(options): void;
```

Defined in: [printer-legacy/src/printer.ts:222](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L222)

###### Parameters

###### options

`Readonly`&lt;`Maybe`&lt;`PrintTypeOptions`&gt;&gt;

###### Returns

`void`

#### Methods

##### init()

```ts
static init(
   schema,
   baseURL?,
   linkRoot?,
   options?,
   formatter?,
   mdxDeclaration?,
   eventEmitter?
): Promise<void>;
```

Defined in: [printer-legacy/src/printer.ts:245](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L245)

Initializes the printer with the given schema and configuration.

###### Parameters

###### schema

`Maybe`&lt;`GraphQLSchema`&gt;

GraphQL schema to generate documentation for

###### baseURL?

`Maybe`&lt;`string`&gt; = `"schema"`

Base URL path for documentation, e.g. '/docs'

###### linkRoot?

`Maybe`&lt;`string`&gt; = `"/"`

Root path for generating links between types

###### options?

`PrinterInitOptions` = `DEFAULT_INIT_OPTIONS`

Configuration options for the printer

###### formatter?

`Partial`&lt;`Formatter`&gt;

Optional formatter functions for customizing output format

###### mdxDeclaration?

`Maybe`&lt;`string`&gt;

Optional MDX import declaration

###### eventEmitter?

`Maybe`&lt;`PrinterEventEmitter`&gt;

Optional event emitter for print events interception

###### Returns

`Promise`&lt;`void`&gt;

##### printBadge()

```ts
readonly static printBadge(badge, options): MDXString;
```

Defined in: [printer-legacy/src/printer.ts:398](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L398)

Formats a single badge into MDX string format

###### Parameters

###### badge

`Badge`

Badge object containing text and optional classname

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`MDXString`

Formatted MDX string, using the configured formatter's
`formatMDXBadge` when set and falling back to the default formatter
otherwise

##### printCode()

```ts
readonly static printCode(type, options): string;
```

Defined in: [printer-legacy/src/printer.ts:351](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L351)

Prints the GraphQL type definition as code block

###### Parameters

###### type

`unknown`

GraphQL type to print

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string`

Formatted code block string with type definition

##### printCodeAsync()

```ts
readonly static printCodeAsync(
   type,
   typeName,
   options
): Promise<string>;
```

Defined in: [printer-legacy/src/printer.ts:423](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L423)

Prints the GraphQL type definition as code block with event emission support.

###### Parameters

###### type

`unknown`

GraphQL type to print

###### typeName

`string`

Name of the type being printed

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`Promise`&lt;`string`&gt;

Promise resolving to formatted code block string with type definition

###### Remarks

This async version emits events before and after code generation:

- `print:beforePrintCode` - Emitted before generating code (can modify inputs or prevent default)
- `print:afterPrintCode` - Emitted after generating code (can modify output)

Event handlers can:

- Modify `event.data.options` in BEFORE to affect code generation
- Call `event.preventDefault()` in BEFORE to skip default generation and provide custom output
- Modify `event.output` in AFTER to change the final result

##### printExample()

```ts
readonly static printExample(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/printer.ts:468](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L468)

Prints example usage of the type if available

###### Parameters

###### type

`unknown`

GraphQL type to generate example for

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`Maybe`&lt;[`PageSection`](events.md#pagesection)&gt;

Example page section or undefined when no example is available

##### printHeader()

```ts
readonly static printHeader(
   id,
   title,
   options
): string;
```

Defined in: [printer-legacy/src/printer.ts:312](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L312)

Prints the header section of a type documentation

###### Parameters

###### id

`string`

Unique identifier for the type

###### title

`string`

Display title for the type

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string`

Formatted header string with optional frontmatter

##### printMetaTags()

```ts
readonly static printMetaTags(_type, options): string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:529](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L529)

Prints HTML meta tags for the documentation

###### Parameters

###### \_type

`unknown`

GraphQL type (unused)

###### options

`PrintTypeOptions`

Printer configuration options containing metatags

###### Returns

`string` \| `MDXString`

Formatted HTML meta tags string

##### printRelations()

```ts
readonly static printRelations(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:515](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L515)

Prints related type information

###### Parameters

###### type

`unknown`

GraphQL type to find relations for

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string` \| `MDXString`

Formatted relations section as MDX or plain string

##### printTitle()

```ts
readonly static printTitle(title, options): string;
```

Defined in: [printer-legacy/src/printer.ts:337](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L337)

Prints the visible page title, using the formatter `formatMDXTitle`.

Independent of the frontmatter: frameworks that render the frontmatter
`title` themselves provide no `formatMDXTitle`, and nothing is printed.

###### Parameters

###### title

`string`

Display title for the type

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string`

Formatted page title, or an empty string

##### printType()

```ts
readonly static printType(
   name,
   type,
   options?
): Promise<Maybe<MDXString>>;
```

Defined in: [printer-legacy/src/printer.ts:579](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L579)

Main method to print complete documentation for a GraphQL type

###### Parameters

###### name

`Maybe`&lt;`string`&gt;

Name identifier for the type

###### type

`unknown`

GraphQL type to generate documentation for

###### options?

`Maybe`&lt;`Partial`&lt;`PrintTypeOptions`&gt;&gt;

Optional printer configuration options

###### Returns

`Promise`&lt;`Maybe`&lt;`MDXString`&gt;&gt;

Complete documentation as MDX string or undefined if type should be skipped

###### Example

```typescript
const doc = await Printer.printType("User", UserType, {
  frontMatter: true,
});
```

###### Remarks

The method combines multiple sections:

- Header with frontmatter
- Meta tags
- Description
- Code definition
- Custom directives
- Type metadata
- Example usage
- Related types

When an event emitter is configured, emits events:

- `print:beforePrintType` - Before generating documentation
- `print:beforeComposePageType` - Before composing section order and final page output
- `print:afterPrintType` - After generating documentation (output can be modified)

##### printTypeMetadata()

```ts
readonly static printTypeMetadata(type, options): Maybe<
  | PageSection
  | PageSection[]>;
```

Defined in: [printer-legacy/src/printer.ts:482](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L482)

Prints metadata information for a GraphQL type

###### Parameters

###### type

`unknown`

GraphQL type to print metadata for

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`Maybe`&lt;
\| [`PageSection`](events.md#pagesection)
\| [`PageSection`](events.md#pagesection)[]&gt;

Metadata section (or section list) for supported types, otherwise undefined
