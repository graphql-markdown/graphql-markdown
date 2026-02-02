# printer

GraphQL Schema Printer Module

This module provides functionality for printing GraphQL schema types into Markdown documentation.
It includes utilities for handling various GraphQL types, custom directives, and formatting options.

## Classes

### Printer

Defined in: [printer-legacy/src/printer.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L105)

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

##### mdxDeclaration

```ts
static mdxDeclaration: Readonly<Maybe<string>>;
```

Defined in: [printer-legacy/src/printer.ts:129](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L129)

Prints mdx modules import declaration

##### options

```ts
static options: Readonly<Maybe<PrintTypeOptions>>;
```

Defined in: [printer-legacy/src/printer.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L109)

Global printer configuration options

##### printCustomDirectives()

```ts
readonly static printCustomDirectives: (type, options) => string;
```

Defined in: [printer-legacy/src/printer.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L119)

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

`string`

Markdown string containing all formatted directives

##### printCustomTags()

```ts
readonly static printCustomTags: (type, options) => string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:124](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L124)

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

##### printDescription()

```ts
readonly static printDescription: (type, options, noText?) => string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L114)

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

#### Methods

##### init()

```ts
static init(
   schema,
   baseURL,
   linkRoot,
   options,
   formatter?,
   mdxDeclaration?): Promise<void>;
```

Defined in: [printer-legacy/src/printer.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L140)

Initializes the printer with the given schema and configuration.

###### Parameters

###### schema

`Maybe`&lt;`GraphQLSchema`&gt;

GraphQL schema to generate documentation for

###### baseURL

`Maybe`&lt;`string`&gt; = `"schema"`

Base URL path for documentation, e.g. '/docs'

###### linkRoot

`Maybe`&lt;`string`&gt; = `"/"`

Root path for generating links between types

###### options

Configuration options for the printer

###### customDirectives?

`CustomDirectiveMap`

###### deprecated?

`TypeDeprecatedOption`

###### groups?

`Partial`&lt;`Record`&lt;`SchemaEntity`, `Record`&lt;`string`, `Maybe`&lt;`string`&gt;&gt;&gt;&gt;

###### meta?

`Maybe`&lt;`MetaInfo`&gt;

###### metatags?

`Record`&lt;`string`, `string`&gt;[]

###### onlyDocDirectives?

`GraphQLDirective`[]

###### printTypeOptions?

`PrinterConfigPrintTypeOptions`

###### skipDocDirectives?

`GraphQLDirective`[]

###### formatter?

`Partial`&lt;`Formatter`&gt;

Optional formatter functions for customizing output format

###### mdxDeclaration?

`Maybe`&lt;`string`&gt;

###### Returns

`Promise`&lt;`void`&gt;

##### printCode()

```ts
readonly static printCode(type, options): string;
```

Defined in: [printer-legacy/src/printer.ts:233](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L233)

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

##### printExample()

```ts
readonly static printExample(type, options): string;
```

Defined in: [printer-legacy/src/printer.ts:282](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L282)

Prints example usage of the type if available

###### Parameters

###### type

`unknown`

GraphQL type to generate example for

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string`

Formatted example section string or empty string if no example

##### printHeader()

```ts
readonly static printHeader(
   id,
   title,
   options): string;
```

Defined in: [printer-legacy/src/printer.ts:212](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L212)

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

Defined in: [printer-legacy/src/printer.ts:364](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L364)

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

Defined in: [printer-legacy/src/printer.ts:347](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L347)

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
   options?): Maybe<MDXString>;
```

Defined in: [printer-legacy/src/printer.ts:410](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L410)

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

`Maybe`&lt;`MDXString`&gt;

Complete documentation as MDX string or undefined if type should be skipped

###### Example

```typescript
const doc = Printer.printType("User", UserType, {
  frontMatter: true,
  codeSection: true,
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

##### printTypeMetadata()

```ts
readonly static printTypeMetadata(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/printer.ts:311](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L311)

Prints metadata information for a GraphQL type

###### Parameters

###### type

`unknown`

GraphQL type to print metadata for

###### options

`PrintTypeOptions`

Printer configuration options

###### Returns

`string` \| `MDXString`

Formatted metadata string as MDX or plain string

###### Throws

When type is not supported
