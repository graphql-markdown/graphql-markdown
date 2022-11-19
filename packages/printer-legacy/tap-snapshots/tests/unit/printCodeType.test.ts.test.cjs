/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/unit/printCodeType.test.ts TAP > returns an input with its fields 1`] = `
input TestName {
  one: String
  two: Boolean
}
`

exports[`tests/unit/printCodeType.test.ts TAP > returns an interface with its fields 1`] = `
interface TestInterfaceName {
  one: String
  two: Boolean
}
`

exports[`tests/unit/printCodeType.test.ts TAP > returns an object with its fields and interfaces 1`] = `
type TestName implements TestInterfaceName {
  one: String
  two: Boolean
}
`
