/**
 * @module mdx
 * This module provides utilities for generating MDX index files in Docusaurus format.
 */

import { join } from "node:path";

import {
  ensureDir,
  fileExists,
  saveFile,
  startCase,
} from "@graphql-markdown/utils";
import type { GenerateIndexMetafileType } from "@graphql-markdown/types";

const CATEGORY_YAML = "_category_.yml" as const;

enum SidebarPosition {
  FIRST = 1,
  LAST = 999,
}

export const generateIndexMetafile: GenerateIndexMetafileType = async (
  dirPath: string,
  category: string,
  options?: {
    index?: boolean;
    styleClass?: string;
    sidebarPosition?: number;
    collapsible?: boolean;
    collapsed?: boolean;
  },
): Promise<void> => {
  const filePath = join(dirPath, CATEGORY_YAML);

  if (await fileExists(filePath)) {
    return;
  }

  const label = startCase(category);
  const link =
    options?.index !== true
      ? "null"
      : `\n  type: generated-index\n  title: '${label} overview'`;
  const className =
    typeof options?.styleClass === "string"
      ? `className: ${options.styleClass}\n`
      : "";
  const position =
    typeof options?.sidebarPosition === "number"
      ? options.sidebarPosition
      : SidebarPosition.FIRST;
  const content = `label: ${label}\nposition: ${position}\n${className}link: ${link}\ncollapsible: ${options?.collapsible ?? true}\ncollapsed: ${options?.collapsed ?? true}\n`;

  await ensureDir(dirPath);
  await saveFile(filePath, content);
};
