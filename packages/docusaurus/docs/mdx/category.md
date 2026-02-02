# mdx/category

## Functions

### beforeGenerateIndexMetafileHook()

```ts
function beforeGenerateIndexMetafileHook(event): Promise<void>;
```

Defined in: [mdx/category.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/category.ts#L22)

#### Parameters

##### event

###### data

\{
`category`: `string`;
`dirPath`: `string`;
`options?`: `Record`&lt;`string`, `unknown`&gt;;
\}

###### data.category

`string`

###### data.dirPath

`string`

###### data.options?

`Record`&lt;`string`, `unknown`&gt;

#### Returns

`Promise`&lt;`void`&gt;
