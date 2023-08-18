# Module: string

Library of helpers for formatting strings.

## Functions

### capitalize()

```ts
capitalize(str): string
```

Returns a string in lowercase excepted for the 1st character capitalized using [firstUppercase](string.md#firstuppercase).

#### Example

```js
import { capitalize } from "@graphql-markdown/utils/string";

capitalize("the quick Brown Fox");
// Expected result: "The quick brown fox"
```

#### Parameters

| Parameter | Type                  | Description                   |
| :-------- | :-------------------- | :---------------------------- |
| `str`     | `Maybe`\< `string` \> | the string to be transformed. |

#### Returns

`string`

a capitalized string, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:184](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L184)

---

### escapeMDX()

```ts
escapeMDX(str): string
```

Returns a string with MDX special characters converted to HTML unicode using [toHTMLUnicode](string.md#tohtmlunicode).

#### Example

```js
import { escapeMDX } from "@graphql-markdown/utils/string";

escapeMDX("{MDX} <special> characters");
// Expected result: "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters"
```

#### Parameters

| Parameter | Type      | Description                   |
| :-------- | :-------- | :---------------------------- |
| `str`     | `unknown` | the string to be transformed. |

#### Returns

`string`

a string with MDX special characters replaced by HTML unicode equivalents.

#### Source

[packages/utils/src/string.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L140)

---

### firstUppercase()

```ts
firstUppercase(str): string
```

Returns a string with the 1st character in uppercase.

#### Example

```js
import { firstUppercase } from "@graphql-markdown/utils/string";

firstUppercase("the quick Brown Fox");
// Expected result: "The quick Brown Fox"
```

#### Parameters

| Parameter | Type                  | Description                   |
| :-------- | :-------------------- | :---------------------------- |
| `str`     | `Maybe`\< `string` \> | the string to be transformed. |

#### Returns

`string`

a string with the 1st character in uppercase, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:160](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L160)

---

### kebabCase()

```ts
kebabCase(str): string
```

Returns a lowercase string with `-` as replacement for non alphanum characters using [stringCaseBuilder](string.md#stringcasebuilder).

#### Example

```js
import { kebabCase } from "@graphql-markdown/utils/string";

kebabCase("The quick brown Fox");
// Expected result: "the-quick-brown-fox"
```

#### Parameters

| Parameter | Type                  | Description                   |
| :-------- | :-------------------- | :---------------------------- |
| `str`     | `Maybe`\< `string` \> | the string to be transformed. |

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:258](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L258)

---

### prune()

```ts
prune(str, substr = ""): string
```

Returns a string pruned on both start and end, similar to `trim()` but with any substring.

#### Example

```js
import { prune } from "@graphql-markdown/utils/string";

const text = "**The quick brown fox jumps over the lazy dog.**";

prune(text, "**");
// Expected result: "The quick brown fox jumps over the lazy dog."
```

#### Parameters

| Parameter | Type                  | Default value | Description                             |
| :-------- | :-------------------- | :------------ | :-------------------------------------- |
| `str`     | `Maybe`\< `string` \> | `undefined`   | the string to be pruned.                |
| `substr`  | `string`              | `""`          | the substring to be removed from `str`. |

#### Returns

`string`

a pruned string, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L82)

---

### replaceDiacritics()

```ts
replaceDiacritics(str): string
```

Replaces diacritics by non-diacritic equivalent characters.

#### Example

```js
import { replaceDiacritics } from "@graphql-markdown/utils/string";

replaceDiacritics("Âéêś"); // Expected result: "Aees"
```

#### See

[StackOverflow source](https://stackoverflow.com/a/37511463).

#### Parameters

| Parameter | Type                  | Description                   |
| :-------- | :-------------------- | :---------------------------- |
| `str`     | `Maybe`\< `string` \> | the string to be transformed. |

#### Returns

`string`

a string with diacritic characters replaced, or an empty string if `str` is not a valid string.

-

#### Source

[packages/utils/src/string.ts:209](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L209)

---

### slugify()

```ts
slugify(str): string
```

Alias of [kebabCase](string.md#kebabcase).

#### Parameters

| Parameter | Type                  |
| :-------- | :-------------------- |
| `str`     | `Maybe`\< `string` \> |

#### Returns

`string`

#### Source

[packages/utils/src/string.ts:258](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L258)

---

### startCase()

```ts
startCase(str): string
```

Applies [firstUppercase](string.md#firstuppercase) using [stringCaseBuilder](string.md#stringcasebuilder) to every word of a string with `space` character as separator.

#### Example

```js
import { startCase } from "@graphql-markdown/utils/string";

startCase("the quick Brown Fox");
// Expected result: "The Quick Brown Fox"
```

#### Parameters

| Parameter | Type                  | Description                   |
| :-------- | :-------------------- | :---------------------------- |
| `str`     | `Maybe`\< `string` \> | the string to be transformed. |

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:234](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L234)

---

### stringCaseBuilder()

```ts
stringCaseBuilder(
  str,
  transformation?,
  separator?,
  splitter? = ...): string
```

Returns a string after applying a transformation function.
By default `splitter` expression will split the string into words, where non-alphanum chars are considered as word separators.
`separator` will be used for joining the words back together.
[prune](string.md#prune) using `separator` is applied to the result of the transformation.

#### Example

```js
import { stringCaseBuilder } from "@graphql-markdown/utils/string";

const text = "The quick brown fox jumps over the lazy dog.";
const transformation = (word: string): string => `*${word}*`

stringCaseBuilder(text, transformation, " ");
// Expected result: "*The* *quick* *brown* *fox* *jumps* *over* *the* *lazy* *dog*"
```

#### Parameters

| Parameter         | Type                              | Description                                                   |
| :---------------- | :-------------------------------- | :------------------------------------------------------------ |
| `str`             | `Maybe`\< `string` \>             | the string to be transformed.                                 |
| `transformation`? | `Maybe`\< (`word`) => `string` \> | the transformation function.                                  |
| `separator`?      | `string`                          | optional character separator for word-based transformation.   |
| `splitter`?       | `string` \| `RegExp`              | optional regex or string rule for splitting string into word. |

#### Returns

`string`

a transformed string, or an empty string if `str` is not a valid string.

#### Source

[packages/utils/src/string.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L36)

---

### toHTMLUnicode()

```ts
toHTMLUnicode(char): string
```

Converts a character to its equivalent HTML unicode representation `&#x0000`.

#### Example

```js
import { toHTMLUnicode } from "@graphql-markdown/utils/string";

toHTMLUnicode("%"); // Expected result: "&#x0025;"
```

#### Parameters

| Parameter | Type                  | Description                      |
| :-------- | :-------------------- | :------------------------------- |
| `char`    | `Maybe`\< `string` \> | the character to be transformed. |

#### Returns

`string`

a HTML unicode representation of `char`, or an empty string if `char` is not a valid string.

#### Source

[packages/utils/src/string.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L114)
