# mdx/category

## Functions

### beforeGenerateIndexMetafileHook()

```ts
function beforeGenerateIndexMetafileHook(event): Promise<void>;
```

Defined in: [docusaurus/src/mdx/category.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/mdx/category.ts#L27)

Hook that materializes a `_category_.yml` file before Docusaurus indexes
a directory, ensuring generated bundles have labels, ordering, and
optional generated-index metadata even when the folder was produced by the CLI.

#### Parameters

##### event

Hook payload containing the target directory, category name, and generator options.

###### data

\{
`category`: `string`;
`dirPath`: `string`;
`options?`: `Record`&lt;`string`, `unknown`&gt;;
`outputAdapter?`: `OutputAdapter`;
\}

###### data.category

`string`

###### data.dirPath

`string`

###### data.options?

`Record`&lt;`string`, `unknown`&gt;

###### data.outputAdapter?

`OutputAdapter`

#### Returns

`Promise`&lt;`void`&gt;
