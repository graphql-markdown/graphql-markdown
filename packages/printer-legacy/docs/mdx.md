# mdx

MDX formatting module for GraphQL-Markdown.

This module provides a set of utility functions for formatting various MDX components
used in the documentation generation process. It handles the formatting of badges,
admonitions, bullet points, collapsible sections, and other MDX-specific elements.

The module can be used with default formatters or customized with user-provided
MDX formatting functions through the mdxModule factory function.

## Variables

### default

```ts
const default: MDXSupportType;
```

Defined in: [mdx/index.ts:197](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/mdx/index.ts#L197)

***

### mdxDeclaration

```ts
const mdxDeclaration: "" = "";
```

Defined in: [mdx/index.ts:195](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/mdx/index.ts#L195)

## Functions

### mdxModule()

```ts
function mdxModule(mdxPackage?): Promise<Readonly<MDXSupportType>>
```

Defined in: [mdx/index.ts:208](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/mdx/index.ts#L208)

#### Parameters

##### mdxPackage?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`Readonly`\<`MDXSupportType`\>\>
