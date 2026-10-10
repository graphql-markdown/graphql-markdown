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

  it("16b. --output . (the project root) exits 1 and writes nothing", async () => {
    const dir = path.join(work, "output-root");
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
        ".",
      ]),
    ).toBe(1);
    expect(errors()).toContain(
      "Output folder must be a subfolder of the project.",
    );
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(false);
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

  const ADD_STARLIGHT = [
    "add",
    "--save-dev",
    "@graphql-markdown/cli",
    "@graphql-markdown/formatters",
    "@graphql-tools/graphql-file-loader",
  ];

  /** Text passed to prompts.outro (the closing summary). */
  const outro = (): string => {
    return String(mocks.prompts.outro.mock.calls.at(-1)?.[0] ?? "");
  };

  /** Argv for a starlight wire run into `dir`, with the given extra flags. */
  const starlightArgs = (dir: string, ...extra: string[]): string[] => {
    return [
      "--dir",
      dir,
      "--yes",
      "--schema",
      schemaIn(dir),
      "--output",
      "src/content/docs/api",
      ...extra,
    ];
  };

  it("18. --install on a starlight wire run adds the packages in the target dir", async () => {
    const dir = path.join(work, "install");
    seed(dir, { "package.json": STARLIGHT_PKG });
    expect(await main(starlightArgs(dir, "--install"))).toBe(0);
    expect(mocks.spawn).toHaveBeenCalledWith(
      "pnpm",
      ADD_STARLIGHT,
      expect.objectContaining({ cwd: dir }),
    );
    expect(outro()).not.toContain("--save-dev");
  });

  it("19. --install whose command fails exits 0, keeps .graphqlrc and shows the catch-up command", async () => {
    const dir = path.join(work, "install-fails");
    seed(dir, { "package.json": STARLIGHT_PKG });
    mocks.spawn.mockImplementation(() => {
      const proc = new EventEmitter();
      queueMicrotask(() => {
        return proc.emit("close", 1);
      });
      return proc;
    });
    expect(await main(starlightArgs(dir, "--install"))).toBe(0);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(true);
    expect(errors()).toContain("Install dev dependencies failed");
    expect(outro()).toContain("Some steps did not complete");
    expect(outro()).toContain(
      "pnpm add --save-dev @graphql-markdown/cli @graphql-markdown/formatters",
    );
  });

  it("20. without --install nothing is installed and the add command is the next step", async () => {
    const dir = path.join(work, "no-install");
    seed(dir, { "package.json": STARLIGHT_PKG });
    expect(await main(starlightArgs(dir))).toBe(0);
    expect(mocks.spawn).not.toHaveBeenCalled();
    expect(outro()).toContain(
      "pnpm add --save-dev @graphql-markdown/cli @graphql-markdown/formatters",
    );
  });

  it("21. --install without package.json warns and installs nothing", async () => {
    const dir = path.join(work, "install-nopkg");
    seed(dir, { "README.md": "# Hello\n" });
    expect(
      await main([
        "--dir",
        dir,
        "--yes",
        "--framework",
        "generic",
        "--schema",
        schemaIn(dir),
        "--output",
        "docs/api",
        "--install",
      ]),
    ).toBe(0);
    expect(mocks.prompts.log.warn).toHaveBeenCalledWith(
      expect.stringContaining("--install ignored"),
    );
    expect(mocks.spawn).not.toHaveBeenCalled();
  });

  it("22. --dry-run --install reports the install and runs nothing", async () => {
    const dir = path.join(work, "dry-install");
    seed(dir, { "package.json": STARLIGHT_PKG });
    expect(await main(starlightArgs(dir, "--dry-run", "--install"))).toBe(0);
    expect(mocks.spawn).not.toHaveBeenCalled();
    expect(mocks.prompts.log.info).toHaveBeenCalledWith(
      expect.stringContaining("Would install:"),
    );
  });

  it("23. packages already in devDependencies are not installed even with --install", async () => {
    const dir = path.join(work, "all-present");
    seed(dir, {
      "package.json": JSON.stringify({
        devDependencies: {
          "@astrojs/starlight": "1",
          "@graphql-markdown/cli": "1",
          "@graphql-markdown/formatters": "1",
          "@graphql-tools/graphql-file-loader": "1",
        },
      }),
    });
    expect(await main(starlightArgs(dir, "--install"))).toBe(0);
    expect(mocks.spawn).not.toHaveBeenCalled();
    expect(outro()).not.toContain("--save-dev");
  });
});

