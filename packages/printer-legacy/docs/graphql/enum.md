# graphql/enum

Provides utilities for printing GraphQL enum types to Markdown/MDX format

## Functions

### printCodeEnum()

```ts
function printCodeEnum(type, options?): string;
```

Defined in: [graphql/enum.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/enum.ts#L43)

Generates a GraphQL SDL code block for an enum type.

#### Parameters

##### type

`unknown`

The GraphQL enum type to process

##### options?

`PrintTypeOptions`

Optional printing options that control directive handling

#### Returns

`string`

A string containing the enum type definition in GraphQL SDL, or empty string if type is not an enum

---

### printEnumMetadata()

```ts
function printEnumMetadata(type, options): Promise<string | MDXString>;
```

Defined in: [graphql/enum.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/enum.ts#L25)

Prints the metadata section for a GraphQL enum type.

#### Parameters

##### type

`unknown`

The GraphQL enum type to process

##### options

`PrintTypeOptions`

Options for printing the type

#### Returns

`Promise`&lt;`string` \| `MDXString`&gt;

A string containing the metadata section in MDX format, or empty string if type is not an enum
