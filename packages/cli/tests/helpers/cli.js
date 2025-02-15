/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("node:child_process");

module.exports = function cli({
  cmd = "graphql-to-doc",
  args = [],
  cwd = global["__ROOT_DIR__"],
  id = undefined,
} = {}) {
  const command = id ? `${cmd}:${id}` : cmd;

  return new Promise((resolve) => {
    exec(
      `npx @graphql-markdown/cli ${command} ${args.join(" ")}`,
      { cwd, env: { ...process.env, NODE_NO_WARNINGS: 1 } },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      },
    );
  });
};
