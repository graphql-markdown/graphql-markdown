import fs from "node:fs/promises";
import { dirname } from "node:path";

export const readFile = fs.readFile;
export const copyFile = fs.copyFile;

export const ensureDir = async (dirPath: string): Promise<void> => {
  if (!(await fileExists(dirPath))) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.stat(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export const saveFile = async (filePath: string, data: string | Uint8Array): Promise<void> => {
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, data, "utf8");
}
