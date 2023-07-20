import { vol } from "memfs";
import ufs from "unionfs";

const fs = jest.requireActual("fs");

module.exports = ufs.use(fs).use(vol as any);
