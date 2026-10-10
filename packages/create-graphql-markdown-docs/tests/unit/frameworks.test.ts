import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { FRAMEWORKS, WIRE_FRAMEWORKS } from "../../lib/frameworks/index.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const ALLOWED_LINKS = new Set([undefined, "relative", "router", "absolute"]);

describe("WIRE_FRAMEWORKS descriptors", () => {
  it.each(Object.entries(WIRE_FRAMEWORKS))(
    "%s has a matching id, label and valid links",
    (key, descriptor) => {
      expect(descriptor.id).toBe(key);
      expect(descriptor.label).toBeTruthy();
      expect(ALLOWED_LINKS.has(descriptor.links)).toBe(true);
    },
  );

  it.each(Object.entries(WIRE_FRAMEWORKS))(
    "%s nextSteps returns a non-empty string",
    (_key, descriptor) => {
      const steps = descriptor.nextSteps({
        outputDir: "x/api",
        route: "/x",
      });
      expect(typeof steps).toBe("string");
      expect(steps.length).toBeGreaterThan(0);
    },
  );

  it("nuxt and generic have no formatter", () => {
    expect(WIRE_FRAMEWORKS.nuxt.formatter).toBeUndefined();
    expect(WIRE_FRAMEWORKS.generic.formatter).toBeUndefined();
  });
});

describe("FRAMEWORKS scaffold registry", () => {
  it("keys are exactly nuxt and docusaurus, in order", () => {
    expect(Object.keys(FRAMEWORKS)).toEqual(["nuxt", "docusaurus"]);
  });

  it("each scaffold framework has a scaffold key", () => {
    for (const descriptor of Object.values(FRAMEWORKS)) {
      expect(descriptor.scaffold).toBeDefined();
    }
  });
});

describe("formatter drift guard", () => {
  const pkgPath = path.resolve(testDir, "../../../formatters/package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
    exports: Record<string, unknown>;
  };

  const exportIds = new Set(
    Object.keys(pkg.exports)
      .filter((key) => {
        return ![".", "./defaults", "./package.json"].includes(key);
      })
      .map((key) => {
        return key.replace(/^\.\//, "");
      }),
  );

  const formatterDescriptors = Object.values(WIRE_FRAMEWORKS).filter(
    (descriptor) => {
      return descriptor.formatter !== undefined;
    },
  );

  it("formatter package exports match wire descriptors with a formatter", () => {
    const descriptorIds = new Set(
      formatterDescriptors.map((d) => {
        return d.id;
      }),
    );
    expect(exportIds).toEqual(descriptorIds);
  });

  it.each(
    formatterDescriptors.map((d) => {
      return [d.id, d.formatter];
    }),
  )(
    "%s formatter points to @graphql-markdown/formatters/%s",
    (id, formatter) => {
      expect(formatter).toBe(`@graphql-markdown/formatters/${id}`);
    },
  );
});
