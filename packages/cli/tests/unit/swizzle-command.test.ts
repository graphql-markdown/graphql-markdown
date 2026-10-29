import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import {
  generateFormatterSource,
  getSwizzleCommand,
  SWIZZLE_PRESETS,
} from "../../src/swizzle-command";

const METHODS = [
  "formatMDXBadge",
  "formatMDXAdmonition",
  "formatMDXBullet",
  "formatMDXDetails",
  "formatMDXFrontmatter",
  "formatMDXLink",
  "formatMDXNameEntity",
  "formatMDXPermalink",
  "formatMDXSpecifiedByLink",
];

describe("generateFormatterSource", () => {
  const source = generateFormatterSource("hugo", {
    default: {},
    __esModule: true,
    "module.exports": {},
    createMDXFormatter: () => {
      return {};
    },
    formatMDXBadge: () => {
      return "";
    },
    mdxExtension: ".md",
    beforeGenerateIndexMetafileHook: () => {
      return undefined;
    },
  });

  test("contains header and import", () => {
    expect(source).toContain("gqlmd swizzle hugo");
    expect(source).toContain(
      'import * as preset from "@graphql-markdown/formatters/hugo";',
    );
  });

  test("emits the 9 formatter functions delegating to the preset", () => {
    for (const name of METHODS) {
      expect(source).toContain(`export const ${name} = (`);
      expect(source).toContain(`preset.${name}(`);
    }
  });

  test("emits createMDXFormatter with all methods", () => {
    expect(source).toContain("export const createMDXFormatter = (meta) => ({");
    for (const name of METHODS) {
      expect(source).toMatch(new RegExp(`^  ${name}[,:]`, "m"));
    }
  });

  test("forwards meta to meta-aware methods", () => {
    expect(source).toContain(
      "  formatMDXAdmonition: (admonition, _meta) => formatMDXAdmonition(admonition, meta ?? _meta),",
    );
    expect(source).toContain(
      "  formatMDXPermalink: (id) => formatMDXPermalink(id, meta),",
    );
  });

  test("header names the default output path", () => {
    expect(source).toContain(
      'set `formatter: "./graphql-markdown.formatter.mjs"`',
    );
  });

  test("header names a custom output path", () => {
    expect(generateFormatterSource("hugo", {}, "./docs/my.mjs")).toContain(
      'set `formatter: "./docs/my.mjs"`',
    );
  });

  test("re-exports extra exports sorted, skipping default", () => {
    const a = source.indexOf(
      "export const beforeGenerateIndexMetafileHook = preset.beforeGenerateIndexMetafileHook;",
    );
    const b = source.indexOf(
      "export const mdxExtension = preset.mdxExtension;",
    );
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(source).not.toContain("preset.default");
    expect(source).not.toContain("__esModule");
    expect(source).not.toContain("module.exports");
    expect(source).not.toContain("export const default");
  });
});

