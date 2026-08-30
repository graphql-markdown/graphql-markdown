import { describe, expect, test } from "vitest";

import {
  isFrameworkVersion,
  isFrameworkVersionAtLeast,
} from "../../src/version";

describe("isFrameworkVersionAtLeast", () => {
  const meta = (generatorFrameworkVersion: string) => {
    return { generatorFrameworkName: "docusaurus", generatorFrameworkVersion };
  };
  const minVersion = { major: 3, minor: 10 };

  test.each([["3.10.0"], ["3.10.2"], ["3.11.0"], ["4.0.0"], ["10.0.0"]])(
    "returns true for %s",
    (version) => {
      expect(
        isFrameworkVersionAtLeast(meta(version), "docusaurus", minVersion),
      ).toBe(true);
    },
  );

  test.each([["3.9.1"], ["3.0.0"], ["2.4.3"], ["1.0.0"]])(
    "returns false for %s",
    (version) => {
      expect(
        isFrameworkVersionAtLeast(meta(version), "docusaurus", minVersion),
      ).toBe(false);
    },
  );

  test("returns false when the version is missing or unparsable", () => {
    expect(
      isFrameworkVersionAtLeast(meta("next"), "docusaurus", minVersion),
    ).toBe(false);
    expect(
      isFrameworkVersionAtLeast(
        { generatorFrameworkName: "docusaurus" },
        "docusaurus",
        minVersion,
      ),
    ).toBe(false);
  });

  test("returns false for another framework", () => {
    expect(isFrameworkVersionAtLeast(meta("3.10.2"), "vocs", minVersion)).toBe(
      false,
    );
  });

  test("returns false when meta is not set", () => {
    expect(isFrameworkVersionAtLeast(undefined, "docusaurus", minVersion)).toBe(
      false,
    );
    expect(isFrameworkVersionAtLeast(null, "docusaurus", minVersion)).toBe(
      false,
    );
  });

  test.each([
    ["v3.10.2"],
    ["^3.10.2"],
    ["~3.10.2"],
    ["3.10"],
    ["3.10.0-canary.1"],
  ])("parses %s as 3.10", (version) => {
    expect(
      isFrameworkVersionAtLeast(meta(version), "docusaurus", minVersion),
    ).toBe(true);
  });

  test("compares the major only when no minor is required", () => {
    expect(
      isFrameworkVersionAtLeast(meta("3.0.0"), "docusaurus", { major: 3 }),
    ).toBe(true);
    expect(
      isFrameworkVersionAtLeast(meta("2.4.3"), "docusaurus", { major: 3 }),
    ).toBe(false);
  });
});

describe("isFrameworkVersion", () => {
  const meta = (generatorFrameworkVersion: string) => {
    return { generatorFrameworkName: "docusaurus", generatorFrameworkVersion };
  };

  test.each([["2.0.0"], ["2.4.3"], ["2.10.0"]])(
    "matches any 2.x release for %s",
    (version) => {
      expect(
        isFrameworkVersion(meta(version), "docusaurus", { major: 2 }),
      ).toBe(true);
    },
  );

  test.each([["1.0.0"], ["3.0.0"], ["3.10.2"]])(
    "does not match %s",
    (version) => {
      expect(
        isFrameworkVersion(meta(version), "docusaurus", { major: 2 }),
      ).toBe(false);
    },
  );

  test("matches on the minor when one is given", () => {
    expect(
      isFrameworkVersion(meta("3.10.2"), "docusaurus", { major: 3, minor: 10 }),
    ).toBe(true);
    expect(
      isFrameworkVersion(meta("3.9.1"), "docusaurus", { major: 3, minor: 10 }),
    ).toBe(false);
  });

  test("returns false for another framework or an unknown version", () => {
    expect(isFrameworkVersion(meta("2.4.3"), "vocs", { major: 2 })).toBe(false);
    expect(isFrameworkVersion(meta("next"), "docusaurus", { major: 2 })).toBe(
      false,
    );
    expect(isFrameworkVersion(undefined, "docusaurus", { major: 2 })).toBe(
      false,
    );
  });
});
