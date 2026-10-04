import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import {
  mkdtempSync,
  rmSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";

const packageRoot = join(import.meta.dirname || __dirname, "../..");
const templateDir = join(packageRoot, "templates/nuxt");

/**
 * Recursively get all files and directories from a directory.
 */
const getAllFiles = (dir, prefix = "") => {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip excluded patterns
    if (["node_modules", ".nuxt", ".output", ".git"].includes(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

    files.push({
      path: relPath,
      isDirectory: entry.isDirectory(),
    });

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, relPath));
    }
  }

  return files;
};

describe("create-graphql-markdown-docs CLI", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), "gqlmd-cli-test-"));
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should scaffold a project with --yes flag", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "my-docs");

    const result = spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    // Should succeed
    expect(result.status).toBe(0);
    expect(result.error).toBeUndefined();

    // Project directory should exist
    expect(existsSync(projectDir)).toBe(true);
  });

  it("refuses to scaffold into a non-empty directory, leaving it untouched", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "occupied");
    mkdirSync(projectDir);
    writeFileSync(join(projectDir, "keep-me.txt"), "do not delete");

    const result = spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    expect(result.status).not.toBe(0);
    expect(existsSync(join(projectDir, "keep-me.txt"))).toBe(true);
    expect(existsSync(join(projectDir, "package.json"))).toBe(false);
  });

  it("should create expected file structure", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "my-docs");

    spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    // Check key files exist
    const expectedFiles = [
      "nuxt.config.ts",
      "content.config.ts",
      "generate-docs.ts",
      "package.json",
      "README.md",
      ".gitignore",
      "schema/example.graphql",
      "app/app.config.ts",
    ];

    for (const file of expectedFiles) {
      const filePath = join(projectDir, file);
      expect(existsSync(filePath)).toBe(true, `File ${file} should exist`);
    }
  });

  it("applies --title and --color to the scaffolded app.config.ts", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "themed");

    const result = spawnSync(
      "node",
      [
        cliPath,
        "--yes",
        "--dir",
        projectDir,
        "--title",
        "My Cool API",
        "--color",
        "emerald",
        "--no-install",
        "--no-git",
      ],
      { cwd: packageRoot, encoding: "utf-8" },
    );

    expect(result.status).toBe(0);

    const appConfig = readFileSync(
      join(projectDir, "app/app.config.ts"),
      "utf-8",
    );
    expect(appConfig).toContain("siteTitle: 'My Cool API'");
    expect(appConfig).toContain("primary: 'emerald'");
  });

  it("should replace project name in package.json", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "custom-project-name");

    spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    const pkgJson = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf-8"),
    );

    expect(pkgJson.name).toBe("custom-project-name");
  });

  it("should match template file structure (excluding generated patterns)", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "my-docs");

    spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    // Get file lists
    const templateFiles = getAllFiles(templateDir)
      .map((f) => {
        return f.path;
      })
      .sort();
    const scaffoldedFiles = getAllFiles(projectDir)
      .map((f) => {
        return f.path;
      })
      .sort();

    // They should have the same structure (apart from name field in package.json)
    expect(scaffoldedFiles).toEqual(templateFiles);
  });

  it("should include example GraphQL schema in scaffolded project", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "my-docs");

    spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    const schemaPath = join(projectDir, "schema", "example.graphql");
    expect(existsSync(schemaPath)).toBe(true);

    // Schema should contain basic types
    const schemaContent = readFileSync(schemaPath, "utf-8");
    expect(schemaContent).toContain("type Query");
    expect(schemaContent).toContain("type User");
  });

  it("should have valid package.json structure", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const projectDir = join(testDir, "my-docs");

    spawnSync(
      "node",
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      {
        cwd: packageRoot,
        encoding: "utf-8",
      },
    );

    const pkgJson = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf-8"),
    );

    expect(pkgJson.name).toBeDefined();
    expect(pkgJson.version).toBeDefined();
    expect(pkgJson.scripts).toBeDefined();
    expect(pkgJson.scripts.dev).toBeDefined();
    expect(pkgJson.scripts.generate).toBeDefined();
    expect(pkgJson.dependencies).toBeDefined();
    expect(pkgJson.dependencies["@graphql-markdown/nuxt-theme"]).toBeDefined();
    expect(pkgJson.dependencies.tailwindcss).toBe("^4.3.3");
  });

  describe("schema loader detection", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");

    it("defaults to the bundled example with no explicit loader", () => {
      const projectDir = join(testDir, "default-schema");
      spawnSync(
        "node",
        [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
        {
          cwd: packageRoot,
          encoding: "utf-8",
        },
      );

      const generateDocs = readFileSync(
        join(projectDir, "generate-docs.ts"),
        "utf-8",
      );
      expect(generateDocs).toContain("schema: './schema/example.graphql'");
      expect(generateDocs).not.toContain("loaders:");

      const pkgJson = JSON.parse(
        readFileSync(join(projectDir, "package.json"), "utf-8"),
      );
      expect(Object.keys(pkgJson.dependencies)).not.toEqual(
        expect.arrayContaining([expect.stringMatching(/@graphql-tools\//)]),
      );
    });

    it("detects a URL schema source and adds @graphql-tools/url-loader", () => {
      const projectDir = join(testDir, "url-schema");
      const result = spawnSync(
        "node",
        [
          cliPath,
          "--yes",
          "--dir",
          projectDir,
          "--schema",
          "https://api.example.com/graphql",
          "--no-install",
          "--no-git",
        ],
        { cwd: packageRoot, encoding: "utf-8" },
      );

      expect(result.status).toBe(0);

      const generateDocs = readFileSync(
        join(projectDir, "generate-docs.ts"),
        "utf-8",
      );
      expect(generateDocs).toContain(
        "schema: 'https://api.example.com/graphql'",
      );
      expect(generateDocs).toContain(
        "loaders: { UrlLoader: '@graphql-tools/url-loader' }",
      );
      // No local file to copy for a remote source — the directory may still
      // exist (it ships empty in the template), but nothing should be in it.
      const schemaDir = join(projectDir, "schema");
      expect(
        !existsSync(schemaDir) || readdirSync(schemaDir).length === 0,
      ).toBe(true);

      const pkgJson = JSON.parse(
        readFileSync(join(projectDir, "package.json"), "utf-8"),
      );
      expect(pkgJson.dependencies["@graphql-tools/url-loader"]).toBeDefined();

      // A remote schema source has no local file to watch — the template's
      // `watch` entry (and its now-unused fileURLToPath import) must be
      // dropped, not left pointing at a path that no longer means anything.
      const nuxtConfig = readFileSync(
        join(projectDir, "nuxt.config.ts"),
        "utf-8",
      );
      expect(nuxtConfig).not.toContain("watch:");
      expect(nuxtConfig).not.toContain("fileURLToPath");
    });

    it("points nuxt.config.ts's watch entry at a renamed local schema file", () => {
      const schemaSrc = join(testDir, "custom.graphql");
      writeFileSync(schemaSrc, "type Query { hello: String }");

      const projectDir = join(testDir, "renamed-schema");
      const result = spawnSync(
        "node",
        [
          cliPath,
          "--yes",
          "--dir",
          projectDir,
          "--schema",
          schemaSrc,
          "--no-install",
          "--no-git",
        ],
        { cwd: packageRoot, encoding: "utf-8" },
      );

      expect(result.status).toBe(0);

      const nuxtConfig = readFileSync(
        join(projectDir, "nuxt.config.ts"),
        "utf-8",
      );
      expect(nuxtConfig).toContain("./schema/schema.graphql");
      expect(nuxtConfig).not.toContain("example.graphql");
    });

    it("detects a local JSON introspection file and adds @graphql-tools/json-file-loader", () => {
      const schemaSrc = join(testDir, "introspection.json");
      writeFileSync(schemaSrc, JSON.stringify({ data: { __schema: {} } }));

      const projectDir = join(testDir, "json-schema");
      const result = spawnSync(
        "node",
        [
          cliPath,
          "--yes",
          "--dir",
          projectDir,
          "--schema",
          schemaSrc,
          "--no-install",
          "--no-git",
        ],
        { cwd: packageRoot, encoding: "utf-8" },
      );

      expect(result.status).toBe(0);
      expect(existsSync(join(projectDir, "schema/schema.json"))).toBe(true);

      const generateDocs = readFileSync(
        join(projectDir, "generate-docs.ts"),
        "utf-8",
      );
      expect(generateDocs).toContain("schema: './schema/schema.json'");
      expect(generateDocs).toContain(
        "loaders: { JsonFileLoader: '@graphql-tools/json-file-loader' }",
      );

      const pkgJson = JSON.parse(
        readFileSync(join(projectDir, "package.json"), "utf-8"),
      );
      expect(
        pkgJson.dependencies["@graphql-tools/json-file-loader"],
      ).toBeDefined();
    });
  });

  describe("--framework docusaurus", () => {
    const cliPath = join(packageRoot, "bin/create.mjs");
    const run = (projectDir: string, ...extra: string[]) => {
      return spawnSync(
        "node",
        [
          cliPath,
          "--yes",
          "--framework",
          "docusaurus",
          "--dir",
          projectDir,
          "--no-install",
          "--no-git",
          ...extra,
        ],
        { cwd: packageRoot, encoding: "utf-8" },
      );
    };

    it("scaffolds the docusaurus template file structure", () => {
      const projectDir = join(testDir, "docu");
      const result = run(projectDir);

      expect(result.status).toBe(0);

      const templateFiles = getAllFiles(
        join(packageRoot, "templates/docusaurus"),
      )
        .map((f) => {
          return f.path;
        })
        .sort();
      const scaffoldedFiles = getAllFiles(projectDir)
        .map((f) => {
          return f.path;
        })
        .sort();
      expect(scaffoldedFiles).toEqual(templateFiles);

      const graphqlrc = readFileSync(join(projectDir, ".graphqlrc"), "utf-8");
      expect(graphqlrc).toContain("schema: './schema/example.graphql'");
      expect(result.stdout).toContain("run doc");
    });

    it("applies --title to docusaurus.config.js", () => {
      const projectDir = join(testDir, "docu-title");
      const result = run(projectDir, "--title", "Acme API");

      expect(result.status).toBe(0);
      const config = readFileSync(
        join(projectDir, "docusaurus.config.js"),
        "utf-8",
      );
      expect(config).toContain('title: "Acme API",');
    });

    it("writes the URL loader into .graphqlrc and package.json", () => {
      const projectDir = join(testDir, "docu-url");
      const result = run(
        projectDir,
        "--schema",
        "https://api.example.com/graphql",
      );

      expect(result.status).toBe(0);
      const graphqlrc = readFileSync(join(projectDir, ".graphqlrc"), "utf-8");
      expect(graphqlrc).toContain("schema: 'https://api.example.com/graphql'");
      expect(graphqlrc).toContain("UrlLoader:");
      expect(graphqlrc).toContain("module: '@graphql-tools/url-loader'");
      expect(graphqlrc).toContain("method: 'POST'");
      expect(graphqlrc).not.toContain("GraphQLFileLoader");

      const pkgJson = JSON.parse(
        readFileSync(join(projectDir, "package.json"), "utf-8"),
      );
      expect(pkgJson.dependencies["@graphql-tools/url-loader"]).toBeDefined();
    });

    it("exits non-zero on an invalid --framework value", () => {
      const result = spawnSync(
        "node",
        [
          cliPath,
          "--yes",
          "--framework",
          "gatsby",
          "--dir",
          join(testDir, "bad"),
          "--no-install",
          "--no-git",
        ],
        { cwd: packageRoot, encoding: "utf-8" },
      );

      expect(result.status).not.toBe(0);
      expect(existsSync(join(testDir, "bad"))).toBe(false);
    });
  });
});
