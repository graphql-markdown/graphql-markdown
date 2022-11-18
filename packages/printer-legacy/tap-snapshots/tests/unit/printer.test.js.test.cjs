/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/unit/printer.test.js TAP > must match snapshot 1`] = `
\`\`\`graphql
"TestFooBarType" not supported
\`\`\`

`

exports[`tests/unit/printer.test.js TAP > prints deprecated badge if type is deprecated 1`] = `
<Badge class="warning" text="DEPRECATED"/>


`

exports[`tests/unit/printer.test.js TAP > prints deprecation reason if type is deprecated with reason 1`] = `
<Badge class="warning" text="DEPRECATED: foobar"/>


`

exports[`tests/unit/printer.test.js TAP > prints specification link if directive specified by is present 1`] = `
### <SpecifiedBy url="https://lorem.ipsum"/>


`

exports[`tests/unit/printer.test.js TAP > prints type relations 1`] = `
### RelationOf

[\`Bar\`](#)  <Badge class="secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="secondary" text="query"/>


`

exports[`tests/unit/printer.test.js TAP > return DEPRECATED tag if deprecated 1`] = `
<Badge class="warning" text="DEPRECATED: Foobar"/>

Lorem ipsum
`

exports[`tests/unit/printer.test.js TAP > returns Markdown #### link section with description 1`] = `
#### [\`EntityTypeName\`](docs/graphql/objects/entity-type-name) <Badge class="secondary" text="object"/>
> Lorem ipsum
> 
`

exports[`tests/unit/printer.test.js TAP > returns Markdown #### link section with non empty no nullable list [!]! 1`] = `
#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]!\`](docs/graphql/scalars/int) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>
> 
> 
`

exports[`tests/unit/printer.test.js TAP > returns Markdown #### link section with non empty nullable list [!] 1`] = `
#### [\`EntityTypeNameList\`](#)<Bullet />[\`[Int!]\`](docs/graphql/scalars/int) <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>
> 
> 
`

exports[`tests/unit/printer.test.js TAP > returns Markdown #### link section with sub type is non-nullable 1`] = `
#### [\`EntityTypeName\`](#)<Bullet />[\`NonNullableObjectType!\`](docs/graphql/objects/non-nullable-object-type) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>
> 
> 
`

exports[`tests/unit/printer.test.js TAP > returns Markdown #### link section with sub type list and non-nullable 1`] = `
#### [\`EntityTypeName\`](#)<Bullet />[\`[NonNullableObjectType]!\`](docs/graphql/objects/non-nullable-object-type) <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>
> 
> 
`

exports[`tests/unit/printer.test.js TAP > returns a Docusaurus document header 1`] = `
---
id: an-object-type-name
title: An Object Type Name
hide_table_of_contents: false
---

`

exports[`tests/unit/printer.test.js TAP > returns a Docusaurus document header with ToC disabled 1`] = `
---
id: an-object-type-name
title: An Object Type Name
hide_table_of_contents: true
---

`

exports[`tests/unit/printer.test.js TAP > returns a Docusaurus document header with pagination disabled 1`] = `
---
id: an-object-type-name
title: An Object Type Name
hide_table_of_contents: false
pagination_next: null
pagination_prev: null
---

`

exports[`tests/unit/printer.test.js TAP > returns a Markdown one line per formatted argument with default value surrounded by () 1`] = `
(
  ParamWithDefault: string = defaultValue
  ParamNoDefault: any
  ParamIntZero: int = 0
  ParamIntNoDefault: int
)
`

exports[`tests/unit/printer.test.js TAP > returns a directive 1`] = `
directive @FooBar
`

exports[`tests/unit/printer.test.js TAP > returns a directive with its arguments 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
)
`

exports[`tests/unit/printer.test.js TAP > returns a directive with multiple locations 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
) on 
  | QUERY
  | FIELD
`

exports[`tests/unit/printer.test.js TAP > returns a directive with single location 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
) on QUERY
`

exports[`tests/unit/printer.test.js TAP > returns a field with its type 1`] = `
FooBar: string

`

exports[`tests/unit/printer.test.js TAP > returns a field with its type and arguments 1`] = `
TypeFooBar(
  ArgFooBar: String
): String

`

exports[`tests/unit/printer.test.js TAP > returns an input with its fields 1`] = `
input TestName {
  one: String
  two: Boolean
}
`

exports[`tests/unit/printer.test.js TAP > returns an interface with its fields 1`] = `
interface TestInterfaceName {
  one: String
  two: Boolean
}
`

exports[`tests/unit/printer.test.js TAP > returns an object with its fields and interfaces 1`] = `
type TestName implements TestInterfaceName {
  one: String
  two: Boolean
}
`

exports[`tests/unit/printer.test.js TAP > returns enum code structure 1`] = `
enum EnumTypeName {
  one
  two
}
`

exports[`tests/unit/printer.test.js TAP > returns markdown link for GraphQL directive 1`] = `
{
  "text": "TestDirective",
  "url": "docs/graphql/directives/test-directive"
}
`

exports[`tests/unit/printer.test.js TAP > returns markdown link surrounded by [] for GraphQL list/array 1`] = `
{
  "text": "TestObjectList",
  "url": "docs/graphql/objects/test-object-list"
}
`

exports[`tests/unit/printer.test.js TAP > returns object of local strings from root type string 1`] = `
{
  "singular": "query",
  "plural": "queries"
}
`

exports[`tests/unit/printer.test.js TAP > returns plain text for unknown entities 1`] = `
{
  "text": "fooBar",
  "url": "#"
}
`

exports[`tests/unit/printer.test.js TAP > returns scalar code structure 1`] = `
scalar ScalarTypeName
`

exports[`tests/unit/printer.test.js TAP > returns the default text if no description 1`] = `
No description
`

exports[`tests/unit/printer.test.js TAP > returns the type description text 1`] = `
Lorem ipsum
`

exports[`tests/unit/printer.test.js TAP > returns union code structure 1`] = `
union UnionTypeName = one | two
`
