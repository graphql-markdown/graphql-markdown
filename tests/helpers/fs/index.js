const { Volume } = require("memfs");
const { ufs } = require("unionfs");

const fs = jest.requireActual("fs");

const vol = Volume.fromJSON({});
vol.mkdirSync(process.cwd(), { recursive: true });

const mockfs = ufs.use(fs).use(vol);

module.exports = { Volume, mockfs };
