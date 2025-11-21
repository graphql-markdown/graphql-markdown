# example

Module providing utilities for handling GraphQL example directives and printing example values.

## Functions

### getDirectiveExampleOption()

```ts
function getDirectiveExampleOption(options): Maybe<TypeDirectiveExample>;
```

Defined in: [example.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/example.ts#L44)

Retrieves directive example options from the provided print type options.

#### Parameters

##### options

`PrintTypeOptions`

Configuration options

#### Returns

`Maybe`\<`TypeDirectiveExample`\>

The directive example configuration if valid, otherwise `undefined`

***

### printExample()

```ts
function printExample(type, options): Maybe<string>;
```

Defined in: [example.ts:247](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/example.ts#L247)

Prints an example value for a given GraphQL type or operation.

#### Parameters

##### type

`unknown`

The GraphQL type or operation to generate an example for

##### options

`PrintTypeOptions`

Configuration options for printing the example

#### Returns

`Maybe`\<`string`\>

Stringified example if available, otherwise `undefined`

#### Example

```ts
const example = printExample(type, { schema, exampleSection });
if (example) {
  console.log(example);
}
```
