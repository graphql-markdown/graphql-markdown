import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { writeMdxFormatter } from "../../lib/frameworks/markdown.mjs";
import { applyTemplate } from "../../lib/project.mjs";
import { detectLoader } from "../../lib/schema.mjs";

let work: string;

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-md-"));
});
afterEach(() => {
  fs.rmSync(work, { recursive: true, force: true });
});

const read = (dir: string, file: string): string => {
  return fs.readFileSync(path.join(dir, file), "utf-8");
};

const scaffold = (framework: string, schemaPath?: string): string => {
  const dir = path.join(work, framework);
  fs.mkdirSync(dir);
  applyTemplate(dir, {
    framework,
    projectDir: path.join(work, "proj"),
    schemaPath,
    loader: detectLoader(schemaPath ?? "./schema/example.graphql"),
  });
  return dir;
};

describe("markdown scaffold", () => {
  it("writes a minimal project with no formatter", () => {
    const dir = scaffold("markdown");
    const rc = read(dir, ".graphqlrc");
    expect(rc).not.toContain("formatter");
    expect(rc).toContain("rootPath: './docs'");
    expect(fs.existsSync(path.join(dir, ".gitignore"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "docs/.gitkeep"))).toBe(true);
    const pkg = JSON.parse(read(dir, "package.json"));
    expect(pkg.name).toBe("proj");
    expect(pkg.scripts.doc).toBe("gqlmd graphql-to-doc");
    expect(pkg.dependencies["@graphql-markdown/formatters"]).toBeUndefined();
  });

  it("rewrites the schema for a custom local schema", () => {
    const schema = path.join(work, "my.graphql");
    fs.writeFileSync(schema, "type Query { a: String }\n");
    const dir = scaffold("markdown", schema);
    expect(read(dir, ".graphqlrc")).toContain(
      "schema: './schema/schema.graphql'",
    );
    expect(fs.existsSync(path.join(dir, "schema/schema.graphql"))).toBe(true);
  });

  it("adds the url loader for a remote schema", () => {
    const dir = scaffold("markdown", "https://api.example.com/graphql");
    expect(read(dir, ".graphqlrc")).toContain("UrlLoader:");
    const pkg = JSON.parse(read(dir, "package.json"));
    expect(pkg.dependencies["@graphql-tools/url-loader"]).toBeDefined();
  });
});

describe("mdx scaffold", () => {
  it("inserts the formatter right before loaders with matching indent", () => {
    const dir = scaffold("mdx");
    expect(read(dir, ".graphqlrc")).toContain(
      "    formatter: '@graphql-markdown/formatters/mdx'\n    loaders:\n",
    );
    const pkg = JSON.parse(read(dir, "package.json"));
    expect(pkg.dependencies["@graphql-markdown/formatters"]).toMatch(/^\^/);
  });

  it("throws when the loaders line is missing", () => {
    fs.writeFileSync(path.join(work, ".graphqlrc"), "schema: 'x'\n");
    expect(() => {
      return writeMdxFormatter(work);
    }).toThrow(/template may have changed/);
  });
});
