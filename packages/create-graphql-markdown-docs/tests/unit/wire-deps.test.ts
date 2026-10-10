import { describe, expect, it } from "vitest";

import { WIRE_FRAMEWORKS } from "../../lib/frameworks/index.mjs";
import { detectLoader } from "../../lib/schema.mjs";
import { packageNameOf, requiredPackages } from "../../lib/wire/deps.mjs";
import { addDevCommand } from "../../lib/tasks.mjs";

const loader = detectLoader("schema.graphql");

describe("packageNameOf", () => {
  it("keeps the scope and name of a scoped specifier with a subpath", () => {
    expect(packageNameOf("@scope/name/sub/path")).toBe("@scope/name");
  });

  it("keeps the name of an unscoped specifier with a subpath", () => {
    expect(packageNameOf("name/sub")).toBe("name");
  });

  it("returns the specifier for a plain package name", () => {
    expect(packageNameOf("name")).toBe("name");
    expect(packageNameOf("@scope/name")).toBe("@scope/name");
  });

  it("returns undefined for local paths", () => {
    expect(packageNameOf("./x.mjs")).toBeUndefined();
    expect(packageNameOf("/abs/x.mjs")).toBeUndefined();
  });
});

describe("requiredPackages", () => {
  it("lists the CLI, the starlight formatter and the loader in order", () => {
    expect(
      requiredPackages({
        descriptor: WIRE_FRAMEWORKS.starlight,
        loader,
        packageJson: {},
      }),
    ).toEqual([
      "@graphql-markdown/cli",
      "@graphql-markdown/formatters",
      "@graphql-tools/graphql-file-loader",
    ]);
  });

  it("omits the formatter for a generic framework", () => {
    expect(
      requiredPackages({
        descriptor: WIRE_FRAMEWORKS.generic,
        loader,
        packageJson: null,
      }),
    ).toEqual(["@graphql-markdown/cli", "@graphql-tools/graphql-file-loader"]);
  });

  it("uses the package of the --formatter value", () => {
    expect(
      requiredPackages({
        descriptor: WIRE_FRAMEWORKS.generic,
        loader,
        formatter: "my-fmt/sub",
        packageJson: {},
      }),
    ).toEqual([
      "@graphql-markdown/cli",
      "my-fmt",
      "@graphql-tools/graphql-file-loader",
    ]);
  });

  it("adds no formatter package for a local --formatter path", () => {
    expect(
      requiredPackages({
        descriptor: WIRE_FRAMEWORKS.generic,
        loader,
        formatter: "./local.mjs",
        packageJson: {},
      }),
    ).toEqual(["@graphql-markdown/cli", "@graphql-tools/graphql-file-loader"]);
  });

  it("leaves out packages already in dependencies or devDependencies", () => {
    expect(
      requiredPackages({
        descriptor: WIRE_FRAMEWORKS.starlight,
        loader,
        packageJson: {
          dependencies: { "@graphql-markdown/cli": "1" },
          devDependencies: { "@graphql-markdown/formatters": "1" },
        },
      }),
    ).toEqual(["@graphql-tools/graphql-file-loader"]);
  });
});

describe("addDevCommand", () => {
  it("builds the add-dev command for each package manager", () => {
    expect(addDevCommand("npm", ["a", "b"])).toBe("npm install --save-dev a b");
    expect(addDevCommand("pnpm", ["a"])).toBe("pnpm add --save-dev a");
    expect(addDevCommand("yarn", ["a"])).toBe("yarn add --dev a");
    expect(addDevCommand("bun", ["a", "b"])).toBe("bun add --dev a b");
  });
});
