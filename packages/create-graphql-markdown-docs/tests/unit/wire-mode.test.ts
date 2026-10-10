import { EventEmitter } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    spawn: vi.fn(),
    detect: vi.fn(),
    getUserAgent: vi.fn(),
    prompts: {
      intro: vi.fn(),
      outro: vi.fn(),
      cancel: vi.fn(),
      select: vi.fn(),
      text: vi.fn(),
      confirm: vi.fn(),
      note: vi.fn(),
      spinner: vi.fn(() => {
        return { start: vi.fn(), stop: vi.fn() };
      }),
      isCancel: vi.fn((v: unknown) => {
        return v === Symbol.for("cancel");
      }),
      log: {
        info: vi.fn(),
        success: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      },
    },
  };
});

vi.mock("node:child_process", () => {
  return { spawn: mocks.spawn };
});
vi.mock("package-manager-detector", () => {
  return { detect: mocks.detect, getUserAgent: mocks.getUserAgent };
});
vi.mock("@clack/prompts", () => {
  return mocks.prompts;
});

import { main } from "../../lib/create.mjs";

let work: string;

const SCHEMA_SDL = "type Query { a: String }\n";
const STARLIGHT_PKG = JSON.stringify({
  devDependencies: { "@astrojs/starlight": "1" },
});

/** Writes a files map (relative path to content) into the target dir. */
const seed = (dir: string, files: Record<string, string>): void => {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
};

/** Absolute schema path inside the target dir (relative paths resolve against cwd). */
const schemaIn = (dir: string): string => {
  const file = path.join(dir, "s.graphql");
  fs.writeFileSync(file, SCHEMA_SDL);
  return file;
};

const read = (...p: string[]): string => {
  return fs.readFileSync(path.join(...p), "utf-8");
};

/** All text passed to prompts.log.error, joined. */
const errors = (): string => {
  return mocks.prompts.log.error.mock.calls
    .map((call) => {
      return String(call[0]);
    })
    .join("\n");
};

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "wire-mode-test-"));
  mocks.detect.mockResolvedValue({ name: "pnpm" });
  mocks.getUserAgent.mockReturnValue(null);
  mocks.spawn.mockImplementation(() => {
    const proc = new EventEmitter();
    queueMicrotask(() => {
      return proc.emit("close", 0);
    });
    return proc;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  mocks.spawn.mockReset();
  mocks.detect.mockReset();
  mocks.getUserAgent.mockReset();
  mocks.prompts.select.mockReset();
  mocks.prompts.text.mockReset();
  mocks.prompts.confirm.mockReset();
  for (const fn of Object.values(mocks.prompts.log)) fn.mockClear();
  mocks.prompts.note.mockClear();
  mocks.prompts.outro.mockClear();
  mocks.prompts.cancel.mockClear();
  fs.rmSync(work, { recursive: true, force: true });
});

