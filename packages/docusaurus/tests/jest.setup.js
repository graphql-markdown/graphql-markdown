const { toMatchFile } = require("jest-file-snapshot");
// eslint-disable-next-line jest/no-standalone-expect
expect.extend({ toMatchFile });
