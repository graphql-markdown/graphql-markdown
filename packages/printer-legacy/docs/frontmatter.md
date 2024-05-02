# frontmatter

## Functions

### formatFrontMatterProp()

```ts
function formatFrontMatterProp(
   prop, 
   indentation, 
   prefix?): string[]
```

#### Parameters

• **prop**: `unknown`

• **indentation**: `number`= `0`

• **prefix?**: `string`

#### Returns

`string`[]

#### Source

[frontmatter.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/frontmatter.ts#L60)

***

### printFrontMatter()

```ts
function printFrontMatter(
   id, 
   title, 
   props?): string
```

#### Parameters

• **id**: `string`

• **title**: `string`

• **props?**: `Maybe`\<`FrontMatterOptions`\>

#### Returns

`string`

#### Source

[frontmatter.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/frontmatter.ts#L83)
