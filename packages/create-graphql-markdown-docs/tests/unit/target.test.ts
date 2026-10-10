import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  detectFrameworks,
  flagModeError,
  isEffectivelyEmpty,
  modeFor,
  toSchemaRef,
} from "../../lib/target.mjs";

let work: string;

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-target-"));
});

afterEach(() => {
  fs.rmSync(work, { recursive: true, force: true });
});

describe("isEffectivelyEmpty / modeFor", () => {
  it("treats a missing folder as empty", () => {
    const dir = path.join(work, "missing");
    expect(isEffectivelyEmpty(dir)).toBe(true);
    expect(modeFor(dir)).toBe("scaffold");
  });

  it("treats an empty folder as empty", () => {
    expect(isEffectivelyEmpty(work)).toBe(true);
  });

  it("ignores .git and .DS_Store", () => {
    fs.mkdirSync(path.join(work, ".git"));
    fs.writeFileSync(path.join(work, ".DS_Store"), "");
    expect(isEffectivelyEmpty(work)).toBe(true);
    expect(modeFor(work)).toBe("scaffold");
  });

  it("a README makes it a project", () => {
    fs.writeFileSync(path.join(work, "README.md"), "x");
    expect(isEffectivelyEmpty(work)).toBe(false);
    expect(modeFor(work)).toBe("wire");
  });
});

describe("flagModeError", () => {
  it("rejects a scaffold-only flag in wire mode", () => {
    expect(flagModeError({ title: "x" }, "wire", "app")).toBe(
      "--title only applies when creating a new project, but app is an existing project.",
    );
  });

  it("rejects a wire-only flag in scaffold mode", () => {
    expect(flagModeError({ output: "docs" }, "scaffold", "app")).toBe(
      "--output only applies when adding GraphQL-Markdown to an existing project, but app is empty.",
    );
  });

  it("accepts flags that fit the mode", () => {
    expect(flagModeError({ yes: true }, "wire", "app")).toBeUndefined();
    expect(flagModeError({ title: "x" }, "scaffold", "app")).toBeUndefined();
    expect(flagModeError({ output: "d" }, "wire", "app")).toBeUndefined();
  });
});

describe("detectFrameworks", () => {
  it("returns [] when there is nothing to detect", () => {
    expect(detectFrameworks(null)).toEqual([]);
    expect(detectFrameworks({ name: "x" })).toEqual([]);
  });

  it("detects starlight from dependencies", () => {
    expect(
      detectFrameworks({ dependencies: { "@astrojs/starlight": "^0.30.0" } }),
    ).toEqual(["starlight"]);
  });

  it("detects several matches in descriptor order", () => {
    const found = detectFrameworks({
      dependencies: { "@astrojs/starlight": "1", nuxt: "3" },
    });
    expect(found).toHaveLength(2);
    expect(found).toEqual(expect.arrayContaining(["starlight", "nuxt"]));
  });

  it("looks at devDependencies", () => {
    expect(
      detectFrameworks({ devDependencies: { "@astrojs/starlight": "1" } }),
    ).toEqual(["starlight"]);
  });
});

describe("toSchemaRef", () => {
  const project = path.join("/work", "app");

  it("keeps remote sources unchanged", () => {
    expect(toSchemaRef("https://x.dev/graphql", project)).toBe(
      "https://x.dev/graphql",
    );
    expect(toSchemaRef("github:a/b#main:schema.graphql", project)).toBe(
      "github:a/b#main:schema.graphql",
    );
  });

  it("makes a local file relative to the project, resolved from cwd", () => {
    expect(toSchemaRef("schema/s.graphql", project, "/work/app/..")).toBe(
      "../schema/s.graphql",
    );
    expect(toSchemaRef("app/schema/s.graphql", project, "/work")).toBe(
      "./schema/s.graphql",
    );
  });

  it("uses ../ for a path outside the project", () => {
    expect(toSchemaRef("other/s.graphql", project, "/work")).toBe(
      "../other/s.graphql",
    );
  });
});
