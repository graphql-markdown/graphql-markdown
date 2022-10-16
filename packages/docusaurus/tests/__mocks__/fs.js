const fs = jest.requireActual("fs");
const { vol } = require("memfs");
const ufs = require("unionfs").default;

module.exports = ufs.use(fs).use(vol);
