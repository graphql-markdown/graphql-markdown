# const/patterns

Regular expressions and string patterns used throughout the core package.

This module centralizes all regex patterns and constants to ensure consistency
and simplify maintenance when patterns need to be updated.

## Variables

### CONFIG\_CONSTANTS

```ts
const CONFIG_CONSTANTS: object;
```

Defined in: [const/patterns.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/const/patterns.ts#L112)

String constants used for configuration parsing and defaults.

#### Type Declaration

##### DEFAULT\_GROUP

```ts
readonly DEFAULT_GROUP: "Miscellaneous";
```

Default fallback group name used when groupByDirective is configured.
Items without the grouping directive are assigned to this group.

***

### PATTERNS

```ts
const PATTERNS: object;
```

Defined in: [const/patterns.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/const/patterns.ts#L20)

Central repository of regex patterns used for configuration parsing and string transformation.

#### Type Declaration

##### CASE\_TRANSITION

```ts
readonly CASE_TRANSITION: RegExp;
```

Matches transitions between lowercase/digits and uppercase letters.
Used to insert spaces in camelCase strings (e.g., "userId" → "user Id").

###### Pattern

`([a-z]+|\d+)([A-Z])`

###### Example

```ts
- "userId" matches → insert space between "id" and "U" → "user Id"
- "HTTPServer" does not match (no lowercase/digit before uppercase)
- "get2Users" matches → insert space between "2" and "U" → "get 2 Users"
```

##### DIGIT\_LETTER\_TRANSITION

```ts
readonly DIGIT_LETTER_TRANSITION: RegExp;
```

Matches transitions from digits to letters.
Used to insert spaces between numbers and letters (e.g., "2k" → "2 k").

###### Pattern

`(\d+)([a-z])`

###### Example

```ts
- "2k" matches → "2 k"
- "123abc" matches → "123 abc"
- "2K" does not match (K is uppercase)
```

##### DIRECTIVE\_NAME

```ts
readonly DIRECTIVE_NAME: RegExp;
```

Matches directive names with named capture groups.
Captures the directive name after the @ symbol.

###### Pattern

`^@(?<directive>\w+)$`

###### Example

```ts
- "@tag" matches → directive: "tag"
- "@myDirective" matches → directive: "myDirective"
- "@" does not match
- "tag" does not match
```

##### GROUP\_BY\_DIRECTIVE

```ts
readonly GROUP_BY_DIRECTIVE: RegExp;
```

Matches group-by directive format with directive name, field, and optional fallback.
Groups: (1) directive name, (2) field name, (3) optional fallback

###### Pattern

`^@(\w+)\((\w+)(?:\|=(\w+))?\)$`

###### Example

```ts
- "@tag(name)" matches → ["@tag(name)", "tag", "name", undefined]
- "@category(type|=Other)" matches → ["@category(type|=Other)", "category", "type", "Other"]
- "@tag()" does not match
- "tag(name)" does not match
```

##### LETTER\_DIGIT\_TRANSITION

```ts
readonly LETTER_DIGIT_TRANSITION: RegExp;
```

Matches transitions from letters to digits.
Used to insert spaces between letters and numbers (e.g., "user1" → "user 1").

###### Pattern

`([a-z]+)(\d)`

###### Example

```ts
- "user1" matches → "user 1"
- "abc123" matches → "abc 123"
- "U1" does not match (U is uppercase)
```

##### NUMERIC\_PREFIX

```ts
readonly NUMERIC_PREFIX: RegExp;
```

Matches numeric prefix for sorted categories (e.g., "01-query" → "query").
Used to extract category names from numbered folder names.

###### Pattern

`^\d{2}-`

###### Example

```ts
- "01-query" matches → remove "01-" → "query"
- "02-mutations" matches → remove "02-" → "mutations"
- "query" does not match
- "1-query" does not match (only 1 digit)
```

##### WORD\_BOUNDARY

```ts
readonly WORD_BOUNDARY: RegExp;
```

Matches word boundaries (non-alphanumeric characters) for string splitting.
Used globally to split strings on any non-alphanumeric character.

###### Pattern

`[^0-9A-Za-z]+`

###### Example

```ts
- "hello-world" split → ["hello", "world"]
- "hello_world" split → ["hello", "world"]
- "hello world" split → ["hello", "world"]
```

#### Example

```typescript
import { PATTERNS } from "@graphql-markdown/core/const/patterns";

const match = PATTERNS.DIRECTIVE_NAME.exec("@myDirective");
```
