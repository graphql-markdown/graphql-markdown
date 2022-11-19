/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/unit/printCodeDirective.test.ts TAP > returns a directive 1`] = `
directive @FooBar
`

exports[`tests/unit/printCodeDirective.test.ts TAP > returns a directive with its arguments 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
)
`

exports[`tests/unit/printCodeDirective.test.ts TAP > returns a directive with multiple locations 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
) on 
  | QUERY
  | FIELD
`

exports[`tests/unit/printCodeDirective.test.ts TAP > returns a directive with single location 1`] = `
directive @FooBar(
  ArgFooBar: Boolean
) on QUERY
`