describe("scaffold vs wire mode (end to end)", () => {
  const quiet = ["--no-install", "--no-git"];

  it("1. missing target dir with --yes --example scaffolds a project", async () => {
    const dir = path.join(work, "missing");
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
  });

  it("2. empty existing target with --yes --example scaffolds", async () => {
    const dir = path.join(work, "empty");
    fs.mkdirSync(dir);
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
  });

  it("3. target with only .git/ and .DS_Store still scaffolds", async () => {
    const dir = path.join(work, "ignorable");
    seed(dir, { ".DS_Store": "" });
    fs.mkdirSync(path.join(dir, ".git"));
    expect(await main(["--dir", dir, "--yes", "--example", ...quiet])).toBe(0);
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
  });

  it("4. target with only README.md enters wire mode and leaves README intact", async () => {
    const dir = path.join(work, "readme");
    seed(dir, { "README.md": "# Hello\n" });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--framework",
        "generic",
        "--schema",
        schema,
        "--output",
        "docs/api",
      ]),
    ).toBe(0);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(true);
    expect(read(dir, "README.md")).toBe("# Hello\n");
  });

  it("5. starlight project is wired with the starlight formatter and a docs script", async () => {
    const dir = path.join(work, "starlight");
    seed(dir, { "package.json": STARLIGHT_PKG });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "src/content/docs/api",
      ]),
    ).toBe(0);
    const rc = read(dir, ".graphqlrc");
    expect(rc).toContain("formatters/starlight");
    expect(rc).toContain("rootPath: './src/content/docs'");
    const pkg = JSON.parse(read(dir, "package.json"));
    expect(pkg.scripts["docs:api"]).toBe("gqlmd graphql-to-doc");
  });

  it("6. two detected frameworks without --framework exit 1", async () => {
    const dir = path.join(work, "two");
    seed(dir, {
      "package.json": JSON.stringify({
        dependencies: { "@astrojs/starlight": "1", vocs: "1" },
      }),
    });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "docs/api",
      ]),
    ).toBe(1);
    expect(errors()).toContain("--framework");
    expect(errors()).toContain("Astro Starlight");
    expect(errors()).toContain("Vocs");
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(false);
  });

  it("7. non-empty folder without package.json exits 1 and suggests generic", async () => {
    const dir = path.join(work, "nopkg");
    seed(dir, { "docs/intro.md": "# Intro\n" });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "docs/api",
      ]),
    ).toBe(1);
    expect(errors()).toContain("--framework generic");
  });

  it("8. --new on a non-empty target exits 1", async () => {
    const dir = path.join(work, "new-full");
    seed(dir, { "keep.txt": "x" });
    expect(await main(["--dir", dir, "--yes", "--new"])).toBe(1);
    expect(errors()).toContain("--new never writes into an existing project");
    expect(read(dir, "keep.txt")).toBe("x");
  });

  it("9. --existing on an empty target exits 1", async () => {
    const dir = path.join(work, "existing-empty");
    fs.mkdirSync(dir);
    expect(await main(["--dir", dir, "--yes", "--existing"])).toBe(1);
    expect(errors()).toContain("Drop --existing");
  });

  it("10. --new with --existing exits 1", async () => {
    const dir = path.join(work, "both");
    expect(await main(["--dir", dir, "--yes", "--new", "--existing"])).toBe(1);
    expect(errors()).toContain("cannot be used together");
  });

  it("11. --title on a non-empty target exits 1", async () => {
    const dir = path.join(work, "title-full");
    seed(dir, { "docs/a.md": "x" });
    expect(await main(["--dir", dir, "--yes", "--title", "X"])).toBe(1);
    expect(errors()).toContain(
      "--title only applies when creating a new project",
    );
  });

  it("12. --output on an empty target exits 1", async () => {
    const dir = path.join(work, "output-empty");
    fs.mkdirSync(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--example",
        "--output",
        "docs",
        ...quiet,
      ]),
    ).toBe(1);
    expect(errors()).toContain(
      "--output only applies when adding GraphQL-Markdown to an existing project",
    );
  });

  it("13. --framework starlight on an empty target exits 1 with the create command", async () => {
    const dir = path.join(work, "starlight-empty");
    fs.mkdirSync(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--example",
        "--framework",
        "starlight",
        ...quiet,
      ]),
    ).toBe(1);
    expect(errors()).toContain("No template for Astro Starlight");
    expect(errors()).toContain("npm create astro@latest");
  });

  it("14. no dir scaffolds into <cwd>/my-graphql-docs", async () => {
    const cwd = path.join(work, "cwd");
    fs.mkdirSync(cwd);
    vi.spyOn(process, "cwd").mockReturnValue(cwd);
    expect(await main(["--yes", "--example", ...quiet])).toBe(0);
    expect(
      fs.existsSync(path.join(cwd, "my-graphql-docs", "package.json")),
    ).toBe(true);
  });

  it("15. existing .graphqlrc is not overwritten and the merge block is shown", async () => {
    const dir = path.join(work, "has-rc");
    seed(dir, {
      "package.json": STARLIGHT_PKG,
      ".graphqlrc": "schema: x\n",
    });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "src/content/docs/api",
      ]),
    ).toBe(0);
    expect(read(dir, ".graphqlrc")).toBe("schema: x\n");
    expect(mocks.prompts.note).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("Merge"),
    );
  });

  it("16. package.json graphql key is kept and no .graphqlrc is created", async () => {
    const dir = path.join(work, "pkg-key");
    seed(dir, {
      "package.json": JSON.stringify({
        devDependencies: { "@astrojs/starlight": "1" },
        graphql: {},
      }),
    });
    const schema = schemaIn(dir);
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "src/content/docs/api",
      ]),
    ).toBe(0);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(false);
    expect(mocks.prompts.note).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("Merge"),
    );
  });

  it("17. --dry-run writes nothing and shows the plan", async () => {
    const dir = path.join(work, "dry");
    seed(dir, { "package.json": STARLIGHT_PKG });
    const schema = schemaIn(dir);
    const before = read(dir, "package.json");
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--schema",
        schema,
        "--output",
        "src/content/docs/api",
        "--dry-run",
      ]),
    ).toBe(0);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(false);
    expect(read(dir, "package.json")).toBe(before);
    expect(mocks.prompts.note).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("Dry run"),
    );
  });
});