describe("swizzle command", () => {
  let output: string;

  beforeEach(() => {
    output = "";
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      output += String(chunk);
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  const run = async (
    args: string[],
    deps: Parameters<typeof getSwizzleCommand>[0],
  ): Promise<void> => {
    await getSwizzleCommand(deps).parseAsync(["node", "swizzle", ...args], {
      from: "node",
    });
  };

  const makeDeps = (existing = false) => {
    return {
      importPreset: vi.fn().mockResolvedValue({ mdxExtension: ".md" }),
      exists: vi.fn().mockResolvedValue(existing),
      writeOutput: vi.fn().mockResolvedValue(undefined),
    };
  };

  test("unknown preset sets exit code and lists presets", async () => {
    const deps = makeDeps();
    await run(["nope"], deps);
    expect(process.exitCode).toBe(1);
    expect(output).toContain(SWIZZLE_PRESETS.join(", "));
    expect(deps.writeOutput).not.toHaveBeenCalled();
  });

  test("existing file without --force errors", async () => {
    const deps = makeDeps(true);
    await run(["hugo"], deps);
    expect(process.exitCode).toBe(1);
    expect(output).toContain("already exists");
    expect(deps.writeOutput).not.toHaveBeenCalled();
  });

  test("existing file with --force is overwritten", async () => {
    const deps = makeDeps(true);
    await run(["hugo", "--force", "-o", "out/f.mjs"], deps);
    expect(process.exitCode).toBeUndefined();
    expect(deps.writeOutput).toHaveBeenCalledWith(
      expect.stringContaining("f.mjs"),
      expect.stringContaining('formatter: "./out/f.mjs"'),
    );
    expect(output).toContain('Formatter "hugo" swizzled to');
    expect(output).toContain('formatter: "./out/f.mjs"');
  });

  test("writes to the default path", async () => {
    const deps = makeDeps();
    await run(["hugo"], deps);
    expect(deps.writeOutput).toHaveBeenCalledWith(
      expect.stringContaining("graphql-markdown.formatter.mjs"),
      expect.any(String),
    );
    expect(output).toContain("formatter:");
  });

  test("output outside the current directory is rejected", async () => {
    const deps = makeDeps();
    await run(["hugo", "-o", "../outside.mjs"], deps);
    expect(process.exitCode).toBe(1);
    expect(output).toContain("must be inside the current directory");
    expect(deps.writeOutput).not.toHaveBeenCalled();
  });

  test("absolute output outside the current directory is rejected", async () => {
    const deps = makeDeps();
    await run(["hugo", "-o", join(tmpdir(), "outside.mjs")], deps);
    expect(process.exitCode).toBe(1);
    expect(deps.writeOutput).not.toHaveBeenCalled();
  });

  test("import failure sets exit code", async () => {
    const deps = makeDeps();
    deps.importPreset.mockRejectedValue(new Error("boom"));
    await run(["hugo"], deps);
    expect(process.exitCode).toBe(1);
    expect(output).toContain("boom");
  });

  test("default deps write a real file", async () => {
    const dir = await mkdtemp(join(process.cwd(), ".swizzle-test-"));
    try {
      const file = join(dir, "nested", "f.mjs");
      await run(["hugo", "-o", file], {
        importPreset: vi.fn().mockResolvedValue({}),
      });
      expect(await readFile(file, "utf8")).toContain("gqlmd swizzle hugo");
      await run(["hugo", "-o", file], {
        importPreset: vi.fn().mockResolvedValue({}),
      });
      expect(process.exitCode).toBe(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("generated module for real hugo preset is importable", async () => {
    const hugo = (await import("@graphql-markdown/formatters/hugo")) as Record<
      string,
      unknown
    >;
    const dir = await mkdtemp(join(process.cwd(), ".swizzle-test-"));
    try {
      const file = join(dir, "f.mjs");
      await writeFile(file, generateFormatterSource("hugo", hugo));
      const mod = (await import(pathToFileURL(file).href)) as {
        createMDXFormatter: () => Record<string, unknown>;
      };
      expect(Object.keys(mod.createMDXFormatter())).toHaveLength(9);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("generated docusaurus module keeps the preset meta behaviour", async () => {
    const docusaurus =
      (await import("@graphql-markdown/formatters/docusaurus")) as Record<
        string,
        unknown
      > & {
        createMDXFormatter: (meta: unknown) => Record<string, unknown>;
      };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "3.10.0",
    };
    const dir = await mkdtemp(join(process.cwd(), ".swizzle-test-"));
    try {
      const file = join(dir, "f.mjs");
      await writeFile(file, generateFormatterSource("docusaurus", docusaurus));
      const mod = (await import(pathToFileURL(file).href)) as {
        createMDXFormatter: (meta: unknown) => Record<string, unknown>;
      };
      const swizzled = mod.createMDXFormatter(meta) as {
        formatMDXPermalink: (id: string) => string;
      };
      const original = docusaurus.createMDXFormatter(meta) as {
        formatMDXPermalink: (id: string) => string;
      };
      expect(swizzled.formatMDXPermalink("x")).toBe(
        original.formatMDXPermalink("x"),
      );
      expect(swizzled.formatMDXPermalink("x")).toBe("{/* #x */}");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
