import { vol } from "memfs";

// Use the memfs volume promises API directly so tests share the very same
// `vol` instance they populate through `vol.fromJSON()`.
//
// Consumers import both shapes (`import { writeFile } from "node:fs/promises"`
// and `import fsPromises from "node:fs/promises"`), so re-export the memfs
// promises object as the default *and* spread its members as named exports.
const promises = vol.promises;

export default promises;

export const {
  access,
  appendFile,
  chmod,
  chown,
  constants,
  copyFile,
  cp,
  glob,
  lchmod,
  lchown,
  link,
  lstat,
  lutimes,
  mkdir,
  mkdtemp,
  open,
  opendir,
  readFile,
  readdir,
  readlink,
  realpath,
  rename,
  rm,
  rmdir,
  stat,
  statfs,
  symlink,
  truncate,
  unlink,
  utimes,
  watch,
  writeFile,
} = promises;
