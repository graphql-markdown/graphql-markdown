const { promises: fs } = require("fs");
const { dirname } = require("path");

const readFile = fs.readFile;
const copyFile = fs.copyFile;

async function emptyDir(dirpath) {
  await fs.rm(dirpath, { recursive: true, force: true });
  await ensureDir(dirpath);
}

async function ensureDir(dirpath) {
  if (!(await fileExists(dirpath))) {
    await fs.mkdir(dirpath, { recursive: true });
  }
}

async function fileExists(filepath) {
  try {
    await fs.stat(filepath);
    return true;
  } catch (error) {
    return false;
  }
}

async function saveFile(filepath, data) {
  await ensureDir(dirname(filepath));
  await fs.writeFile(filepath, data);
}

module.exports = {
  copyFile,
  emptyDir,
  ensureDir,
  fileExists,
  readFile,
  saveFile,
};
