# diff

## Functions

### hasChanges()

```ts
function hasChanges(
   schema, 
   tmpDir, 
   diffMethod, 
diffModule): Promise<boolean>
```

#### Parameters

• **schema**: `GraphQLSchema`

• **tmpDir**: `string`

• **diffMethod**: `Maybe`\<`DiffMethodName`\>

• **diffModule**: `Maybe`\<`string`\> = `"@graphql-markdown/diff"`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[diff.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/diff.ts#L10)
