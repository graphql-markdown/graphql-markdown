# Module: utils/interpolate

Helpers utility functions library.

## Functions

### getObjPath

```ts
getObjPath(
  path,
  obj,
  fallback = ""): unknown
```

Returns the value of the specified property or nested property of an object using a string path.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `path` | `Maybe`\< `string` \> | `undefined` | property path as string. |
| `obj` | `unknown` | `undefined` | the key/value record object. |
| `fallback` | `unknown` | `""` | optional fallback value to be returned if the path cannot be resolved. |

#### Returns

`unknown`

the property value if the path is resolved, else returns the `fallback` value.

#### Example

```js
import { getObjPath } from '@graphql-markdown/utils/object';

getObjPath("foo.bar", { foo: { bar: 42 } }); // Returns 42

getObjPath("foo.bak", { foo: { bar: 42 } }, "fallback"); // Returns "fallback"
```

#### Defined In

[utils/interpolate.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/utils/interpolate.ts#L31)

***

### interpolate

```ts
interpolate(
  template,
  variables,
  fallback?): string
```

Interpolate a template literal-like string.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | a string template literal-like. |
| `variables` | `Maybe`\< `Record`\< `string`, `unknown` \> & \{`description`: `string`;} \> | a record map of values with variable's name as key and `description` as directive's description. |
| `fallback`? | `string` | optional fallback value if a variable cannot be substituted. |

#### Returns

`string`

an interpolated new string from the template.

#### Example

```js
const values = { foo: 42, bar: { value: "test" } };
const template = "${foo} is not ${bar.notfound}";

interpolate(template, values, "fallback"); // Expected result: "42 is not fallback",
```

#### Defined In

[utils/interpolate.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/utils/interpolate.ts#L64)
