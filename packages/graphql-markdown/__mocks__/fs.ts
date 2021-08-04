import { IFS } from "unionfs/lib/fs";
import { Volume } from "memfs";
import { ufs } from "unionfs";

const fs = jest.requireActual("fs");

const vol = Volume.fromJSON({});
vol.mkdirSync(process.cwd(), { recursive: true });

module.exports = ufs.use(fs).use(vol as unknown as IFS);
