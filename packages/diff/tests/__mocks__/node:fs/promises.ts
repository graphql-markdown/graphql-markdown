import { vol } from "memfs";
import { ufs } from "unionfs";
import fs from "node:fs";

import type { IFS } from "unionfs";

export default ufs.use(fs).use(vol as unknown as IFS).promises;
