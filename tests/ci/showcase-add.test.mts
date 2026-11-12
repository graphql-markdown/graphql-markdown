import { mkdtempSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";

import type { ShowcaseEntry } from "../../packages/tooling-config/scripts/showcase-add.mts";
import {
  cleanPath,
  insertEntry,
  isPng,
  isRemote,
  loadImage,
  parseOptions,
  pngWidth,
  promptMissing,
  resolveImagePath,
  urlKey,
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

  test("keeps the relative order of other entries", () => {
    const unsorted = [entry("FWU BMI Docs"), entry("FUSSY")];
    const names = insertEntry(unsorted, entry("Altium")).map((s) => s.name);
    expect(names).toEqual(["Altium", "FWU BMI Docs", "FUSSY"]);
  });

  test("detects duplicates across protocol, www, query and hash", () => {
    expect(() =>
      insertEntry(entries, entry("Other", "http://www.altium.dev/#x")),
    ).toThrow("Already in showcase: Altium");
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
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  test("detects the PNG signature", () => {
    const header = new Uint8Array(24);
    header.set(signature);
    expect(isPng(header)).toBe(true);
    expect(isPng(Uint8Array.of(0xff, 0xd8, 0xff))).toBe(false);
  });

  test("rejects a truncated PNG without a full IHDR header", () => {
    const truncated = new Uint8Array(19);
    truncated.set(signature);
    expect(isPng(truncated)).toBe(false);
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

afterEach(() => {
  vi.unstubAllGlobals();
});

const PNG_HEAD = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const pngBytes = (width: number): Uint8Array => {
  const bytes = new Uint8Array(32);
  bytes.set(PNG_HEAD);
  new DataView(bytes.buffer).setUint32(16, width, false);
  return bytes;
};

describe("cleanPath()", () => {
  test("strips surrounding quotes", () => {
    expect(cleanPath(`  "/a/b c.png" `)).toBe("/a/b c.png");
    expect(cleanPath("'/a/b.png'")).toBe("/a/b.png");
  });

  test("unescapes shell backslash escapes", () => {
    expect(cleanPath("/a/My\\ Shot\\ (1).png")).toBe("/a/My Shot (1).png");
  });

  test("leaves a plain path unchanged", () => {
    expect(cleanPath("/a/b.png")).toBe("/a/b.png");
  });
});

describe("pngWidth()", () => {
  test("reads the IHDR width", () => {
    expect(pngWidth(pngBytes(2400))).toBe(2400);
  });
});

describe("urlKey()", () => {
  test("ignores protocol, www, case, query, hash and trailing slash", () => {
    const key = urlKey("https://docs.dev/api");
    expect(urlKey("http://www.Docs.dev/api/?a=1#x")).toBe(key);
    expect(urlKey("https://docs.dev/API/")).toBe(key);
  });

  test("differs for different paths", () => {
    expect(urlKey("https://docs.dev/a")).not.toBe(urlKey("https://docs.dev/b"));
  });
});

describe("resolveImagePath()", () => {
  test("resolves relative paths against the given cwd", () => {
    expect(resolveImagePath("a/b.png", "/work")).toBe("/work/a/b.png");
  });

  test("keeps absolute paths", () => {
    expect(resolveImagePath("/x/y.png", "/work")).toBe("/x/y.png");
  });

  test("expands ~/", () => {
    expect(resolveImagePath("~/y.png", "/work")).toBe(join(homedir(), "y.png"));
  });
});

describe("loadImage()", () => {
  test("reads a local PNG", async () => {
    const dir = mkdtempSync(join(tmpdir(), "showcase-"));
    const file = join(dir, "a.png");
    writeFileSync(file, pngBytes(10));
    expect((await loadImage(file)).length).toBe(32);
  });

  test("rejects a non-PNG file", async () => {
    const dir = mkdtempSync(join(tmpdir(), "showcase-"));
    const file = join(dir, "a.png");
    writeFileSync(file, "hello");
    await expect(loadImage(file)).rejects.toThrow("Not a PNG");
  });

  test("rejects a truncated PNG before reading its width", async () => {
    const dir = mkdtempSync(join(tmpdir(), "showcase-"));
    const file = join(dir, "a.png");
    const bytes = new Uint8Array(23);
    bytes.set(PNG_HEAD);
    writeFileSync(file, bytes);
    await expect(loadImage(file)).rejects.toThrow("Not a PNG");
  });

  test("rejects an HTTP error", async () => {
    vi.stubGlobal("fetch", async () => new Response("x", { status: 404 }));
    await expect(loadImage("https://x.dev/a.png")).rejects.toThrow(
      "Download failed (404)",
    );
  });

  test("rejects an oversized content-length", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response("x", { headers: { "content-length": "99999999" } }),
    );
    await expect(loadImage("https://x.dev/a.png")).rejects.toThrow(
      "Image larger than 10 MB",
    );
  });
});

describe("promptMissing()", () => {
  test("throws without a TTY when options are missing", async () => {
    const original = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
    Object.defineProperty(process.stdin, "isTTY", {
      value: false,
      configurable: true,
    });
    try {
      await expect(
        promptMissing({ name: "Kaizen", featured: false }),
      ).rejects.toThrow("Missing required option(s)");
    } finally {
      if (original) {
        Object.defineProperty(process.stdin, "isTTY", original);
      } else {
        delete (process.stdin as { isTTY?: boolean }).isTTY;
      }
    }
  });
});
