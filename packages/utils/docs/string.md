# string

Library of helpers for formatting strings.

## Variables

### slugify

```ts
const slugify: typeof kebabCase = kebabCase;
```

Defined in: [string.ts:464](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L464)

---

### toString

```ts
const toString: StringConstructor = String;
```

Defined in: [string.ts:474](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L474)

Returns a stringified version of the variable.

#### Param

**variable**

the variable to be transformed.

#### Returns

a string

## Functions

### capitalize()

```ts
function capitalize(str): string;
```

Defined in: [string.ts:405](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L405)

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

Defined in: [string.ts:307](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L307)

**`Internal`**

Returns a string with MDX special characters converted to HTML unicode using [toHTMLUnicode](#tohtmlunicode).
List of special characters: `{`, `<`, `>`, `}`, `_`, `*`.

Characters inside code are not converted, but only where Markdown is
certain to parse the same code boundaries; anything ambiguous is escaped.
Over-escaping only affects readability, while under-escaping would let
schema text inject raw HTML/MDX. Code is preserved in:

- inline code spans paired within a single line, on lines without `|`
  (GFM table cells), `](` or `]:` (link destinations and titles);
- fenced code blocks opened by 3+ backticks at column 0 of a line other than
  the first, with no backtick in the info string, and a closing fence.

Once a line leaves a backtick run unpaired, holds a link destination, or is
a fence-like line not matching the rule above (indented, tilde, or on the
first line), Markdown may pair later backticks differently, so everything
after it is escaped.

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

Defined in: [string.ts:381](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L381)

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

Defined in: [string.ts:448](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L448)

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
function prune(str, substr?): string;
```

Defined in: [string.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L58)

**`Internal`**

Returns a string pruned on both start and end, similar to `trim()` but with any substring.

#### Parameters

##### str

`Maybe`&lt;`string`&gt;

the string to be pruned.

##### substr?

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

Defined in: [string.ts:427](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L427)

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

`string` \| `RegExp` = `...`

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

---

### toHTMLUnicode()

```ts
function toHTMLUnicode(char): string;
```

Defined in: [string.ts:147](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/string.ts#L147)

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
