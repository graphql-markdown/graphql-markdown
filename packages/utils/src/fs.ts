import * as fs from "node:fs/promises";
import { dirname } from "node:path";

export const readFile = fs.readFile;
export const copyFile = fs.copyFile;

export async function ensureDir(dirPath: string): Promise<undefined> {
  if (!(await fileExists(dirPath))) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function saveFile(
  filePath: string,
  data: string,
  prettify?: (text: string, options?: unknown) => Promise<string | undefined>,
): Promise<void> {
  if (typeof prettify === "function") {
    data = (await prettify(data)) ?? data;
  }
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, data, "utf8");
}
