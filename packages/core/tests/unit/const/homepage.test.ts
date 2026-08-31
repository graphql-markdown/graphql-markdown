/**
 * Unit tests for the inlined default homepage template.
 * @module
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { DEFAULT_HOMEPAGE_TEMPLATE } from "../../../src/const/homepage";

describe("DEFAULT_HOMEPAGE_TEMPLATE", () => {
  test("matches the shipped assets/generated.md byte for byte", async () => {
    expect.assertions(1);

    // `assets/generated.md` stays the canonical artifact — it is published in
    // the package and callers may point `homepage` at it. The constant exists
    // so the default path needs no filesystem read. If the two ever diverge,
    // whichever one a run happens to use would silently change the output.
    const asset = await readFile(
      join(__dirname, "..", "..", "..", "assets", "generated.md"),
      "utf-8",
    );

    expect(DEFAULT_HOMEPAGE_TEMPLATE).toBe(asset);
  });

  test("carries the placeholders renderHomepage substitutes", () => {
    expect.assertions(2);

    expect(DEFAULT_HOMEPAGE_TEMPLATE).toContain("##baseURL##");
    // The default template intentionally has no generated-date-time
    // placeholder; assert that so adding one is a deliberate change.
    expect(DEFAULT_HOMEPAGE_TEMPLATE).not.toContain("##generated-date-time##");
  });
});
