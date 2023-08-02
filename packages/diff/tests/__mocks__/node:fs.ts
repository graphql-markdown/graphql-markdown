import { vol } from "memfs";
import { ufs } from "unionfs";

import type { IFS } from "unionfs";

const fs = jest.requireActual("node:fs");

module.exports = ufs.use(fs).use(vol as unknown as IFS);
