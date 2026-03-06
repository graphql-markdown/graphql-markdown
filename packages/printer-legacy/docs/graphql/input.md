# graphql/input

Legacy printer helpers for rendering GraphQL input types.

## Functions

### printCodeInput()

```ts
function printCodeInput(type, options): string;
```

Defined in: [printer-legacy/src/graphql/input.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/input.ts#L20)

Renders the Markdown code snippet for a GraphQL `input` type by delegating
to the generic object printer while forcing the `input` kind.

#### Parameters

##### type

`unknown`

The GraphQL input definition or SDL node to print.

##### options

`PrintTypeOptions`

Printer options controlling headings, examples, and badges.

#### Returns

`string`

Markdown code block representing the input signature.
