const { toMatchFile } = require("jest-file-snapshot");

expect.extend({ toMatchFile });
