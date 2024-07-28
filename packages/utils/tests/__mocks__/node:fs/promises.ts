import { vol } from "memfs";
import { ufs } from "unionfs";

import type { IFS } from "unionfs";

const fs = jest.requireActual("node:fs");

const promises = ufs.use(fs).use(vol as unknown as IFS).promises;

module.exports = { ...promises, rm: promises.rmdir };

if ("rm" in promises) {
  module.exports = promises;
}
