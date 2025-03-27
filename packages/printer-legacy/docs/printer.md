# printer

## Classes

### Printer

Defined in: [printer.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L72)

#### Example

```ts

```

#### Implements

- `IPrinter`

#### Constructors

##### Constructor

```ts
new Printer(): Printer
```

###### Returns

[`Printer`](#printer)

#### Properties

##### options

```ts
static options: Readonly<Maybe<PrintTypeOptions>>;
```

Defined in: [printer.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L73)

##### printCustomDirectives()

```ts
readonly static printCustomDirectives: (type, options) => string;
```

<<<<<<< Updated upstream
=======
Defined in: [printer.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L77)

Prints custom directives associated with a type

>>>>>>> Stashed changes
###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string`

<<<<<<< Updated upstream
###### Defined in
=======
###### Param

The GraphQL type to document

###### Param

Combined printer configuration and options

###### Returns

MDX string containing custom directives

###### Example
>>>>>>> Stashed changes

```

##### printCustomTags()

```ts
readonly static printCustomTags: (type, options) => string | MDXString;
```

<<<<<<< Updated upstream
=======
Defined in: [printer.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L79)

Prints custom tags associated with a type

>>>>>>> Stashed changes
###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string` \| `MDXString`

<<<<<<< Updated upstream
###### Defined in
=======
###### Param

The GraphQL type to document

###### Param

Combined printer configuration and options

###### Returns

MDX string containing custom tags

###### Example
>>>>>>> Stashed changes

```

##### printDescription()

```ts
readonly static printDescription: (type, options, noText?) => string | MDXString;
```

<<<<<<< Updated upstream
=======
Defined in: [printer.ts:75](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L75)

Prints the description section for a type

>>>>>>> Stashed changes
###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### noText?

`string`

###### Returns

`string` \| `MDXString`

<<<<<<< Updated upstream
###### Defined in
=======
###### Param

The GraphQL type to document

###### Param

Combined printer configuration and options

###### Param

Text to display when no description is available

###### Returns

Markdown string containing the description

###### Example
>>>>>>> Stashed changes

[printer.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L68)

#### Methods

##### init()

```ts
static init(
   schema, 
   baseURL, 
   linkRoot, 
   __namedParameters, 
mdxParser?): Promise<void>
```

Defined in: [printer.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L87)

###### Parameters

###### schema

`Maybe`\<`GraphQLSchema`\>

###### baseURL

`Maybe`\<`string`\> = `"schema"`

###### linkRoot

`Maybe`\<`string`\> = `"/"`

###### \_\_namedParameters

###### customDirectives?

`CustomDirectiveMap`

###### deprecated?

`TypeDeprecatedOption`

###### groups?

`Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>

###### meta?

`Maybe`\<`MetaOptions`\>

###### metatags?

`Record`\<`string`, `string`\>[]

###### onlyDocDirectives?

`GraphQLDirective`[]

###### printTypeOptions?

`PrinterConfigPrintTypeOptions`

###### skipDocDirectives?

`GraphQLDirective`[]

###### mdxParser?

`Record`\<`string`, `unknown`\>

###### Returns

`Promise`\<`void`\>

###### Example

```ts

```

##### printCode()

```ts
readonly static printCode(type, options): string
```

Defined in: [printer.ts:164](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L164)

###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string`

##### printExample()

```ts
readonly static printExample(type, options): string
```

Defined in: [printer.ts:209](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L209)

###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string`

##### printHeader()

```ts
readonly static printHeader(
   id, 
   title, 
   options): string
```

Defined in: [printer.ts:150](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L150)

###### Parameters

###### id

`string`

###### title

`string`

###### options

`PrintTypeOptions`

###### Returns

`string`

##### printMetaTags()

```ts
readonly static printMetaTags(_type, __namedParameters): string | MDXString
```

Defined in: [printer.ts:269](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L269)

###### Parameters

###### \_type

`unknown`

###### \_\_namedParameters

`PrintTypeOptions`

###### Returns

`string` \| `MDXString`

##### printRelations()

```ts
readonly static printRelations(type, options): string | MDXString
```

Defined in: [printer.ts:259](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L259)

###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string` \| `MDXString`

##### printType()

```ts
readonly static printType(
   name, 
   type, 
options?): Maybe<MDXString>
```

Defined in: [printer.ts:288](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L288)

###### Parameters

###### name

`Maybe`\<`string`\>

###### type

`unknown`

###### options?

`Maybe`\<`Partial`\<`PrintTypeOptions`\>\>

###### Returns

`Maybe`\<`MDXString`\>

##### printTypeMetadata()

```ts
readonly static printTypeMetadata(type, options): string | MDXString
```

Defined in: [printer.ts:230](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L230)

###### Parameters

###### type

`unknown`

###### options

`PrintTypeOptions`

###### Returns

`string` \| `MDXString`
