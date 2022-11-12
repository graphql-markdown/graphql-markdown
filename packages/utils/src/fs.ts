import * as fs from "fs";
import { dirname } from "path";

export const readFile = fs.promises?.readFile;
export const copyFile = fs.promises?.copyFile;

export const ensureDir = async (dirPath: string): Promise<void> => {
  if (!(await fileExists(dirPath))) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.stat(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

export const saveFile = async (
  filePath: string,
  data: string | Uint8Array
): Promise<void> => {
  await ensureDir(dirname(filePath));
  await fs.promises.writeFile(filePath, data, "utf8");
};
