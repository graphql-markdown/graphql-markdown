# array

Internal library of helpers for manipulating array and list.

## Functions

### convertArrayToMapObject()

```ts
function convertArrayToMapObject<T>(list): Maybe<Record<string, T>>;
```

Defined in: [array.ts:75](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/array.ts#L75)

**`Internal`**

Returns a k/v object from an array of objects with a `name` property.

#### Type Parameters

##### T

`T`

the type of objects the list contains.

#### Parameters

##### list

`Maybe`&lt;`T`[]&gt;

the list of objects of type `{ name: any }` to be converted.

#### Returns

`Maybe`&lt;`Record`&lt;`string`, `T`&gt;&gt;

an array of object values with `name` as key, or `undefined` if `list` is not a valid array.

#### Example

```js
import { convertArrayToMapObject } from "@graphql-markdown/utils/array";

convertArrayToMapObject([
  { name: true },
  { name: "test" },
  { name: 123 },
  { name2: 1234 },
]);

// Expected result: {
//   true: { name: true },
//   test: { name: "test" },
//   "123": { name: 123 },
// }
```

---

### toArray()

```ts
function toArray(recordMap): Maybe<unknown[]>;
```

Defined in: [array.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/array.ts#L35)

**`Internal`**

Returns an array of values from a k/v object.

#### Parameters

##### recordMap

`Maybe`&lt;`Record`&lt;`string`, `unknown`&gt;&gt;

the key/value record object to be converted.

#### Returns

`Maybe`&lt;`unknown`[]&gt;

an array of object values, or `undefined` if `recordMap` is not a valid object.

#### Example

```js
import { toArray } from "@graphql-markdown/utils/array";

toArray({
  bool: true,
  string: "test",
  number: 123,
  array: ["one", "two"],
  child: { key: "value" },
});

// Expected result: [true, "test", 123, ["one", "two"], { key: "value" }]
```
