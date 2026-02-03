# Hooks Recipes

This page lists examples of usage of [hooks](/api/category/events).

:::info

Hooks are part of the [documentation frameworks integration](./integration-with-frameworks.md) API.

:::

## Available Hooks

GraphQL-Markdown provides lifecycle hooks for customizing the documentation generation process:

**Generation Hooks:**
- `beforeSchemaLoadHook` / `afterSchemaLoadHook` - Schema loading
- `beforeDiffCheckHook` / `afterDiffCheckHook` - Schema diff checking
- `beforeRenderRootTypesHook` / `afterRenderRootTypesHook` - Root types rendering
- `beforeRenderHomepageHook` / `afterRenderHomepageHook` - Homepage rendering
- `beforeRenderTypeEntitiesHook` / `afterRenderTypeEntitiesHook` - Type entities rendering
- `beforeGenerateIndexMetafileHook` / `afterGenerateIndexMetafileHook` - Index metafile generation

**Printer Hooks:**
- `beforePrintCodeHook` / `afterPrintCodeHook` - Code block generation
- `beforePrintTypeHook` / `afterPrintTypeHook` - Type documentation generation

All hooks receive an `event` object with a `data` property containing context-specific information. Printer hooks also have an `output` property that can be modified.

## Generate index.md files

You can use this hook to generate `index.md` files.

```md
---
title: "Unions"
---

- [ActivityUnion](./activity-union.mdx)
- [LikeableUnion](./likeable-union.mdx)
- [NotificationUnion](./notification-union.mdx)
```

Declare the custom module in GraphQL-Markdown configuration `mdxParser: "./custom-mdx.mjs"`.

```js title="custom-mdx.mjs"

import { join, dirname, resolve, basename } from "node:path";
import { appendFile } from "node:fs/promises";

import {
  ensureDir,
  fileExists,
  saveFile,
  startCase,
} from "@graphql-markdown/utils";

const INDEX_MD = "index.md";

/**
 * Hook that generates an index metadata file for a category directory.
 * 
 * This hook is executed before generating index metadata files. 
 * It checks if an index.md file exists in the specified directory. 
 * If not, it creates one with a title derived from the category name.
 */
const beforeGenerateIndexMetafileHook = async (event) => {
  const { dirPath, category } = event.data;
  const filePath = join(dirPath, INDEX_MD);

  if (await fileExists(filePath)) {
    return;
  }

  const label = startCase(category);
  const content = `---\ntitle: "${label}"\n---\n\n`;
  await ensureDir(dirPath);
  await saveFile(filePath, content);
};

/**
 * Hook that appends a link to the entity's page in the index file after rendering type entities.
 * 
 * This hook is triggered after a GraphQL type entity is rendered. 
 * It checks if an index file exists in the same directory as the 
 * rendered entity, and if so, appends a markdown link to the entity's page.
 */
const afterRenderTypeEntitiesHook = async (event) => {
  const { filePath, name } = event.data;
  const indexFilePath = resolve(dirname(filePath), INDEX_MD);
  const pageFileName = basename(filePath);
  if (await fileExists(indexFilePath)) {
    const entryLine = `- [${name}](./${pageFileName})\n`;
    await appendFile(indexFilePath, entryLine);
  }
};

export { 
  beforeGenerateIndexMetafileHook, 
  afterRenderTypeEntitiesHook 
};
```

## Display response types for operations

You can use this hook to automatically add the response type's SDL (Schema Definition Language) after each GraphQL operation (query, mutation, subscription).

This is useful when you want your documentation to show not just the operation signature but also the structure of the data it returns.

**Before (default output):**

```graphql
query user(id: ID!): User
```

**After (with hook):**

The hook appends a "Response Type" section after the operation's code block:

```graphql
query user(id: ID!): User
```

### Response Type

```graphql
type User {
  id: ID!
  name: String!
  email: String
  posts: [Post!]!
}
```

Declare the custom module in GraphQL-Markdown configuration `mdxParser: "./custom-mdx.mjs"`.

```js title="custom-mdx.mjs"
import { 
  isOperation, 
  isScalarType, 
  getNamedType 
} from "@graphql-markdown/graphql";
import { Printer } from "@graphql-markdown/printer-legacy";

/**
 * Hook that adds the response type's SDL after operation code blocks.
 *
 * This hook is executed after generating the code block for a GraphQL type.
 * For operations (queries, mutations, subscriptions), it appends a second
 * code block showing the structure of the return type.
 */
const afterPrintCodeHook = async (event) => {
  const { type, options } = event.data;

  // Only process operations (types with a `type` property for return type)
  if (!isOperation(type)) {
    return;
  }

  // Get the unwrapped return type (removes NonNull and List wrappers)
  const returnType = getNamedType(type.type);
  if (!returnType) {
    return;
  }

  // Skip scalar types - they don't need expanded documentation
  if (isScalarType(returnType)) {
    return;
  }

  // Generate the SDL code block for the return type
  const returnTypeCode = Printer.printCode(returnType, {
    ...options,
    codeSection: true,
  });

  if (returnTypeCode) {
    event.output = `${event.output}\n\n### Response Type\n\n${returnTypeCode}`;
  }
};

export { afterPrintCodeHook };
```

:::tip

You can customize the heading level or text by changing `### Response Type` to match your documentation style.

:::

:::note

The `getNamedType` function from `@graphql-markdown/graphql` unwraps GraphQL type wrappers like `NonNull` and `List`. For example, `[User!]!` becomes `User`.

:::
