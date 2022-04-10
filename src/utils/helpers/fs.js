const { promises: fs } = require("fs");
const { dirname } = require("path");

const readFile = fs.readFile;
const copyFile = fs.copyFile;

async function emptyDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await ensureDir(dirPath);
}

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
  await fs.writeFile(filePath, data);
}

module.exports = {
  copyFile,
  emptyDir,
  ensureDir,
  fileExists,
  readFile,
  saveFile,
};
