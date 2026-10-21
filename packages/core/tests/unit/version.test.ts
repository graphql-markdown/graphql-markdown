import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VERSION } from "../../src/version";

const readManifest = (file: string): { version: string } => {
  return JSON.parse(
    readFileSync(join(__dirname, "..", "..", file), "utf8"),
  ) as {
    version: string;
  };
};

describe("VERSION", () => {
  test("matches package.json version", () => {
    expect(VERSION).toBe(readManifest("package.json").version);
  });

  test("matches jsr.json version", () => {
    expect(VERSION).toBe(readManifest("jsr.json").version);
  });
});
