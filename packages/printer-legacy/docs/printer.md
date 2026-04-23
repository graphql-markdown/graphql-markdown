# printer

GraphQL Schema Printer Module

This module provides functionality for printing GraphQL schema types into Markdown documentation.
It includes utilities for handling various GraphQL types, custom directives, and formatting options.

## Classes

### Printer

Defined in: [printer-legacy/src/printer.ts:171](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L171)

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

##### printCustomDirectives

```ts
readonly static printCustomDirectives: (type, options) => Maybe<PageSection>;
```

Defined in: [printer-legacy/src/printer.ts:180](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L180)

Prints custom directives

Prints all custom directives for a type as a Markdown section

###### Parameters

###### type

`unknown`

The GraphQL type to print directives for

###### options

`PrintTypeOptions`

General printing options

###### Returns

`Maybe`&lt;[`PageSection`](events.md#pagesection)&gt;

A "Directives" PageSection, or undefined when no directives are printable

##### printCustomTags

```ts
readonly static printCustomTags: (type, options) => string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:185](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L185)

Prints custom tags

Prints custom directive tags as Markdown badges

###### Parameters

###### type

`unknown`

The GraphQL type to print tags for

###### options

`PrintTypeOptions`

General printing options

###### Returns

`string` \| `MDXString`

Formatted Markdown string of badges or empty string

##### printDescription

```ts
readonly static printDescription: (type, options, noText?) => string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:175](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L175)

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

##### deprecatedOptions

###### Get Signature

```ts
get static deprecatedOptions(): Readonly<Maybe<DeprecatedPrintTypeOptions>>;
```

Defined in: [printer-legacy/src/printer.ts:209](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L209)

Backward-compat section toggles extracted from legacy config options.

These flags are applied only during section order composition.

###### Returns

`Readonly`&lt;`Maybe`&lt;`DeprecatedPrintTypeOptions`&gt;&gt;

##### eventEmitter

###### Get Signature

```ts
get static eventEmitter(): Maybe<PrinterEventEmitter>;
```

Defined in: [printer-legacy/src/printer.ts:218](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L218)

Optional event emitter for print events.
When set, the printer will emit events before/after printCode and printType,
allowing external code to intercept and modify the output.

###### Returns

`Maybe`&lt;`PrinterEventEmitter`&gt;

###### Set Signature

```ts
set static eventEmitter(eventEmitter): void;
```

Defined in: [printer-legacy/src/printer.ts:233](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L233)

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

Defined in: [printer-legacy/src/printer.ts:225](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L225)

Prints mdx modules import declaration

###### Returns

`Readonly`&lt;`Maybe`&lt;`string`&gt;&gt;

###### Set Signature

```ts
set static mdxDeclaration(mdxDeclaration): void;
```

Defined in: [printer-legacy/src/printer.ts:237](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L237)

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

Defined in: [printer-legacy/src/printer.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L200)

Global printer configuration options

###### Returns

`Readonly`&lt;`Maybe`&lt;`PrintTypeOptions`&gt;&gt;

###### Set Signature

```ts
set static options(options): void;
```

Defined in: [printer-legacy/src/printer.ts:229](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L229)

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
   eventEmitter?): Promise<void>;
```

Defined in: [printer-legacy/src/printer.ts:252](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L252)

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

##### printCode()

```ts
readonly static printCode(type, options): string;
```

Defined in: [printer-legacy/src/printer.ts:362](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L362)

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
   options): Promise<string>;
```

Defined in: [printer-legacy/src/printer.ts:418](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L418)

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

Defined in: [printer-legacy/src/printer.ts:463](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L463)

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
   options): string;
```

Defined in: [printer-legacy/src/printer.ts:341](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L341)

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

Defined in: [printer-legacy/src/printer.ts:536](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L536)

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

Defined in: [printer-legacy/src/printer.ts:522](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L522)

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

##### printType()

```ts
readonly static printType(
   name,
   type,
   options?): Promise<Maybe<MDXString>>;
```

Defined in: [printer-legacy/src/printer.ts:586](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L586)

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

Defined in: [printer-legacy/src/printer.ts:486](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L486)

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
