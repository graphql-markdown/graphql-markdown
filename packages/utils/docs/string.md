# string

Library of helpers for formatting strings.

## Variables

### slugify()

```ts
const slugify: (str) => string = kebabCase;
```

Defined in: [string.ts:283](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L283)

Returns a lowercase string with `-` as replacement for non alphanum characters using [stringCaseBuilder](#stringcasebuilder).

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Example

```js
import { kebabCase } from "@graphql-markdown/utils/string";

kebabCase("The quick brown Fox");
// Expected result: "the-quick-brown-fox"
```

---

### toString

```ts
const toString: StringConstructor = String;
```

Defined in: [string.ts:293](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L293)

Returns a stringified version of the variable.

#### Param

the variable to be transformed.

#### Returns

a string

## Functions

### capitalize()

```ts
function capitalize(str): string;
```

Defined in: [string.ts:224](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L224)

Returns a string in lowercase excepted for the 1st character capitalized using [firstUppercase](#firstuppercase).

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a capitalized string, or an empty string if `str` is not a valid string.

#### Example

```js
import { capitalize } from "@graphql-markdown/utils/string";

capitalize("the quick Brown Fox");
// Expected result: "The quick brown fox"
```

---

### escapeMDX()

```ts
function escapeMDX(str): string;
```

Defined in: [string.ts:177](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L177)

**`Internal`**

Returns a string with MDX special characters converted to HTML unicode using [toHTMLUnicode](#tohtmlunicode).
Characters within code notation should not be converted.
List of special characters: `{`, `<`, `>`, `}`

#### Parameters

##### str

`unknown`

the string to be transformed.

#### Returns

`string`

a string with MDX special characters replaced by HTML unicode equivalents.

#### Example

```js
import { escapeMDX } from "@graphql-markdown/utils/string";

escapeMDX("{MDX} <special> characters");
// Expected result: "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters"

escapeMDX("`{MDX}` `<special>` characters");
// Expected result: "`{MDX}` `<special>` characters"
```

---

### firstUppercase()

```ts
function firstUppercase(str): string;
```

Defined in: [string.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L200)

Returns a string with the 1st character in uppercase.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a string with the 1st character in uppercase, or an empty string if `str` is not a valid string.

#### Example

```js
import { firstUppercase } from "@graphql-markdown/utils/string";

firstUppercase("the quick Brown Fox");
// Expected result: "The quick Brown Fox"
```

---

### kebabCase()

```ts
function kebabCase(str): string;
```

Defined in: [string.ts:267](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L267)

Returns a lowercase string with `-` as replacement for non alphanum characters using [stringCaseBuilder](#stringcasebuilder).

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Example

```js
import { kebabCase } from "@graphql-markdown/utils/string";

kebabCase("The quick brown Fox");
// Expected result: "the-quick-brown-fox"
```

---

### prune()

```ts
function prune(str, substr): string;
```

Defined in: [string.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L58)

**`Internal`**

Returns a string pruned on both start and end, similar to `trim()` but with any substring.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be pruned.

##### substr

`string` = `""`

the substring to be removed from `str`.

#### Returns

`string`

a pruned string, or an empty string if `str` is not a valid string.

#### Example

```js
import { prune } from "@graphql-markdown/utils/string";

const text = "**The quick brown fox jumps over the lazy dog.**";

prune(text, "**");
// Expected result: "The quick brown fox jumps over the lazy dog."
```

---

### replaceDiacritics()

```ts
function replaceDiacritics(str): string;
```

Defined in: [string.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L27)

Replaces diacritics by non-diacritic equivalent characters.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a string with diacritic characters replaced, or an empty string if `str` is not a valid string.

-

#### Example

```js
import { replaceDiacritics } from "@graphql-markdown/utils/string";

replaceDiacritics("Âéêś"); // Expected result: "Aees"
```

#### See

[StackOverflow source](https://stackoverflow.com/a/37511463)

---

### startCase()

```ts
function startCase(str): string;
```

Defined in: [string.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L246)

Applies [firstUppercase](#firstuppercase) using [stringCaseBuilder](#stringcasebuilder) to every word of a string with `space` character as separator.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Example

```js
import { startCase } from "@graphql-markdown/utils/string";

startCase("the quick Brown Fox");
// Expected result: "The Quick Brown Fox"
```

---

### stringCaseBuilder()

```ts
function stringCaseBuilder(str, transformation?, separator?, splitter?): string;
```

Defined in: [string.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L100)

**`Internal`**

Returns a string after applying a transformation function.
By default `splitter` expression will split the string into words, where non-alphanum chars are considered as word separators.
`separator` will be used for joining the words back together.
[prune](#prune) using `separator` is applied to the result of the transformation.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be transformed.

##### transformation?

`Maybe`&lt;(`word`) => `string`&gt;

optional transformation callback function.

##### separator?

`string`

optional character separator for word-based transformation.

##### splitter?

optional regex or string rule for splitting string into word.

`string` | `RegExp`

#### Returns

`string`

a transformed string, or an empty string if `str` is not a valid string.

#### Example

```js
import { stringCaseBuilder } from "@graphql-markdown/utils/string";

const text = "The quick brown fox jumps over the lazy dog.";
const transformation = (word: string): string => `*${word}*`

stringCaseBuilder(text, transformation, " ");
// Expected result: "*The* *quick* *brown* *fox* *jumps* *over* *the* *lazy* *dog*"
```

---

### toHTMLUnicode()

```ts
function toHTMLUnicode(char): string;
```

Defined in: [string.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L146)

**`Internal`**

Converts a character to its equivalent HTML unicode representation `&#x0000`.

#### Parameters

##### char

`Maybe`&lt;`string`&gt;

the character to be transformed.

#### Returns

`string`

a HTML unicode representation of `char`, or an empty string if `char` is not a valid string.

#### Example

```js
import { toHTMLUnicode } from "@graphql-markdown/utils/string";

toHTMLUnicode("%"); // Expected result: "&#x0025;"
```
