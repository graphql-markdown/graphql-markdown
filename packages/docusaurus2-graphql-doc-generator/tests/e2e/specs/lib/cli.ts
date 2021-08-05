import { ExecException, exec } from "child_process";

export const ERROR_CODE = {
  SUCCESS: 0,
};

type CliOutput = {
  code: number;
  error: ExecException;
  stderr: string;
  stdout: string;
};

export const cli = async (args = []): Promise<CliOutput> => {
  return await new Promise((resolve) => {
    exec(
      `npx docusaurus graphql-to-doc ${args.join(" ")}`,
      { cwd: "/usr/src/app/docusaurus2" },
      (error, stdout, stderr) => {
        const hasError =
          typeof error !== "undefined" && typeof error.code !== "undefined";
        resolve({
          code: hasError ? error.code : ERROR_CODE.SUCCESS,
          error,
          stderr,
          stdout,
        });
      }
    );
  });
};
