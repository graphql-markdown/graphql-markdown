import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VERSION } from "../../src/version";

describe("VERSION", () => {
  test("matches package.json version", () => {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, "..", "..", "package.json"), "utf8"),
    ) as { version: string };
    expect(VERSION).toBe(pkg.version);
  });
});
