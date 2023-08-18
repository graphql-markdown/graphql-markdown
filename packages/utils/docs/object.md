# Module: object

Internal library of helpers for manipulating objects.

## Functions

### isEmpty()

```ts
isEmpty(obj): boolean
```

Check if an object contains key/value records.

#### Example

```js
import { isEmpty } from "@graphql-markdown/utils/object";

isEmpty({
  bool: true,
  string: "test",
  number: 123,
  array: ["one", "two"],
  child: { key: "value" },
});

// Returns false

isEmpty({}); // Returns true
```

#### Parameters

| Parameter | Type      | Description                  |
| :-------- | :-------- | :--------------------------- |
| `obj`     | `unknown` | the key/value record object. |

#### Returns

`boolean`

`false` if the object is a valid k/v set of records, else `true`.

#### Source

[packages/utils/src/object.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/object.ts#L34)
