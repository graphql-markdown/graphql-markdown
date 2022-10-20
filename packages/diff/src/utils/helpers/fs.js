const { promises: fs } = require("fs");
const { dirname } = require("path");

const { readFile, copyFile } = fs;

async function ensureDir(dirPath) {
  if (!(await fileExists(dirPath))) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function fileExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function saveFile(filePath, data) {
  await ensureDir(dirname(filePath));
  await fs.writeFile(filePath, data, "utf8");
}

module.exports = {
  copyFile,
  ensureDir,
  fileExists,
  readFile,
  saveFile,
};
