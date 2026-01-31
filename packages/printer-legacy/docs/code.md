# code

Provides utility functions for generating code representations of GraphQL types
in Markdown format. This module handles the formatting of arguments and fields
with proper indentation and deprecation notices.

## Functions

### printCodeArguments()

```ts
function printCodeArguments(type, indentationLevel): string;
```

Defined in: [code.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/code.ts#L41)

Generates a string representation of GraphQL arguments with proper formatting and indentation.

#### Parameters

##### type

`unknown`

The GraphQL type object containing arguments to print

##### indentationLevel

`number` = `1`

The level of indentation to apply (default: 1)

#### Returns

`string`

A formatted string of arguments or an empty string if no arguments exist

#### Example

```
printCodeArguments({ args: [{ name: 'id', type: 'ID!' }] })
// Returns:
// (
//   id: ID!
// )
```

---

### printCodeField()

```ts
function printCodeField(type, options?, indentationLevel?): string | MDXString;
```

Defined in: [code.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/code.ts#L87)

Generates a string representation of a GraphQL field including its arguments,
return type, and deprecation status.

#### Parameters

##### type

`unknown`

The GraphQL field type object to print

##### options?

`PrintTypeOptions`

Optional configuration for printing the type

##### indentationLevel?

`number` = `0`

The level of indentation to apply (default: 0)

#### Returns

`string` \| `MDXString`

A formatted string representing the field or an empty string if the field should not be printed

#### Example

```
printCodeField({ name: 'user', type: 'User!', args: [{ name: 'id', type: 'ID!' }] })
// Returns: user(
//   id: ID!
// ): User!
```
