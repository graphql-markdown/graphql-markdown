const exec = require("child_process").exec;

test("Code should be 0", async () => {
  const result = await cli();
  expect(result.code).toBe(0);
});

function cli(args = []) {
  return new Promise((resolve) => {
    exec(
      `npx docusaurus graphql-to-doc ${args.join(" ")}`,
      { cwd: process.cwd() },
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
}
