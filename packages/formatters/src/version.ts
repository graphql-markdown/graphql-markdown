/**
 * Helpers for gating formatter output on the target framework version.
 *
 * @packageDocumentation
 */

import type { Maybe, MetaInfo } from "@graphql-markdown/types";

/** A framework version, narrowed down to the parts used for comparison. */
export interface FrameworkVersion {
  major: number;
  minor?: number;
}

const VERSION_EXPRESSION = /^\D*(?<major>\d+)(?:\.(?<minor>\d+))?/;

/**
 * Parses the leading `major[.minor]` of a version string.
 *
 * Any prefix (`v`, `^`, `~`) is ignored, as is anything trailing the minor
 * (patch, prerelease, build metadata).
 *
 * @param version - The version string to parse, eg `"3.10.2"`
 * @returns The parsed version, or `undefined` if the string carries no version
 *
 * @example
 * ```js
 * parseFrameworkVersion("3.10.2"); // { major: 3, minor: 10 }
 * parseFrameworkVersion("next"); // undefined
 * ```
 */
const parseFrameworkVersion = (
  version: Maybe<string>,
): FrameworkVersion | undefined => {
  const parsed = VERSION_EXPRESSION.exec(version ?? "");

  if (!parsed?.groups) {
    return undefined;
  }

  // an optional group is typed as always present, but is undefined when absent
  return {
    major: Number(parsed.groups.major),
    minor: Number(parsed.groups.minor || 0),
  };
};

/**
 * Compares the generator framework version declared in `meta` with `version`.
 *
 * Only the parts carried by `version` are compared, so `{ major: 2 }` matches
 * any `2.x` release.
 *
 * @param meta - Optional metadata carrying the framework name and version
 * @param framework - The expected framework name, eg `"docusaurus"`
 * @param version - The version to compare against
 * @returns A negative number if the framework version is lower, `0` if it
 * matches, a positive number if it is higher, or `undefined` if the framework
 * does not match or carries no parsable version
 */
const compareFrameworkVersion = (
  meta: Maybe<MetaInfo>,
  framework: string,
  version: FrameworkVersion,
): number | undefined => {
  if (meta?.generatorFrameworkName !== framework) {
    return undefined;
  }

  const parsed = parseFrameworkVersion(meta.generatorFrameworkVersion);

  if (!parsed) {
    return undefined;
  }

  if (parsed.major !== version.major) {
    return parsed.major - version.major;
  }

  return typeof version.minor === "number"
    ? (parsed.minor ?? 0) - version.minor
    : 0;
};

/**
 * Checks that the generator framework declared in `meta` is `framework`, and
 * that its version matches `version`.
 *
 * Only the parts carried by `version` are compared, so `{ major: 2 }` matches
 * any `2.x` release. An unknown, unparsable or mismatched framework version
 * returns `false`.
 *
 * @param meta - Optional metadata carrying the framework name and version
 * @param framework - The expected framework name, eg `"docusaurus"`
 * @param version - The version to match
 * @returns `true` if the framework and its version match
 *
 * @example
 * ```js
 * const meta = {
 *   generatorFrameworkName: "docusaurus",
 *   generatorFrameworkVersion: "2.4.3",
 * };
 *
 * isFrameworkVersion(meta, "docusaurus", { major: 2 }); // true
 * isFrameworkVersion(meta, "docusaurus", { major: 3 }); // false
 * ```
 */
export const isFrameworkVersion = (
  meta: Maybe<MetaInfo>,
  framework: string,
  version: FrameworkVersion,
): boolean => {
  return compareFrameworkVersion(meta, framework, version) === 0;
};

/**
 * Checks that the generator framework declared in `meta` is `framework`, and
 * that its version is `minVersion` or above.
 *
 * An unknown, unparsable or mismatched framework version returns `false`, so
 * callers fall back to the output supported by every version.
 *
 * @param meta - Optional metadata carrying the framework name and version
 * @param framework - The expected framework name, eg `"docusaurus"`
 * @param minVersion - The minimum version required by the caller
 * @returns `true` if the framework matches and its version is high enough
 *
 * @example
 * ```js
 * const meta = {
 *   generatorFrameworkName: "docusaurus",
 *   generatorFrameworkVersion: "3.10.2",
 * };
 *
 * isFrameworkVersionAtLeast(meta, "docusaurus", { major: 3, minor: 10 }); // true
 * isFrameworkVersionAtLeast(meta, "docusaurus", { major: 4 }); // false
 * ```
 */
export const isFrameworkVersionAtLeast = (
  meta: Maybe<MetaInfo>,
  framework: string,
  minVersion: FrameworkVersion,
): boolean => {
  const compared = compareFrameworkVersion(meta, framework, minVersion);

  return typeof compared === "number" && compared >= 0;
};
