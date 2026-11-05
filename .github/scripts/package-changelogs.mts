// Builds `packages/<dir>/CHANGELOG.md` for every public workspace package from
// the root `CHANGELOG.md`.
//
// Why: Dependabot/Renovate read `CHANGELOG.md` from the package's
// `repository.directory` first. Without one they fall back to matching old
// sections of the root changelog and the 2021 `1.2.1` tag, which produces wrong
// release notes for `@graphql-markdown/*` updates.
//
// Usage: node .github/scripts/package-changelogs.mts
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Release = {
  tag: string;
  url: string;
  date: string;
  body: string;
  versions: Map<string, string>;
};

export type PackageEntry = {
  version: string;
  tag: string;
  url: string;
  date: string;
  notes: string[];
};

const RELEASE_HEADING =
  /^# \[([^\]]+)\]\(([^)]+)\)\s*-\s*(\d{4}-\d{2}-\d{2})\s*$/;
const ANCHOR = /^<a id="[^"]*"><\/a>\s*$/;

const parseVersions = (body: string): Map<string, string> => {
  const versions = new Map<string, string>();
  const lines = body.split("\n");
  const start = lines.findIndex((line) => /^### Package Versions/.test(line));
  if (start === -1) {
    return versions;
  }
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (trimmed === "") {
      continue;
    }
    if (!trimmed.startsWith("|")) {
      break;
    }
    const cells = trimmed
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.replaceAll("`", "").trim());
    const [name, version] = cells;
    if (
      !name ||
      !version ||
      /^-+$/.test(name) ||
      name.toLowerCase() === "package"
    ) {
      continue;
    }
    versions.set(name, version);
  }
  return versions;
};

export const parseReleases = (markdown: string): Release[] => {
  const releases: Release[] = [];
  let current: {
    tag: string;
    url: string;
    date: string;
    lines: string[];
  } | null = null;

  const flush = (): void => {
    if (current) {
      const body = current.lines.join("\n").trim();
      releases.push({
        tag: current.tag,
        url: current.url,
        date: current.date,
        body,
        versions: parseVersions(body),
      });
    }
  };

  for (const line of markdown.split("\n")) {
    const match = RELEASE_HEADING.exec(line);
    if (match) {
      flush();
      current = {
        tag: match[1],
        url: match[2],
        date: match[3],
        lines: [],
      };
      continue;
    }
    if (current && !ANCHOR.test(line)) {
      current.lines.push(line);
    }
  }
  flush();
  return releases;
};

const mentionsPackage = (line: string, packageName: string): boolean => {
  let index = line.indexOf(packageName);
  while (index !== -1) {
    const next = line.charAt(index + packageName.length);
    if (!/[A-Za-z0-9-]/.test(next)) {
      return true;
    }
    index = line.indexOf(packageName, index + 1);
  }
  return false;
};

const extractNotes = (body: string, packageName: string): string[] => {
  const notes: string[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (line === "" || line.startsWith("|") || line.startsWith("#")) {
      continue;
    }
    if (mentionsPackage(line, packageName) && !notes.includes(line)) {
      notes.push(line);
    }
  }
  return notes;
};

export const buildPackageEntries = (
  releases: Release[],
  packageName: string,
): PackageEntry[] => {
  const entries: PackageEntry[] = [];
  let last: string | undefined;
  for (const release of [...releases].reverse()) {
    const version = release.versions.get(packageName);
    if (version === undefined || version === last) {
      continue;
    }
    last = version;
    entries.push({
      version,
      tag: release.tag,
      url: release.url,
      date: release.date,
      notes: extractNotes(release.body, packageName),
    });
  }
  return entries.reverse();
};

export const renderPackageChangelog = (
  packageName: string,
  entries: PackageEntry[],
): string => {
  const header = [
    "# Changelog",
    "",
    `Versions of \`${packageName}\`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.`,
    "",
    "This file is generated from the root `CHANGELOG.md` by `.github/scripts/package-changelogs.mts`. Do not edit it by hand.",
  ];
  const sections =
    entries.length === 0
      ? ["No versions recorded yet."]
      : entries.map((entry) =>
          [
            `## ${entry.version} - ${entry.date}`,
            `Released in [GraphQL-Markdown ${entry.tag}](${entry.url}).`,
            ...entry.notes,
          ].join("\n\n"),
        );
  return `${[...header, "", ...sections.flatMap((s, i) => (i === 0 ? [s] : ["", s]))].join("\n")}\n`;
};

const main = (): void => {
  const root = resolve(import.meta.dirname, "../..");
  const releases = parseReleases(
    readFileSync(resolve(root, "CHANGELOG.md"), "utf8"),
  );
  const packagesDir = resolve(root, "packages");
  for (const dir of readdirSync(packagesDir).sort()) {
    let meta: { name?: string; private?: boolean };
    try {
      meta = JSON.parse(
        readFileSync(resolve(packagesDir, dir, "package.json"), "utf8"),
      );
    } catch {
      continue;
    }
    if (meta.private === true || !meta.name) {
      continue;
    }
    const target = resolve(packagesDir, dir, "CHANGELOG.md");
    writeFileSync(
      target,
      renderPackageChangelog(
        meta.name,
        buildPackageEntries(releases, meta.name),
      ),
    );
    console.log(target);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
