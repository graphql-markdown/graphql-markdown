import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { WIRE_FRAMEWORKS } from "../../lib/frameworks/index.mjs";
import { detectLoader } from "../../lib/schema.mjs";
import {
  applyWirePlan,
  buildGraphqlrc,
  formatWirePlan,
  inspectProject,
  planWire,
  validateOutput,
} from "../../lib/wire/plan.mjs";

const fw = WIRE_FRAMEWORKS as Record<string, any>;
const local = "./schema.graphql";

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-plan-"));
});
afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("buildGraphqlrc", () => {
  it("builds starlight with absolute linkRoot", () => {
    expect(
      buildGraphqlrc({
        descriptor: fw.starlight,
        schema: local,
        loader: detectLoader(local),
        output: "src/content/docs/api",
        siteBase: "/repo",
      }),
    ).toEqual({
      schema: local,
      extensions: {
        "graphql-markdown": {
          rootPath: "./src/content/docs",
          baseURL: "api",
          linkRoot: "/repo",
          formatter: fw.starlight.formatter,
          loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
        },
      },
    });
  });

  it("omits linkRoot for relative frameworks", () => {
    const cfg = buildGraphqlrc({
      descriptor: fw.mkdocs,
      schema: local,
      loader: detectLoader(local),
      output: "docs/api",
    });
    expect(cfg.extensions["graphql-markdown"]).not.toHaveProperty("linkRoot");
    expect(cfg.extensions["graphql-markdown"].rootPath).toBe("./docs");
  });

  it("omits formatter and linkRoot for generic", () => {
    const cfg = buildGraphqlrc({
      descriptor: fw.generic,
      schema: local,
      loader: detectLoader(local),
      output: "docs/api",
    });
    expect(Object.keys(cfg.extensions["graphql-markdown"])).toEqual([
      "rootPath",
      "baseURL",
      "loaders",
    ]);
  });

  it("emits UrlLoader options", () => {
    const url = "https://example.com/graphql";
    const cfg = buildGraphqlrc({
      descriptor: fw.fumadocs,
      schema: url,
      loader: detectLoader(url),
      output: "content/docs/api",
    });
    expect(cfg.extensions["graphql-markdown"].loaders).toEqual({
      UrlLoader: {
        module: "@graphql-tools/url-loader",
        options: { method: "POST" },
      },
    });
  });

  it("emits the github token placeholder", () => {
    const src = "github:o/r#main:schema.graphql";
    const cfg = buildGraphqlrc({
      descriptor: fw.generic,
      schema: src,
      loader: detectLoader(src),
      output: "docs/api",
    });
    expect(cfg.extensions["graphql-markdown"].loaders).toEqual({
      GithubLoader: {
        module: "@graphql-tools/github-loader",
        options: { token: "${GITHUB_TOKEN}" },
      },
    });
  });

  it("lets formatter and linkRoot overrides win", () => {
    const cfg = buildGraphqlrc({
      descriptor: fw.starlight,
      schema: local,
      loader: detectLoader(local),
      output: "src/content/docs/api",
      siteBase: "/repo",
      formatter: "custom-formatter",
      linkRoot: "/custom",
    });
    const gm = cfg.extensions["graphql-markdown"];
    expect(gm.formatter).toBe("custom-formatter");
    expect(gm.linkRoot).toBe("/custom");
  });
});

describe("inspectProject", () => {
  it("handles a missing package.json", () => {
    expect(inspectProject(dir)).toEqual({
      packageJson: null,
      packageJsonIndent: 2,
      existingConfig: null,
    });
  });

  it("detects 4-space indent", () => {
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "x" }, null, 4),
    );
    const p = inspectProject(dir);
    expect(p.packageJson).toEqual({ name: "x" });
    expect(p.packageJsonIndent).toBe("    ");
  });

  it.each([".graphqlrc", "graphql.config.ts"])("detects %s", (name) => {
    fs.writeFileSync(path.join(dir, name), "");
    expect(inspectProject(dir).existingConfig).toBe(name);
  });

  it("detects a graphql key in package.json", () => {
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ graphql: {} }),
    );
    expect(inspectProject(dir).existingConfig).toBe("package.json#graphql");
  });
});

