import fs from "node:fs/promises";
import { dirname } from "node:path";

import type { Maybe } from "@graphql-markdown/types";

export const readFile = fs.readFile;
export const copyFile = fs.copyFile;

export async function ensureDir(dirPath: string): Promise<void> {
  if (!(await fileExists(dirPath))) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return typeof stats === "object";
  } catch (error) {
    return false;
  }
}

export async function saveFile(
  filePath: string,
  data: string,
  prettify?: (text: string, options?: unknown) => Promise<Maybe<string>>,
): Promise<void> {
  if (typeof prettify === "function") {
    data = (await prettify(data)) ?? data;
  }
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, data, "utf8");
}
