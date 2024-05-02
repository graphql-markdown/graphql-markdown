# printer

## Classes

### Printer

#### Implements

- `IPrinter`

#### Constructors

##### new Printer()

```ts
new Printer(): Printer
```

###### Returns

[`Printer`](printer.md#printer)

#### Properties

##### options

```ts
static options: Readonly<Maybe<PrintTypeOptions>>;
```

###### Source

[printer.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L66)

##### printCustomDirectives()

```ts
static readonly printCustomDirectives: (type, options) => string;
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string`

###### Source

[printer.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L70)

##### printCustomTags()

```ts
static readonly printCustomTags: (type, options) => string | MDXString;
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string` \| `MDXString`

###### Source

[printer.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L72)

##### printDescription()

```ts
static readonly printDescription: (type, options?, noText?) => string | MDXString;
```

###### Parameters

• **type**: `unknown`

• **options?**: `PrintTypeOptions`

• **noText?**: `string`

###### Returns

`string` \| `MDXString`

###### Source

[printer.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L68)

#### Methods

##### init()

```ts
static init(
   schema, 
   baseURL, 
   linkRoot, 
   __namedParameters): void
```

###### Parameters

• **schema**: `Maybe`\<`GraphQLSchema`\>

• **baseURL**: `Maybe`\<`string`\>= `"schema"`

• **linkRoot**: `Maybe`\<`string`\>= `"/"`

• **\_\_namedParameters**= `undefined`

• **\_\_namedParameters.customDirectives?**: `CustomDirectiveMap`

• **\_\_namedParameters.deprecated?**: `TypeDeprecatedOption`

• **\_\_namedParameters.groups?**: `Partial`\<`Record`\<`SchemaEntity`, `Record`\<`string`, `Maybe`\<`string`\>\>\>\>

• **\_\_namedParameters.metatags?**: `Record`\<`string`, `string`\>[]

• **\_\_namedParameters.onlyDocDirectives?**: `GraphQLDirective`[]

• **\_\_namedParameters.printTypeOptions?**: `PrinterConfigPrintTypeOptions`

• **\_\_namedParameters.skipDocDirectives?**: `GraphQLDirective`[]

###### Returns

`void`

###### Source

[printer.ts:74](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L74)

##### printCode()

```ts
static readonly printCode(type, options): string
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string`

###### Source

[printer.ts:141](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L141)

##### printExample()

```ts
static readonly printExample(type, options): string
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string`

###### Source

[printer.ts:186](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L186)

##### printHeader()

```ts
static readonly printHeader(
   id, 
   title, 
   options): string
```

###### Parameters

• **id**: `string`

• **title**: `string`

• **options**: `PrintTypeOptions`

###### Returns

`string`

###### Source

[printer.ts:131](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L131)

##### printMetaTags()

```ts
static readonly printMetaTags(_type, __namedParameters): string | MDXString
```

###### Parameters

• **\_type**: `unknown`

• **\_\_namedParameters**: `PrintTypeOptions`

###### Returns

`string` \| `MDXString`

###### Source

[printer.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L246)

##### printRelations()

```ts
static readonly printRelations(type, options): string | MDXString
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string` \| `MDXString`

###### Source

[printer.ts:236](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L236)

##### printType()

```ts
static readonly printType(
   name, 
   type, 
options?): Maybe<MDXString>
```

###### Parameters

• **name**: `Maybe`\<`string`\>

• **type**: `unknown`

• **options?**: `Maybe`\<`Partial`\<`PrintTypeOptions`\>\>

###### Returns

`Maybe`\<`MDXString`\>

###### Source

[printer.ts:265](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L265)

##### printTypeMetadata()

```ts
static readonly printTypeMetadata(type, options): string | MDXString
```

###### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

###### Returns

`string` \| `MDXString`

###### Source

[printer.ts:207](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/printer.ts#L207)
