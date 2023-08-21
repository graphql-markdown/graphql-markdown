# Module: array

Internal library of helpers for converting array \`<-\>` list.

## Functions

### convertArrayToMapObject

```ts
convertArrayToMapObject<T>(list): Maybe< Record< string, T > >
```

Returns a k/v object from an array of objects with a `name` property.

#### Type parameters

| Parameter | Description                            |
| :-------- | :------------------------------------- |
| `T`       | the type of objects the list contains. |

#### Parameters

| Parameter | Type               | Description                                                  |
| :-------- | :----------------- | :----------------------------------------------------------- |
| `list`    | `Maybe`\< `T`[] \> | the list of objects of type `{ name: any }` to be converted. |

#### Returns

`Maybe`\< `Record`\< `string`, `T` \> \>

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

#### Defined In

[array.ts:74](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/array.ts#L74)

---

### toArray

```ts
toArray(recordMap): Maybe< unknown[] >
```

Returns an array of values from a k/v object.

#### Parameters

| Parameter   | Type                                           | Description                                  |
| :---------- | :--------------------------------------------- | :------------------------------------------- |
| `recordMap` | `Maybe`\< `Record`\< `string`, `unknown` \> \> | the key/value record object to be converted. |

#### Returns

`Maybe`\< `unknown`[] \>

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

#### Defined In

[array.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/array.ts#L34)
