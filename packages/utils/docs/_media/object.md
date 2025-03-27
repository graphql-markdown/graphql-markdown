# object

Internal library of helpers for manipulating objects.

## Functions

### isEmpty()

```ts
function isEmpty<T>(obj): obj is Exclude<unknown, T>
```

Defined in: [object.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/object.ts#L34)

**`Internal`**

Check if an object contains key/value records.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`unknown`

the key/value record object.

#### Returns

`obj is Exclude<unknown, T>`

`false` if the object is a valid k/v set of records, else `true`.

#### Example

```js
import { isEmpty } from '@graphql-markdown/utils/object';

const obj = {
  bool: true,
  string: "test",
  number: 123,
  array: ["one", "two"],
  child: { key: "value" },
};

isEmpty(obj); // Returns false

isEmpty({}); // Returns true
```
