# Hooks Recipes

This page lists examples of usage of hooks.

:::info

Hooks are part of the [documentation frameworks integration](./integration-with-frameworks.md) API.

:::

## Generate index.md files

You can use this hook to generate `index.md` files

```md
---
title: "Unions"
---

- [ActivityUnion](./activity-union.mdx)
- [LikeableUnion](./likeable-union.mdx)
- [NotificationUnion](./notification-union.mdx)
```

```js
/** src/modules/astro-mdx.mjs **/

import { join, dirname, resolve, basename } from "node:path";
import { appendFile } from "node:fs/promises";

import {
  ensureDir,
  fileExists,
  saveFile,
  startCase,
} from "@graphql-markdown/utils";

const INDEX_MD = "index.md";

const beforeGenerateIndexMetafileHook = async ({ dirPath, category }) => {
  const filePath = join(dirPath, INDEX_MD);

  if (await fileExists(filePath)) {
    return;
  }

  const label = startCase(category);
  const content = `<!-- ${dirPath} -->\n---\n"title": ${label}\n---\n`;
  await ensureDir(dirPath);
  await saveFile(filePath, content);
};

const afterRenderTypeEntitiesHook = async ({ name, filePath }) => {
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

Declare the custom module in GraphQL-Markdown configuration `mdxParser: "./src/modules/astro-mdx.mjs"`.
