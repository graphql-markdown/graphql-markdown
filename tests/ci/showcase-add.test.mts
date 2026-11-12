import { describe, expect, test } from "vitest";

import type { ShowcaseEntry } from "../../packages/tooling-config/scripts/showcase-add.mts";
import {
  insertEntry,
  isPng,
  isRemote,
  parseOptions,
  validateUrl,
} from "../../packages/tooling-config/scripts/showcase-add.mts";

const entry = (name: string, href = `https://${name}.dev`): ShowcaseEntry => ({
  name,
  href,
  image: name,
  featured: false,
});

describe("insertEntry()", () => {
  const entries = [entry("Altium"), entry("cartesi"), entry("Kili")];

  test("inserts in case-insensitive name order", () => {
    const names = insertEntry(entries, entry("Kaizen")).map((s) => s.name);
    expect(names).toEqual(["Altium", "cartesi", "Kaizen", "Kili"]);
  });

  test("sorts entries that were out of order", () => {
    const unsorted = [entry("FWU BMI Docs"), entry("FUSSY")];
    const names = insertEntry(unsorted, entry("FuzDocs")).map((s) => s.name);
    expect(names).toEqual(["FUSSY", "FuzDocs", "FWU BMI Docs"]);
  });

  test("appends after the last entry", () => {
    expect(insertEntry(entries, entry("Zeet")).at(-1)?.name).toBe("Zeet");
  });

  test("does not mutate the input", () => {
    insertEntry(entries, entry("Kaizen"));
    expect(entries).toHaveLength(3);
  });

  test("rejects a duplicate name or URL", () => {
    expect(() => insertEntry(entries, entry("kili", "https://x.dev"))).toThrow(
      "Already in showcase: Kili",
    );
    expect(() =>
      insertEntry(entries, entry("Other", "https://Altium.dev/")),
    ).toThrow("Already in showcase: Altium");
  });
});

describe("isPng()", () => {
  test("detects the PNG signature", () => {
    expect(
      isPng(Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0)),
    ).toBe(true);
    expect(isPng(Uint8Array.of(0xff, 0xd8, 0xff))).toBe(false);
  });
});

describe("isRemote()", () => {
  test("matches http(s) URLs case-insensitively", () => {
    expect(isRemote("https://x.dev/a.png")).toBe(true);
    expect(isRemote("HTTPS://x.dev/a.png")).toBe(true);
    expect(isRemote("Http://x.dev/a.png")).toBe(true);
    expect(isRemote("./https/a.png")).toBe(false);
  });
});

describe("validateUrl()", () => {
  test("accepts http(s) URLs unchanged", () => {
    expect(validateUrl("https://docs.example.com")).toBe(
      "https://docs.example.com",
    );
  });

  test("rejects other protocols and invalid URLs", () => {
    expect(() => validateUrl("ftp://example.com")).toThrow("https://");
    expect(() => validateUrl("https:docs.example.com/api")).toThrow("https://");
    expect(() => validateUrl("not a url")).toThrow();
  });
});

describe("parseOptions()", () => {
  test("parses flags", () => {
    expect(
      parseOptions([
        "--name",
        "Kaizen",
        "--url",
        "https://k.dev",
        "--featured",
      ]),
    ).toMatchObject({ name: "Kaizen", url: "https://k.dev", featured: true });
  });

  test("ignores a leading -- forwarded by bun run", () => {
    expect(parseOptions(["--", "--name", "Kaizen"]).name).toBe("Kaizen");
  });

  test("defaults featured to false and rejects unknown flags", () => {
    expect(parseOptions([]).featured).toBe(false);
    expect(() => parseOptions(["--nope"])).toThrow();
  });
});
