# frontmatter

## Functions

### formatFrontMatterList()

```ts
function formatFrontMatterList(
   prop, 
   indentation, 
   prefix): string[];
```

Defined in: [frontmatter.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/frontmatter.ts#L79)

Formats an array into a front matter YAML-like structure as string array.

#### Parameters

##### prop

`unknown`

The array to format.

##### indentation

`number` = `0`

The current indentation level. Defaults to 0.

##### prefix

`string` = `"- "`

The prefix for each list item. Defaults to "- ".

#### Returns

`string`[]

An array of strings representing the formatted front matter list.

#### Example

```typescript
const list = ["item1", "item2"];
formatFrontMatterList(list);
// [
//   "- item1",
//   "- item2"
// ]
```

***

### formatFrontMatterObject()

```ts
function formatFrontMatterObject(
   props, 
   indentation, 
   prefix?): string[];
```

Defined in: [frontmatter.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/frontmatter.ts#L39)

Formats an object into a front matter YAML-like structure as string array.

#### Parameters

##### props

`unknown`

The object to format.

##### indentation

`number` = `0`

The current indentation level. Defaults to 0.

##### prefix?

`string`

An optional prefix for each line.

#### Returns

`string`[]

An array of strings representing the formatted front matter.

#### Example

```typescript
const obj = { title: "My Title", tags: ["tag1", "tag2"] };
formatFrontMatterObject(obj);
// [
//   "  title: My Title",
//   "  tags:",
//   "    - tag1",
//   "    - tag2"
// ]
```

***

### formatFrontMatterProp()

```ts
function formatFrontMatterProp(
   prop, 
   indentation, 
   prefix?): string[];
```

Defined in: [frontmatter.ts:122](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/frontmatter.ts#L122)

Formats a single property into a front matter YAML-like structure as string array.

#### Parameters

##### prop

`unknown`

The property to format, represented as an object with a single key-value pair.

##### indentation

`number` = `0`

The current indentation level. Defaults to 0.

##### prefix?

`string`

An optional prefix for the property.

#### Returns

`string`[]

An array of strings representing the formatted front matter property.

#### Example

```typescript
const prop = { title: "My Title" };
formatFrontMatterProp(prop);
// [
//   "title: My Title"
// ]
```
