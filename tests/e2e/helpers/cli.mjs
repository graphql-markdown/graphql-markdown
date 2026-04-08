// @ts-check

import { exec } from "node:child_process";

export default function cli({
  cmd = "graphql-to-doc",
  args = [],
  cwd = global["__ROOT_DIR__"],
  id = undefined,
} = {}) {
  const command = id && id !== "default" ? `${cmd}:${id}` : cmd;
  const execCommand = `${global["__CLI_COMMAND__"]} ${command} ${args.join(" ")}`.trim();

  return new Promise((resolve) => {
    exec(
      execCommand,
      { cwd, env: { ...process.env, NODE_NO_WARNINGS: 1 } },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout: stdout ?? "",
          stderr: stderr ?? "",
        });
      },
    );
  });
}