describe("wire mode interactive prompts", () => {
  interface PromptConfig {
    message: string;
    options?: { value: string }[];
    initialValue?: string;
    validate?: (value: string) => string | undefined;
  }

  /** Non-empty project dir (wire mode needs files) with a ready-to-use schema. */
  const project = (
    name: string,
    files: Record<string, string> = {},
  ): { dir: string; schema: string } => {
    const dir = path.join(work, name);
    seed(dir, { "README.md": "# Project\n", ...files });
    return { dir, schema: schemaIn(dir) };
  };

  /** Runs wire mode interactively: `--existing` on an explicit dir, no `--yes`. */
  const runInteractive = async (
    dir: string,
    flags: string[],
  ): Promise<number> => {
    mocks.prompts.confirm.mockResolvedValue(true);
    return main(["--dir", dir, "--existing", ...flags]);
  };

  /** Config passed to the nth call of a mocked prompt. */
  const callConfig = (
    fn: typeof mocks.prompts.select,
    index = 0,
  ): PromptConfig => {
    return fn.mock.calls[index][0] as PromptConfig;
  };

  /** Texts of every prompts.log.warn call, joined. */
  const warnings = (): string => {
    return mocks.prompts.log.warn.mock.calls
      .map((call) => {
        return String(call[0]);
      })
      .join("\n");
  };

  /** Flags for a generic-framework run with a valid schema and output. */
  const genericFlags = (schema: string, extra: string[] = []): string[] => {
    return [
      "--framework",
      "generic",
      "--schema",
      schema,
      "--output",
      "docs/api",
      ...extra,
    ];
  };

  describe("resolveWireFramework", () => {
    it("one detected framework: full list, preselects the detected id", async () => {
      const { dir, schema } = project("fw-one", {
        "package.json": STARLIGHT_PKG,
      });
      mocks.prompts.select.mockResolvedValue("starlight");
      mocks.prompts.text.mockResolvedValue("");
      const flags = ["--schema", schema, "--output", "docs/api"];
      expect(await runInteractive(dir, flags)).toBe(0);
      const config = callConfig(mocks.prompts.select);
      expect(config.options?.length).toBeGreaterThan(2);
      expect(
        config.options?.map((o) => {
          return o.value;
        }),
      ).toContain("generic");
      expect(config.initialValue).toBe("starlight");
    });

    it("two detected frameworks: list narrowed to the matches, no initialValue", async () => {
      const { dir, schema } = project("fw-two", {
        "package.json": JSON.stringify({
          dependencies: { "@astrojs/starlight": "1", vocs: "1" },
        }),
      });
      mocks.prompts.select.mockResolvedValue("vocs");
      mocks.prompts.text.mockResolvedValue("");
      const flags = ["--schema", schema, "--output", "docs/api"];
      expect(await runInteractive(dir, flags)).toBe(0);
      const config = callConfig(mocks.prompts.select);
      expect(
        config.options
          ?.map((o) => {
            return o.value;
          })
          .sort(),
      ).toEqual(["starlight", "vocs"]);
      expect(config.initialValue).toBeUndefined();
    });

    it("none detected: full list, preselects generic", async () => {
      const { dir, schema } = project("fw-none");
      mocks.prompts.select.mockResolvedValue("mkdocs");
      const flags = ["--schema", schema, "--output", "docs/api"];
      expect(await runInteractive(dir, flags)).toBe(0);
      const config = callConfig(mocks.prompts.select);
      expect(config.options?.length).toBeGreaterThan(2);
      expect(config.initialValue).toBe("generic");
    });

    it("invalid --framework exits 1", async () => {
      const { dir, schema } = project("fw-invalid");
      const flags = ["--framework", "foo", "--schema", schema];
      expect(
        await runInteractive(dir, [...flags, "--output", "docs/api"]),
      ).toBe(1);
      expect(errors()).toContain('Invalid --framework "foo"');
      expect(mocks.prompts.select).not.toHaveBeenCalled();
    });
  });

  describe("resolveWireSchema", () => {
    it("without --schema asks for a path with a text prompt", async () => {
      const { dir, schema } = project("schema-prompt");
      mocks.prompts.text
        .mockResolvedValueOnce(` ${schema} `)
        .mockResolvedValue("");
      const flags = ["--framework", "generic", "--output", "docs/api"];
      expect(await runInteractive(dir, flags)).toBe(0);
      const config = callConfig(mocks.prompts.text);
      expect(config.message).toContain("Schema source");
      expect(config.validate?.("")).toBe("Schema source is required");
      expect(read(dir, ".graphqlrc")).toContain("s.graphql");
    });

    it("an invalid --schema value exits 1", async () => {
      const { dir } = project("schema-invalid");
      const missing = path.join(dir, "nope.graphql");
      expect(await runInteractive(dir, genericFlags(missing))).toBe(1);
      expect(errors()).toContain("Schema file not found");
    });
  });

  describe("resolveWireOutput", () => {
    it("without --output asks with the framework hint and validates the answer", async () => {
      const { dir, schema } = project("output-prompt", {
        "package.json": STARLIGHT_PKG,
      });
      mocks.prompts.select.mockResolvedValue("starlight");
      mocks.prompts.text
        .mockResolvedValueOnce("docs/api")
        .mockResolvedValue("");
      const flags = ["--schema", schema];
      expect(await runInteractive(dir, flags)).toBe(0);
      const config = callConfig(mocks.prompts.text);
      expect(config.message).toContain("Output folder");
      expect(config.message).toContain(
        "Astro Starlight reads content from src/content/docs/",
      );
      expect(config.validate?.("../outside")).toBe(
        "Output folder must be inside the project.",
      );
      expect(config.validate?.("docs/api")).toBeUndefined();
    });

    it("warns when the output folder already has files", async () => {
      const { dir, schema } = project("output-warn", {
        "docs/api/old.md": "# Old\n",
      });
      mocks.prompts.text.mockResolvedValue("");
      expect(await runInteractive(dir, genericFlags(schema))).toBe(0);
      expect(warnings()).toContain("already exists and is not empty");
    });
  });

  describe("site base and link root", () => {
    const starlightRun = (name: string): Promise<number> & { dir: string } => {
      const { dir, schema } = project(name, { "package.json": STARLIGHT_PKG });
      mocks.prompts.select.mockResolvedValue("starlight");
      const flags = [
        "--schema",
        schema,
        "--output",
        "src/content/docs/guides/api",
      ];
      return Object.assign(runInteractive(dir, flags), { dir });
    };

    it("absolute links: site-base prompt (blank gives /) then pre-filled link root", async () => {
      mocks.prompts.text
        .mockResolvedValueOnce("  ")
        .mockResolvedValueOnce("/guides");
      const run = starlightRun("links-absolute");
      expect(await run).toBe(0);
      const siteBase = callConfig(mocks.prompts.text, 0);
      const linkRoot = callConfig(mocks.prompts.text, 1);
      expect(siteBase.message).toContain("Base path");
      expect(linkRoot.message).toContain("Link root");
      expect(linkRoot.initialValue).toBe("/guides");
      expect(read(run.dir, ".graphqlrc")).toContain("linkRoot: '/guides'");
    });

    it("blank link root leaves linkRoot out of .graphqlrc", async () => {
      mocks.prompts.text.mockResolvedValueOnce("/").mockResolvedValueOnce("");
      const run = starlightRun("links-blank");
      expect(await run).toBe(0);
      expect(read(run.dir, ".graphqlrc")).not.toContain("linkRoot");
    });

    it("relative links (MkDocs) show neither prompt", async () => {
      const { dir, schema } = project("links-relative");
      mocks.prompts.select.mockResolvedValue("mkdocs");
      const flags = ["--schema", schema, "--output", "docs/api"];
      expect(await runInteractive(dir, flags)).toBe(0);
      expect(mocks.prompts.text).not.toHaveBeenCalled();
    });

    it("generic: link-root prompt without a suggestion", async () => {
      const { dir, schema } = project("links-generic");
      mocks.prompts.text.mockResolvedValue("");
      expect(await runInteractive(dir, genericFlags(schema))).toBe(0);
      expect(mocks.prompts.text).toHaveBeenCalledTimes(1);
      const config = callConfig(mocks.prompts.text);
      expect(config.message).toContain("Link root");
      expect(config.initialValue).toBeUndefined();
    });
  });

  describe("checkFormatter", () => {
    const withFormatter = async (
      name: string,
      formatter: string,
    ): Promise<void> => {
      const { dir, schema } = project(name, { "local.mjs": "export {};\n" });
      mocks.prompts.text.mockResolvedValue("");
      const flags = genericFlags(schema, ["--formatter", formatter]);
      expect(await runInteractive(dir, flags)).toBe(0);
    };

    it("warns when a local formatter file is missing", async () => {
      await withFormatter("fmt-missing", "./missing.mjs");
      expect(warnings()).toContain("./missing.mjs does not exist.");
    });

    it("warns when a formatter package is not installed", async () => {
      await withFormatter("fmt-pkg", "some-uninstalled-pkg");
      expect(warnings()).toContain(
        "some-uninstalled-pkg is not installed in the project yet.",
      );
    });

    it("does not warn for an existing local formatter", async () => {
      await withFormatter("fmt-ok", "./local.mjs");
      expect(warnings()).not.toContain("does not exist");
      expect(warnings()).not.toContain("not installed");
    });
  });
});
