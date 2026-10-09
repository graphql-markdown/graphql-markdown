import { EventEmitter } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const CANCEL = Symbol.for("cancel");

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

import {
  copyDirRecursive,
  detectLoader,
  initGitRepo,
  isGitAvailable,
  installDependencies,
  isRemoteSchemaSource,
  main,
  parseCliArgs,
  run,
  runCommand,
  toPackageName,
  validateGraphQLSchema,
  writeAppConfig,
  writeDocusaurusConfig,
  writeGenerateDocs,
  writeGraphqlrc,
  removeWatchBlock,
  writeNuxtConfig,
  writePackageJson,
  validateProjectDir,
  writeReadme,
} from "../../lib/create.mjs";

const templates = path.join(import.meta.dirname, "../../templates");
const VALID_SDL = "type Query { hello: String }\n";

let work: string;

/** Copy a template into a fresh temp dir. */
const stage = (framework: string): string => {
  const dir = path.join(work, `stage-${framework}`);
  copyDirRecursive(path.join(templates, framework), dir, [/^node_modules$/]);
  return dir;
};
const read = (...p: string[]): string => {
  return fs.readFileSync(path.join(...p), "utf-8");
};

/** Make mocked spawn emit a close/error event. */
const spawnResult = (code: Error | number): void => {
  mocks.spawn.mockImplementation(() => {
    const proc = new EventEmitter();
    queueMicrotask(() => {
      return code instanceof Error
        ? proc.emit("error", code)
        : proc.emit("close", code);
    });
    return proc;
  });
};

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-test-"));
  mocks.detect.mockResolvedValue({ name: "pnpm" });
  mocks.getUserAgent.mockReturnValue(null);
  // Default: not inside a git work tree, so initGitRepo proceeds to git init.
  mocks.spawn.mockImplementation((cmd: string, args: string[]) => {
    const proc = new EventEmitter();
    const isProbe = cmd === "git" && args[0] === "rev-parse";
    queueMicrotask(() => {
      return proc.emit("close", isProbe ? 1 : 0);
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
  mocks.prompts.outro.mockClear();
  mocks.prompts.cancel.mockClear();
  fs.rmSync(work, { recursive: true, force: true });
});

describe("pure helpers", () => {
  it.each([
    ["https://x.dev/graphql", "UrlLoader"],
    ["github:a/b/c.graphql", "GithubLoader"],
    ["git:a/b#main:c.graphql", "GitLoader"],
    ["schema.json", "JsonFileLoader"],
    ["schema.ts", "CodeFileLoader"],
    ["schema.graphql", "GraphQLFileLoader"],
    ["schema.unknown", "GraphQLFileLoader"],
  ])("detectLoader(%s) -> %s", (source, className) => {
    expect(detectLoader(source).className).toBe(className);
  });

  it("isRemoteSchemaSource", () => {
    expect(isRemoteSchemaSource("https://a")).toBe(true);
    expect(isRemoteSchemaSource("github:a")).toBe(true);
    expect(isRemoteSchemaSource("./a.graphql")).toBe(false);
  });

  it("copyDirRecursive honors exclusions and nests", () => {
    const src = path.join(work, "src");
    fs.mkdirSync(path.join(src, "a/b"), { recursive: true });
    fs.mkdirSync(path.join(src, "node_modules"));
    fs.writeFileSync(path.join(src, "a/b/f.txt"), "x");
    fs.writeFileSync(path.join(src, "node_modules/n.txt"), "x");
    const dst = path.join(work, "dst");
    copyDirRecursive(src, dst, [/^node_modules$/]);
    expect(fs.existsSync(path.join(dst, "a/b/f.txt"))).toBe(true);
    expect(fs.existsSync(path.join(dst, "node_modules"))).toBe(false);
  });

  it("validateGraphQLSchema", async () => {
    const good = path.join(work, "g.graphql");
    const bad = path.join(work, "b.graphql");
    fs.writeFileSync(good, VALID_SDL);
    fs.writeFileSync(bad, "type {");
    expect(await validateGraphQLSchema(good)).toBe(true);
    expect(await validateGraphQLSchema(bad)).toBe(false);
    expect(await validateGraphQLSchema(path.join(work, "missing"))).toBe(false);
  });

  describe("validateProjectDir", () => {
    it("accepts empty input when the default dir does not exist", () => {
      // process.chdir is unsupported in vitest workers; path.resolve reads cwd().
      vi.spyOn(process, "cwd").mockReturnValue(work);
      expect(validateProjectDir("")).toBeUndefined();
      expect(validateProjectDir(undefined)).toBeUndefined();
    });

    it("accepts a non-existent path and an empty dir", () => {
      const empty = path.join(work, "empty");
      fs.mkdirSync(empty);
      expect(validateProjectDir(path.join(work, "nope"))).toBeUndefined();
      expect(validateProjectDir(empty)).toBeUndefined();
    });

    it("rejects a non-empty dir", () => {
      const full = path.join(work, "full");
      fs.mkdirSync(full);
      fs.writeFileSync(path.join(full, "f.txt"), "x");
      expect(validateProjectDir(full)).toMatch(/is not empty/);
    });

    it("rejects a path that is a file", () => {
      const file = path.join(work, "file.txt");
      fs.writeFileSync(file, "x");
      expect(validateProjectDir(file)).toMatch(/is a file/);
    });
  });

  it("parseCliArgs", () => {
    expect(parseCliArgs(["--yes", "-d", "x", "--no-git"])).toEqual({
      yes: true,
      dir: "x",
      "no-git": true,
      positionals: [],
    });
  });

  it("parseCliArgs takes a positional dir, --dir wins", () => {
    expect(parseCliArgs(["my-docs", "-y"])).toMatchObject({
      dir: "my-docs",
      yes: true,
    });
    expect(parseCliArgs(["a", "--dir", "b"]).dir).toBe("b");
  });

  it("toPackageName", () => {
    expect(toPackageName("/x/Workspace")).toBe("workspace");
    expect(toPackageName("/x/My Docs!")).toBe("my-docs");
    expect(toPackageName("/x/.hidden")).toBe("hidden");
    expect(toPackageName("/x/___")).toBe("my-graphql-docs");
    expect(toPackageName("docs---")).toBe("docs");
    expect(toPackageName(`a${"-".repeat(50000)}b`)).toBe(
      `a${"-".repeat(50000)}b`,
    );
  });
});

describe("write* helpers (nuxt)", () => {
  it("writeAppConfig: no-op, title, color, and throws", () => {
    const dir = stage("nuxt");
    const file = path.join(dir, "app", "app.config.ts");
    const before = read(file);
    writeAppConfig(dir, "", "");
    expect(read(file)).toBe(before);
    writeAppConfig(dir, 'Ti"tle', "blue");
    expect(read(file)).toContain('siteTitle: "Ti\\"tle"');
    expect(read(file)).toContain('primary: "blue"');
    expect(() => {
      return writeAppConfig(dir, "Again", "");
    }).toThrow(/siteTitle/);
    fs.writeFileSync(file, "siteTitle: 'My API'\n");
    expect(() => {
      return writeAppConfig(dir, "", "red");
    }).toThrow(/defineAppConfig/);
  });

  it("writeGenerateDocs: default and non-default loader, throw", () => {
    const dir = stage("nuxt");
    const def = detectLoader("a.graphql");
    writeGenerateDocs(dir, "./schema/example.graphql", def);
    writeGenerateDocs(
      dir,
      "https://x/graphql",
      detectLoader("https://x/graphql"),
    );
    const out = read(dir, "generate-docs.ts");
    expect(out).toContain("schema: 'https://x/graphql'");
    expect(out).toContain("UrlLoader");
    expect(() => {
      return writeGenerateDocs(dir, "./other.graphql", def);
    }).toThrow(/nothing matched/);
  });

  it("removeWatchBlock: removes block, is linear on adversarial input", () => {
    const src =
      "a: 1,\n  // The layer's gqlmd-generate module\n  // more\n  watch: [x, y],\n  b: 2,\n";
    expect(removeWatchBlock(src)).toBe("a: 1,\n  b: 2,\n");
    expect(removeWatchBlock("nothing")).toBe("nothing");
    const evil = `// The layer's gqlmd-generate module${"\n ".repeat(50000)}`;
    const start = Date.now();
    expect(removeWatchBlock(evil)).toBe(evil);
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it("writeNuxtConfig: local, remote, throws", () => {
    const dir = stage("nuxt");
    const file = path.join(dir, "nuxt.config.ts");
    const original = read(file);
    writeNuxtConfig(dir, "./schema/schema.json", false);
    expect(read(file)).toContain("./schema/schema.json");
    fs.writeFileSync(file, original);
    writeNuxtConfig(dir, "https://x", true);
    expect(read(file)).not.toContain("fileURLToPath");
    expect(() => {
      return writeNuxtConfig(dir, "https://x", true);
    }).toThrow(/watch block/);
    fs.writeFileSync(file, "nothing");
    expect(() => {
      return writeNuxtConfig(dir, "./other.gql", false);
    }).toThrow(/example.graphql/);
    fs.writeFileSync(
      file,
      original.replace('import { fileURLToPath } from "node:url";\n\n', ""),
    );
    expect(() => {
      return writeNuxtConfig(dir, "https://x", true);
    }).toThrow(/fileURLToPath/);
  });

  it("writePackageJson", () => {
    const dir = stage("nuxt");
    writePackageJson(dir, path.join(work, "my-proj"), detectLoader("a.json"));
    const pkg = JSON.parse(read(dir, "package.json"));
    expect(pkg.name).toBe("my-proj");
    expect(pkg.dependencies["@graphql-tools/json-file-loader"]).toBe("latest");
    writePackageJson(dir, path.join(work, "p2"), detectLoader("a.graphql"));
    expect(JSON.parse(read(dir, "package.json")).name).toBe("p2");
  });

  it("writeReadme: no-op, local, remote, throw", () => {
    const dir = stage("nuxt");
    const loader = detectLoader("a.graphql");
    const before = read(dir, "README.md");
    writeReadme(dir, undefined, "./schema/example.graphql", loader);
    expect(read(dir, "README.md")).toBe(before);
    writeReadme(dir, "a.graphql", "./schema/schema.graphql", loader);
    expect(read(dir, "README.md")).toContain("`./schema/schema.graphql`");
    fs.writeFileSync(path.join(dir, "README.md"), before);
    writeReadme(dir, "https://x", "https://x", detectLoader("https://x"));
    expect(read(dir, "README.md")).toContain("no local schema file");
    fs.writeFileSync(path.join(dir, "README.md"), "# nothing\n");
    expect(() => {
      return writeReadme(dir, "a", "./a", loader);
    }).toThrow(/schema section/);
  });
});

describe("write* helpers (docusaurus)", () => {
  it("writeGraphqlrc: default, url loader, other loader, throws", () => {
    const dir = stage("docusaurus");
    const file = path.join(dir, ".graphqlrc");
    const original = read(file);
    writeGraphqlrc(dir, "./schema/example.graphql", detectLoader("a.graphql"));
    expect(read(file)).toBe(original);
    writeGraphqlrc(dir, "https://x", detectLoader("https://x"));
    expect(read(file)).toContain("method: 'POST'");
    fs.writeFileSync(file, original);
    writeGraphqlrc(dir, "./schema/s.json", detectLoader("s.json"));
    expect(read(file)).toContain(
      "JsonFileLoader: '@graphql-tools/json-file-loader'",
    );
    fs.writeFileSync(file, "nothing");
    expect(() => {
      return writeGraphqlrc(dir, "./s.gql", detectLoader("s.gql"));
    }).toThrow(/nothing matched/);
    fs.writeFileSync(file, "schema: './schema/example.graphql'\n");
    expect(() => {
      return writeGraphqlrc(dir, "./s.json", detectLoader("s.json"));
    }).toThrow(/GraphQLFileLoader/);
  });

  it("writeDocusaurusConfig: no-op, title, throw", () => {
    const dir = stage("docusaurus");
    const file = path.join(dir, "docusaurus.config.js");
    const before = read(file);
    writeDocusaurusConfig(dir, "");
    expect(read(file)).toBe(before);
    writeDocusaurusConfig(dir, "Hello");
    expect(read(file)).toContain('title: "Hello",');
    expect(() => {
      return writeDocusaurusConfig(dir, "Again");
    }).toThrow(/My API/);
  });

  it("writeDocusaurusConfig: title identical to the template's does not throw", () => {
    const dir = stage("docusaurus");
    const file = path.join(dir, "docusaurus.config.js");
    const before = read(file);
    expect(() => {
      return writeDocusaurusConfig(dir, "My API");
    }).not.toThrow();
    expect(read(file)).toBe(before);
  });
});

describe("process helpers", () => {
  it("runCommand resolves, rejects on exit code and spawn error", async () => {
    await expect(runCommand("x", [])).resolves.toBeUndefined();
    spawnResult(2);
    await expect(runCommand("x", [])).rejects.toThrow(/exit code 2/);
    spawnResult(new Error("boom"));
    await expect(runCommand("x", [])).rejects.toThrow("boom");
  });

  it("runCommand reports a missing executable on ENOENT", async () => {
    spawnResult(
      Object.assign(new Error("spawn git ENOENT"), { code: "ENOENT" }),
    );
    await expect(runCommand("git", [])).rejects.toThrow(
      "git is not installed or not on your PATH",
    );
  });

  it("isGitAvailable resolves true or false", async () => {
    spawnResult(0);
    await expect(isGitAvailable()).resolves.toBe(true);
    expect(mocks.spawn).toHaveBeenCalledWith(
      "git",
      ["--version"],
      expect.objectContaining({ stdio: "ignore" }),
    );
    spawnResult(new Error("spawn git ENOENT"));
    await expect(isGitAvailable()).resolves.toBe(false);
  });

  it("initGitRepo hints at user.name only when the commit fails", async () => {
    mocks.spawn.mockImplementation((cmd: string, args: string[]) => {
      const proc = new EventEmitter();
      queueMicrotask(() => {
        return proc.emit(
          "close",
          args[0] === "init" ? 0 : args[0] === "add" ? 0 : 1,
        );
      });
      return proc;
    });
    await initGitRepo(work);
    expect(mocks.prompts.log.warn).toHaveBeenLastCalledWith(
      expect.stringContaining("user.name"),
    );
  });

  it("initGitRepo omits the user.name hint when init fails", async () => {
    spawnResult(1);
    await initGitRepo(work);
    const message = mocks.prompts.log.warn.mock.calls.at(-1)?.[0];
    expect(message).toContain("Could not initialize git");
    expect(message).not.toContain("user.name");
  });

  it("installDependencies uses the package manager's command", async () => {
    await installDependencies("yarn", work);
    expect(mocks.spawn).toHaveBeenCalledWith(
      "yarn",
      [],
      expect.objectContaining({ cwd: work }),
    );
    await installDependencies("unknown-pm", work);
    expect(mocks.spawn).toHaveBeenLastCalledWith(
      "npm",
      ["install"],
      expect.anything(),
    );
    expect(mocks.prompts.log.success).toHaveBeenCalledTimes(2);
  });

  it("failures are logged, not thrown", async () => {
    spawnResult(1);
    await installDependencies("npm", work);
    expect(mocks.prompts.log.error).toHaveBeenCalled();
    await initGitRepo(work);
    expect(mocks.prompts.log.warn).toHaveBeenCalled();
  });

  it("initGitRepo probes, then runs init, add, commit silently", async () => {
    await initGitRepo(work);
    expect(
      mocks.spawn.mock.calls.map((c) => {
        return c[1][0];
      }),
    ).toEqual(["rev-parse", "init", "add", "commit"]);
    expect(mocks.spawn).toHaveBeenLastCalledWith(
      "git",
      expect.anything(),
      expect.objectContaining({ stdio: "ignore" }),
    );
  });

  it("initGitRepo skips inside an existing work tree", async () => {
    spawnResult(0);
    await initGitRepo(work);
    expect(mocks.spawn).toHaveBeenCalledTimes(1);
    expect(mocks.prompts.log.info).toHaveBeenCalledWith(
      expect.stringContaining("Already inside a git repository"),
    );
  });
});

describe("main", () => {
  const base = (name: string): string[] => {
    return ["--dir", path.join(work, name)];
  };
  const quiet = ["--yes", "--no-install", "--no-git"];

  it("--yes nuxt scaffold with example schema", async () => {
    const code = await main([...base("n"), ...quiet]);
    expect(code).toBe(0);
    expect(JSON.parse(read(work, "n", "package.json")).name).toBe("n");
    expect(mocks.spawn).not.toHaveBeenCalled();
  });

  it.each(["nuxt", "docusaurus"])(
    "%s scaffold contains .gitignore and no gitignore",
    async (framework) => {
      expect(
        await main([...base(framework), ...quiet, "--framework", framework]),
      ).toBe(0);
      const dir = path.join(work, framework);
      expect(fs.existsSync(path.join(dir, ".gitignore"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "gitignore"))).toBe(false);
    },
  );

  it("--yes docusaurus with local schema, title, color warning", async () => {
    const schema = path.join(work, "my.graphql");
    fs.writeFileSync(schema, "type {");
    const dir = path.join(work, "d");
    const code = await main([
      ...base("d"),
      "--yes",
      "--framework",
      "docusaurus",
      "--schema",
      schema,
      "--title",
      "Docs",
      "--color",
      "red",
      "--pm",
      "bun",
    ]);
    expect(code).toBe(0);
    expect(fs.existsSync(path.join(dir, "schema/schema.graphql"))).toBe(true);
    expect(read(dir, "docusaurus.config.js")).toContain('title: "Docs"');
    expect(mocks.prompts.log.warn).toHaveBeenCalledTimes(2);
    expect(mocks.spawn).toHaveBeenCalledTimes(6); // install + git --version + probe + 3 git
  });

  it("--yes nuxt with remote schema falls back to npm", async () => {
    mocks.detect.mockResolvedValue(null);
    const code = await main([
      ...base("r"),
      ...quiet,
      "--schema",
      "https://x.dev/graphql",
    ]);
    expect(code).toBe(0);
    expect(read(work, "r", "package.json")).toContain("url-loader");
    expect(mocks.prompts.outro).toHaveBeenCalledWith(
      expect.stringContaining("npm run dev"),
    );
  });

  it("interactive path with customization, schema and installs", async () => {
    const schema = path.join(work, "s.graphql");
    fs.writeFileSync(schema, VALID_SDL);
    mocks.detect.mockResolvedValue(null);
    mocks.prompts.select
      .mockResolvedValueOnce("nuxt")
      .mockResolvedValueOnce("existing")
      .mockResolvedValueOnce("yarn")
      .mockResolvedValueOnce("emerald");
    mocks.prompts.text
      .mockResolvedValueOnce(path.join(work, "i"))
      .mockResolvedValueOnce(schema)
      .mockResolvedValueOnce("Custom Title");
    mocks.prompts.confirm.mockResolvedValue(true);
    expect(await main([])).toBe(0);
    const dir = path.join(work, "i");
    expect(read(dir, "app/app.config.ts")).toContain('"Custom Title"');
    expect(read(dir, "app/app.config.ts")).toContain('"emerald"');
    expect(mocks.spawn).toHaveBeenCalledTimes(6);
  });

  it("interactive docusaurus, example schema, declines everything", async () => {
    mocks.prompts.select
      .mockResolvedValueOnce("docusaurus")
      .mockResolvedValueOnce("example");
    mocks.prompts.text.mockResolvedValueOnce(path.join(work, "x"));
    mocks.prompts.confirm.mockResolvedValue(false);
    expect(await main([])).toBe(0);
    expect(mocks.spawn).toHaveBeenCalledTimes(1); // git --version only
    expect(mocks.prompts.outro).toHaveBeenCalledWith(
      expect.stringContaining("run doc"),
    );
  });

  it("skips the git prompt when git is not installed", async () => {
    spawnResult(
      Object.assign(new Error("spawn git ENOENT"), { code: "ENOENT" }),
    );
    expect(await main([...base("ng"), "--yes", "--no-install"])).toBe(0);
    expect(mocks.prompts.confirm).not.toHaveBeenCalled();
    expect(mocks.prompts.log.info).toHaveBeenCalledWith(
      expect.stringContaining("git not found"),
    );
  });

  it("cancelled customization sub-prompt exits 1", async () => {
    mocks.prompts.select.mockResolvedValueOnce("example");
    mocks.prompts.confirm.mockResolvedValueOnce(true);
    mocks.prompts.text.mockResolvedValue(CANCEL);
    expect(
      await main([...base("c"), "--framework", "nuxt", "--no-install"]),
    ).toBe(1);
  });

  it("cancelled customization confirm exits 1", async () => {
    mocks.prompts.select.mockResolvedValueOnce("example");
    mocks.prompts.confirm.mockResolvedValue(CANCEL);
    expect(await main([...base("cc"), "--framework", "nuxt", "--no-git"])).toBe(
      1,
    );
  });

  it("invalid --pm exits 1", async () => {
    expect(await main(["--pm", "pip", "--yes"])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith(
      expect.stringContaining('Invalid --pm "pip"'),
    );
  });

  it("package manager comes from the user agent before detection", async () => {
    mocks.getUserAgent.mockReturnValue("bun");
    expect(await main([...base("ua"), "--yes", "--no-git"])).toBe(0);
    expect(mocks.spawn).toHaveBeenCalledWith(
      "bun",
      ["install"],
      expect.anything(),
    );
  });

  const dirArg = (): string[] => {
    return ["--dir", path.join(work, "z")];
  };
  it.each([
    [
      "framework",
      () => {
        return [];
      },
      { select: [CANCEL] },
    ],
    [
      "dir",
      () => {
        return ["--framework", "nuxt"];
      },
      { text: [CANCEL] },
    ],
    [
      "schema choice",
      () => {
        return ["--framework", "nuxt", ...dirArg()];
      },
      { select: [CANCEL] },
    ],
    [
      "schema path",
      () => {
        return ["--framework", "nuxt", ...dirArg()];
      },
      { select: ["existing"], text: [CANCEL] },
    ],
    [
      "package manager",
      () => {
        return ["--framework", "nuxt", ...dirArg(), "--example"];
      },
      { select: [CANCEL] },
    ],
  ])(
    "cancel at %s exits 1",
    async (_name, argv, answers: { select?: unknown[]; text?: unknown[] }) => {
      mocks.detect.mockResolvedValue(null);
      for (const v of answers.select ?? []) {
        mocks.prompts.select.mockResolvedValueOnce(v);
      }
      for (const v of answers.text ?? []) {
        mocks.prompts.text.mockResolvedValueOnce(v);
      }
      expect(await main(argv())).toBe(1);
      expect(mocks.prompts.cancel).toHaveBeenCalled();
      expect(fs.existsSync(path.join(work, "z"))).toBe(false);
    },
  );

  it("prompt validators", async () => {
    mocks.prompts.select.mockResolvedValueOnce("existing");
    mocks.prompts.text
      .mockResolvedValueOnce(path.join(work, "v"))
      .mockResolvedValueOnce(CANCEL);
    await main(["--framework", "nuxt"]);
    const dirValidate = mocks.prompts.text.mock.calls[0][0].validate;
    expect(dirValidate("")).toBeUndefined();
    expect(dirValidate("x")).toBeUndefined();
    const schemaValidate = mocks.prompts.text.mock.calls[1][0].validate;
    expect(schemaValidate("")).toMatch(/required/);
    expect(schemaValidate(path.join(work, "nope"))).toMatch(/not found/);
    expect(schemaValidate("https://x")).toBeUndefined();
    expect(schemaValidate(work)).toMatch(/is a directory/);
  });

  it("scaffolding into an existing empty dir preserves its inode", async () => {
    const dir = path.join(work, "empty");
    fs.mkdirSync(dir);
    const before = fs.statSync(dir).ino;
    expect(await main(["--dir", dir, ...quiet])).toBe(0);
    expect(fs.statSync(dir).ino).toBe(before);
    expect(fs.existsSync(path.join(dir, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(dir, ".gitignore"))).toBe(true);
  });

  it("--schema pointing at a missing path or a directory exits 1 early", async () => {
    const missing = path.join(work, "nope.graphql");
    expect(await main([...base("m"), ...quiet, "--schema", missing])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith(
      expect.stringContaining("not found"),
    );
    expect(await main([...base("m"), ...quiet, "--schema", work])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith(
      expect.stringContaining("is a directory"),
    );
    expect(fs.existsSync(path.join(work, "m"))).toBe(false);
  });

  it("SDL validation only runs for the default SDL loader", async () => {
    const bad = "type {";
    const sdl = path.join(work, "bad.graphql");
    const json = path.join(work, "bad.json");
    fs.writeFileSync(sdl, bad);
    fs.writeFileSync(json, bad);
    expect(await main([...base("s1"), ...quiet, "--schema", json])).toBe(0);
    expect(mocks.prompts.log.warn).not.toHaveBeenCalled();
    expect(await main([...base("s2"), ...quiet, "--schema", sdl])).toBe(0);
    expect(mocks.prompts.log.warn).toHaveBeenCalledWith(
      expect.stringContaining("did not parse"),
    );
  });

  it("--dir pointing at an existing file exits 1 with a friendly message", async () => {
    const file = path.join(work, "afile");
    fs.writeFileSync(file, "x");
    expect(await main(["--dir", file, "--yes"])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith(
      expect.stringContaining("is a file"),
    );
    expect(read(file)).toBe("x");
  });

  it("EXDEV on rename falls back to copy", async () => {
    const real = fs.renameSync;
    vi.spyOn(fs, "renameSync").mockImplementation((from, to) => {
      if (
        String(from).includes("gqlmd-") &&
        !String(from).endsWith("gitignore")
      ) {
        throw Object.assign(new Error("exdev"), { code: "EXDEV" });
      }
      return real(from, to);
    });
    expect(await main([...base("e"), ...quiet])).toBe(0);
    expect(fs.existsSync(path.join(work, "e", "package.json"))).toBe(true);
  });

  it("other rename errors propagate; run() reports exit 1", async () => {
    vi.spyOn(fs, "renameSync").mockImplementation(() => {
      throw Object.assign(new Error("denied"), { code: "EACCES" });
    });
    await expect(main([...base("f"), ...quiet])).rejects.toThrow("denied");
    expect(await run([...base("f"), ...quiet])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith("denied");
  });

  it("run() passes through success", async () => {
    expect(await run([...base("ok"), ...quiet])).toBe(0);
  });

  it("invalid --framework exits 1", async () => {
    expect(await main(["--framework", "vue", "--yes"])).toBe(1);
    expect(mocks.prompts.log.error).toHaveBeenCalledWith(
      expect.stringContaining('Invalid --framework "vue"'),
    );
  });

  it("non-empty target dir exits 1 and is left untouched", async () => {
    const dir = path.join(work, "full");
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "keep.txt"), "x");
    expect(await main(["--dir", dir, "--yes"])).toBe(1);
    expect(read(dir, "keep.txt")).toBe("x");
  });

  it("template drift (no match) throws and cleans up", async () => {
    const schema = path.join(work, "s.gql");
    fs.writeFileSync(schema, VALID_SDL);
    const orig = fs.readFileSync;
    vi.spyOn(fs, "readFileSync").mockImplementation(((
      p: fs.PathOrFileDescriptor,
      enc?: BufferEncoding,
    ) => {
      const out = orig(p, enc);
      return String(p).endsWith("generate-docs.ts") && typeof out === "string"
        ? "// drifted"
        : out;
    }) as never);
    await expect(
      main([...base("t"), ...quiet, "--schema", schema]),
    ).rejects.toThrow(/nothing matched/);
    expect(fs.existsSync(path.join(work, "t"))).toBe(false);
  });
});
