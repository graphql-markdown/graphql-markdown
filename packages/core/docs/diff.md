# diff

## Schema

### hasChanges()

```ts
function hasChanges(schema, tmpDir, diffMethod, diffModule): Promise<boolean>;
```

Defined in: [diff.ts:62](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/diff.ts#L62)

Determines if there are changes in the GraphQL schema by using a specified diff method and module.

#### Parameters

##### schema

`GraphQLSchema`

The GraphQL schema to check for changes.

##### tmpDir

`string`

The temporary directory to store intermediate files during the diff process.

##### diffMethod

`Maybe`&lt;`DiffMethodName`&gt;

The name of the diff method to use. Must be a string or `null`.

##### diffModule

`Maybe`&lt;`string`&gt; = `"@graphql-markdown/diff"`

The module to import for performing the diff. Defaults to `@graphql-markdown/diff`.

#### Returns

`Promise`&lt;`boolean`&gt;

A promise that resolves to `true` if changes are detected or if the diff method/module is invalid, otherwise `false`.

#### Examples

```typescript
import { hasChanges } from "./diff";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const changesDetected = await hasChanges(schema, "/tmp", "methodName");
console.log(changesDetected); // true or false
```

```typescript
import { hasChanges } from "./diff";

const schema = getMySchema();
const result = await hasChanges(
  schema,
  "/tmp/schema-diff",
  "breaking",
  "./my-custom-diff-module",
);
```

#### Throws

Will log a warning if the specified diff module cannot be found.

#### See

- DiffMethodName for available diff methods
- FunctionCheckSchemaChanges for the signature of the function imported from the diff module

#### Since

1.0.0
