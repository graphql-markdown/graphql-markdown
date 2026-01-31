# utils/interpolate

Helpers utility functions library.

## Functions

### getObjPath()

```ts
function getObjPath(path, obj, fallback): unknown;
```

Defined in: [utils/interpolate.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/utils/interpolate.ts#L31)

**`Internal`**

Returns the value of the specified property or nested property of an object using a string path.

#### Parameters

##### path

`Maybe`&lt;`string`&gt;

property path as string.

##### obj

`unknown`

the key/value record object.

##### fallback

`unknown` = `""`

optional fallback value to be returned if the path cannot be resolved.

#### Returns

`unknown`

the property value if the path is resolved, else returns the `fallback` value.

#### Example

```js
import { getObjPath } from "@graphql-markdown/utils/object";

getObjPath("foo.bar", { foo: { bar: 42 } }); // Returns 42

getObjPath("foo.bak", { foo: { bar: 42 } }, "fallback"); // Returns "fallback"
```

---

### interpolate()

```ts
function interpolate(template, variables, fallback?): string;
```

Defined in: [utils/interpolate.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/utils/interpolate.ts#L64)

Interpolate a template literal-like string.

#### Parameters

##### template

`string`

a string template literal-like.

##### variables

`Maybe`&lt;`Record`&lt;`string`, `unknown`&gt; & `object`&gt;

a record map of values with variable's name as key and `description` as directive's description.

##### fallback?

`string`

optional fallback value if a variable cannot be substituted.

#### Returns

`string`

an interpolated new string from the template.

#### Example

```js
const values = { foo: 42, bar: { value: "test" } };
const template = "${foo} is not ${bar.notfound}";

interpolate(template, values, "fallback"); // Expected result: "42 is not fallback",
```
