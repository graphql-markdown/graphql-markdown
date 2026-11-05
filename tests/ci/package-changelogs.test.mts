import { describe, expect, test } from "vitest";

import {
  buildPackageEntries,
  parseReleases,
  renderPackageChangelog,
} from "../../.github/scripts/package-changelogs.mts";

const fixture = `# Changelog

<a id="1.41.0"></a>
# [1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0) - 2026-10-29

## What's Changed

- Fix thing in @graphql-markdown/cli
- Tweak @graphql-markdown/cli-foo only
- Fix thing in @graphql-markdown/cli

### Package Versions 📦

| Package | Version | Registry |
|---|---|---|
| @graphql-markdown/core | 1.26.0 | npm, JSR |
| @graphql-markdown/cli | \`1.2.1\` | npm |
| create-graphql-markdown-docs | 1.1.1 | npm |

<a id="1.40.0"></a>
# [1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0) - 2026-10-20

- Update @graphql-markdown/core internals

### Package Versions

| Package | Version |
|---|---|
| @graphql-markdown/core | 1.25.0 |
| @graphql-markdown/cli | 1.2.1 |

<a id="1.39.0"></a>
# [1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0) - 2026-10-01

- Old release
`;

const releases = parseReleases(fixture);

describe("parseReleases", () => {
  test("parses tag, url, date and versions in file order", () => {
    expect(releases.map((r) => r.tag)).toEqual(["1.41.0", "1.40.0", "1.39.0"]);
    expect(releases[0].url).toBe(
      "https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0",
    );
    expect(releases[0].date).toBe("2026-10-29");
    expect(releases[0].versions.get("@graphql-markdown/core")).toBe("1.26.0");
    expect(releases[1].versions.get("@graphql-markdown/core")).toBe("1.25.0");
    expect(releases[2].versions.size).toBe(0);
  });

  test("strips backticks from cells", () => {
    expect(releases[0].versions.get("@graphql-markdown/cli")).toBe("1.2.1");
  });
});

describe("buildPackageEntries", () => {
  test("unchanged version yields one entry attributed to the older release", () => {
    const entries = buildPackageEntries(releases, "@graphql-markdown/cli");
    expect(entries).toHaveLength(1);
    expect(entries[0].version).toBe("1.2.1");
    expect(entries[0].tag).toBe("1.40.0");
  });

  test("version bump yields two entries, newest first", () => {
    const entries = buildPackageEntries(releases, "@graphql-markdown/core");
    expect(entries.map((e) => [e.version, e.tag])).toEqual([
      ["1.26.0", "1.41.0"],
      ["1.25.0", "1.40.0"],
    ]);
  });

  test("notes include matching lines, exclude table rows and headings", () => {
    const [entry] = buildPackageEntries(
      releases,
      "create-graphql-markdown-docs",
    );
    expect(entry.notes).toEqual([]);
    const core = buildPackageEntries(releases, "@graphql-markdown/core");
    expect(core[1].notes).toEqual([
      "- Update @graphql-markdown/core internals",
    ]);
  });

  test("respects the package name boundary", () => {
    const [entry] = buildPackageEntries(releases, "@graphql-markdown/cli");
    expect(entry.notes).toEqual([]);
    const newest = {
      ...releases[0],
      versions: new Map([["@graphql-markdown/cli", "9.9.9"]]),
    };
    const [bumped] = buildPackageEntries([newest], "@graphql-markdown/cli");
    expect(bumped.notes).toEqual(["- Fix thing in @graphql-markdown/cli"]);
  });
});

describe("renderPackageChangelog", () => {
  test("renders entries", () => {
    const out = renderPackageChangelog(
      "@graphql-markdown/core",
      buildPackageEntries(releases, "@graphql-markdown/core"),
    );
    expect(out).toContain("Versions of `@graphql-markdown/core`.");
    expect(out).toContain("## 1.26.0 - 2026-10-29");
    expect(out).toContain(
      "Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).",
    );
    expect(out.endsWith("\n")).toBe(true);
    expect(out.endsWith("\n\n")).toBe(false);
  });

  test("renders the empty case", () => {
    const out = renderPackageChangelog("@graphql-markdown/none", []);
    expect(out).toContain("No versions recorded yet.");
    expect(out.endsWith("\n")).toBe(true);
  });
});
