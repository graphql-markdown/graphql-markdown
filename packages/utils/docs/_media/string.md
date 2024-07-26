# string

Library of helpers for formatting strings.

## Functions

### capitalize()

```ts
function capitalize(str): string
```

Returns a string in lowercase excepted for the 1st character capitalized using [firstUppercase](string.md#firstuppercase).

#### Parameters

• **str**: `Maybe`\<`string`\>

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

#### Defined in

[string.ts:224](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L224)

***

### escapeMDX()

```ts
function escapeMDX(str): string
```

Returns a string with MDX special characters converted to HTML unicode using [toHTMLUnicode](string.md#tohtmlunicode).
Characters within code notation should not be converted.
List of special characters: `{`, `<`, `>`, `}`

#### Parameters

• **str**: `unknown`

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

#### Defined in

[string.ts:177](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L177)

***

### firstUppercase()

```ts
function firstUppercase(str): string
```

Returns a string with the 1st character in uppercase.

#### Parameters

• **str**: `Maybe`\<`string`\>

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

#### Defined in

[string.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L200)

***

### kebabCase()

```ts
function kebabCase(str): string
```

Returns a lowercase string with `-` as replacement for non alphanum characters using [stringCaseBuilder](string.md#stringcasebuilder).

#### Parameters

• **str**: `Maybe`\<`string`\>

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

#### Defined in

[string.ts:267](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L267)

***

### prune()

```ts
function prune(str, substr): string
```

Returns a string pruned on both start and end, similar to `trim()` but with any substring.

#### Parameters

• **str**: `Maybe`\<`string`\>

the string to be pruned.

• **substr**: `string` = `""`

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

#### Defined in

[string.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L58)

***

### replaceDiacritics()

```ts
function replaceDiacritics(str): string
```

Replaces diacritics by non-diacritic equivalent characters.

#### Parameters

• **str**: `Maybe`\<`string`\>

the string to be transformed.

#### Returns

`string`

a string with diacritic characters replaced, or an empty string if `str` is not a valid string.

 *

#### Example

```js
import { replaceDiacritics } from "@graphql-markdown/utils/string";

replaceDiacritics("Âéêś"); // Expected result: "Aees"
```

#### See

[StackOverflow source](https://stackoverflow.com/a/37511463).

#### Defined in

[string.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L27)

***

### slugify()

```ts
function slugify(str): string
```

Alias of [kebabCase](string.md#kebabcase).

#### Parameters

• **str**: `Maybe`\<`string`\>

the string to be transformed.

#### Returns

`string`

a string converted to start case, or an empty string if `str` is not a valid string.

#### Alias

#### Example

```js
import { kebabCase } from "@graphql-markdown/utils/string";

kebabCase("The quick brown Fox");
// Expected result: "the-quick-brown-fox"
```

#### Defined in

[string.ts:282](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L282)

***

### startCase()

```ts
function startCase(str): string
```

Applies [firstUppercase](string.md#firstuppercase) using [stringCaseBuilder](string.md#stringcasebuilder) to every word of a string with `space` character as separator.

#### Parameters

• **str**: `Maybe`\<`string`\>

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

#### Defined in

[string.ts:246](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L246)

***

### stringCaseBuilder()

```ts
function stringCaseBuilder(
   str, 
   transformation?, 
   separator?, 
   splitter?): string
```

Returns a string after applying a transformation function.
By default `splitter` expression will split the string into words, where non-alphanum chars are considered as word separators.
`separator` will be used for joining the words back together.
[prune](string.md#prune) using `separator` is applied to the result of the transformation.

#### Parameters

• **str**: `Maybe`\<`string`\>

the string to be transformed.

• **transformation?**: `Maybe`\<(`word`) => `string`\>

optional transformation callback function.

• **separator?**: `string`

optional character separator for word-based transformation.

• **splitter?**: `string` \| `RegExp` = `...`

optional regex or string rule for splitting string into word.

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

#### Defined in

[string.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L100)

***

### toHTMLUnicode()

```ts
function toHTMLUnicode(char): string
```

Converts a character to its equivalent HTML unicode representation `&#x0000`.

#### Parameters

• **char**: `Maybe`\<`string`\>

the character to be transformed.

#### Returns

`string`

a HTML unicode representation of `char`, or an empty string if `char` is not a valid string.

#### Example

```js
import { toHTMLUnicode } from "@graphql-markdown/utils/string";

toHTMLUnicode("%"); // Expected result: "&#x0025;"
```

#### Defined in

[string.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L146)