describe("validateOutput", () => {
  it("rejects blank", () => {
    expect(validateOutput(dir, "  ").error).toBe("Output folder is required.");
  });
  it("rejects absolute", () => {
    expect(validateOutput(dir, path.resolve("/abs")).error).toBe(
      "Output folder must be relative to the project root.",
    );
  });
  it("rejects outside the project", () => {
    expect(validateOutput(dir, "../x").error).toBe(
      "Output folder must be inside the project.",
    );
    expect(validateOutput(dir, "..").error).toBe(
      "Output folder must be inside the project.",
    );
  });
  it("rejects a file", () => {
    fs.writeFileSync(path.join(dir, "out"), "");
    expect(validateOutput(dir, "out").error).toBeDefined();
  });
  it("warns on a non-empty directory", () => {
    fs.mkdirSync(path.join(dir, "out"));
    fs.writeFileSync(path.join(dir, "out", "a.md"), "");
    expect(validateOutput(dir, "out").warning).toContain("already exists");
  });
  it("accepts missing and empty directories", () => {
    expect(validateOutput(dir, "docs/api")).toEqual({});
    fs.mkdirSync(path.join(dir, "empty"));
    expect(validateOutput(dir, "empty")).toEqual({});
  });
});

describe("planWire", () => {
  const inputs = {
    descriptor: fw.generic,
    schema: local,
    loader: detectLoader(local),
    output: "docs/api",
  };
  const project = (over = {}) => {
    return {
      packageJson: { name: "x" },
      packageJsonIndent: 2,
      existingConfig: null,
      ...over,
    };
  };

  it("plans a fresh project", () => {
    const plan = planWire(inputs, project());
    expect(plan.files).toHaveLength(1);
    expect(plan.files[0].path).toBe(".graphqlrc");
    expect(plan.mergeBlock).toBeUndefined();
    expect(plan.script).toEqual({
      name: "docs:api",
      command: "gqlmd graphql-to-doc",
    });
  });

  it("returns a merge block for an existing config", () => {
    const plan = planWire(
      inputs,
      project({ existingConfig: ".graphqlrc.yml" }),
    );
    expect(plan.files).toEqual([]);
    expect(plan.mergeBlock).toContain("graphql-markdown");
    expect(plan.warnings[0]).toContain("Found .graphqlrc.yml");
  });

  it("skips the script without package.json", () => {
    expect(planWire(inputs, project({ packageJson: null })).script).toEqual({
      skipped: "no package.json",
    });
  });

  it("skips the script on a name clash", () => {
    const plan = planWire(
      inputs,
      project({ packageJson: { scripts: { "docs:api": "x" } } }),
    );
    expect(plan.script).toEqual({
      skipped: 'script "docs:api" already exists',
    });
  });
});

describe("applyWirePlan", () => {
  const inputs = {
    descriptor: fw.generic,
    schema: local,
    loader: detectLoader(local),
    output: "docs/api",
  };

  it("writes .graphqlrc and preserves package.json indent", () => {
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "x" }, null, 4),
    );
    const project = inspectProject(dir);
    const written = applyWirePlan(dir, planWire(inputs, project), project);
    expect(written).toEqual([".graphqlrc", "package.json"]);
    expect(fs.existsSync(path.join(dir, ".graphqlrc"))).toBe(true);
    expect(fs.readFileSync(path.join(dir, "package.json"), "utf8")).toBe(
      JSON.stringify(
        { name: "x", scripts: { "docs:api": "gqlmd graphql-to-doc" } },
        null,
        4,
      ) + "\n",
    );
  });

  it("never overwrites an existing .graphqlrc", () => {
    const project = inspectProject(dir);
    const plan = planWire(inputs, project);
    fs.writeFileSync(path.join(dir, ".graphqlrc"), "keep");
    expect(() => {
      return applyWirePlan(dir, plan, project);
    }).toThrow(/EEXIST/);
    expect(fs.readFileSync(path.join(dir, ".graphqlrc"), "utf8")).toBe("keep");
  });
});

describe("formatWirePlan", () => {
  const inputs = {
    descriptor: fw.generic,
    schema: local,
    loader: detectLoader(local),
    output: "docs/api",
  };

  it("lists file and script", () => {
    const text = formatWirePlan(
      planWire(inputs, {
        packageJson: {},
        packageJsonIndent: 2,
        existingConfig: null,
      }),
    );
    expect(text).toContain(".graphqlrc");
    expect(text).toContain('"docs:api": "gqlmd graphql-to-doc"');
  });

  it("includes the merge block", () => {
    const text = formatWirePlan(
      planWire(inputs, {
        packageJson: null,
        packageJsonIndent: 2,
        existingConfig: "graphql.config.ts",
      }),
    );
    expect(text).toContain("extensions:");
    expect(text).toContain("no package.json");
    expect(text).toContain("graphql.config.ts");
  });
});
