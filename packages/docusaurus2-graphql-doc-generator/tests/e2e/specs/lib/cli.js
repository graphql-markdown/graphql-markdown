const { exec } = require("child_process");

module.exports = async function cli(args = []) {
  return new Promise((resolve) => {
    exec(
      `npx docusaurus graphql-to-doc ${args.join(" ")}`,
      { cwd: "/usr/src/app/docusaurus2" },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      }
    );
  });
};
