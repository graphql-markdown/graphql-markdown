# frontmatter

Module for handling frontmatter generation in Markdown documents.
Provides utilities for formatting and printing frontmatter content.

## Functions

### printFrontMatter()

```ts
function printFrontMatter(title, props, options): string;
```

Defined in: [frontmatter.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/frontmatter.ts#L21)

Generates a formatted frontmatter string for Markdown/MDX documents.

#### Parameters

##### title

`string`

The title to be included in the frontmatter

##### props

`Maybe`&lt;`FrontMatterOptions`&gt;

Additional frontmatter properties to be included

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string`

Formatted frontmatter string, or empty string if formatting is disabled
