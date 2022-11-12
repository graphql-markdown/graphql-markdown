import { vol } from "memfs";
import { ufs } from "unionfs";

const fs = jest.requireActual("fs");

export default ufs.use(fs).use(vol as any);
