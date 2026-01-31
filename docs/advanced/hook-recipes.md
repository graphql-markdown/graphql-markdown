# Hooks Recipes

This page lists examples of usage of [hooks](/api/category/events).

:::info

Hooks are part of the [documentation frameworks integration](./integration-with-frameworks.md) API.

:::

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
const beforeGenerateIndexMetafileHook = async ({ dirPath, category }) => {
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
const afterRenderTypeEntitiesHook = async ({ filePath, name }) => {
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
