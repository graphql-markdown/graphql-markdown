import { stat, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export { readFile, copyFile } from "node:fs/promises";

export const ensureDir = async (dirPath: string): Promise<void> => {
  if (!(await fileExists(dirPath))) {
    await mkdir(dirPath, { recursive: true });
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await stat(filePath);
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
  await writeFile(filePath, data, "utf8");
};
