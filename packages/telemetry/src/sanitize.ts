import type { CliOptions, ConfigOptions } from "@graphql-markdown/types";

import { maskPointer } from "./loader";
import {
  DEPRECATED_OPTIONS,
  DIFF_METHODS,
  FORMATTER_PRESETS,
  HIERARCHIES,
  KNOWN_LOADERS,
} from "./schema";

export type Rule =
  | { kind: "any" } // shape-based masking
  | { kind: "enum"; values: readonly string[] }
  | { kind: "formatter" }
  | { kind: "loaders" }
  | { kind: "map"; value: Rule } // user-defined keys become `<key:n>`
  | { kind: "object"; fields: Record<string, Rule> } // known keys kept
  | { kind: "opaque" }
  | { kind: "path" }
  | { kind: "pointer" }
  | { kind: "scalar" } // boolean, number and null as-is; strings masked
  | { kind: "string" }
  | { kind: "url" };

export interface SanitizeResult {
  value: Record<string, unknown>;
  unknownKeys: number;
}

const MAX_DEPTH = 8;
const FORMATTER_PACKAGE = /^@graphql-markdown\/[a-z0-9-]+(\/[a-z0-9-]+)*$/;

const scalar: Rule = { kind: "scalar" };
const string: Rule = { kind: "string" };
const path: Rule = { kind: "path" };
const url: Rule = { kind: "url" };
const any: Rule = { kind: "any" };
const formatter: Rule = { kind: "formatter" };
const pointer: Rule = { kind: "pointer" };
const enumOf = (values: readonly string[]): Rule => {
  return { kind: "enum", values };
};
const deprecated = enumOf(DEPRECATED_OPTIONS);
export const CONFIG_RULES = {
  baseURL: url,
  customDirective: { kind: "map", value: any },
  decorators: { kind: "map", value: any },
  diffMethod: enumOf(DIFF_METHODS),
  docOptions: {
    kind: "object",
    fields: {
      frontMatter: { kind: "map", value: any },
      index: scalar,
      generatorFrameworkName: string,
      generatorFrameworkVersion: string,
      categorySort: { kind: "enum", values: ["natural"] },
      sectionHeaderId: scalar,
    },
  },
  force: scalar,
  groupByDirective: {
    kind: "object",
    fields: { directive: string, field: string, fallback: string },
  },
  homepage: path,
  id: string,
  linkRoot: path,
  loaders: { kind: "loaders" },
  formatter,
  mdxParser: formatter,
  metatags: { kind: "map", value: string },
  onlyDocDirective: string,
  outputAdapter: { kind: "opaque" },
  pretty: scalar,
  printTypeOptions: {
    kind: "object",
    fields: {
      deprecated,
      exampleSection: { kind: "map", value: string },
      hierarchy: enumOf(HIERARCHIES),
      parentTypePrefix: scalar,
      typeBadges: scalar,
    },
  },
  rootPath: path,
  schema: pointer,
  skipDocDirective: string,
  telemetry: scalar,
  tmpDir: path,
} as const satisfies Record<keyof ConfigOptions, Rule>;

export const CLI_RULES = {
  base: url,
  config: scalar,
  deprecated,
  diff: enumOf(DIFF_METHODS),
  force: scalar,
  groupByDirective: string,
  homepage: path,
  index: scalar,
  link: path,
  hierarchy: enumOf(HIERARCHIES),
  formatter,
  mdxParser: formatter,
  noParentType: scalar,
  noTypeBadges: scalar,
  noSectionId: scalar,
  pretty: scalar,
  root: path,
  schema: pointer,
  skip: string,
  only: string,
  tmp: path,
  telemetry: scalar,
} as const satisfies Record<keyof CliOptions, Rule>;

/** Masks a string by its shape: url, path or generic string. */
const maskString = (value: string): string => {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return "<url>";
  }
  if (/[/\\]/.test(value) || value.startsWith(".")) {
    return "<path>";
  }
  return "<string>";
};

const isPlainObject = (value: object): boolean => {
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
};

const sanitizeFormatter = (value: string): string => {
  if (
    (FORMATTER_PRESETS as readonly string[]).includes(value) ||
    FORMATTER_PACKAGE.test(value)
  ) {
    return value;
  }
  return "<custom-formatter>";
};

const sanitizeLoaderName = (value: string): string => {
  return (KNOWN_LOADERS as readonly string[]).includes(value)
    ? value
    : "<custom-loader>";
};

/* eslint-disable @typescript-eslint/no-use-before-define -- mutual recursion */
const sanitizeLoaderEntry = (item: unknown, depth: number): unknown => {
  if (typeof item === "object" && item !== null && isPlainObject(item)) {
    const cfg = item as Record<string, unknown>;
    return {
      ...(cfg.module !== undefined && {
        module: sanitizeLoaders(cfg.module, depth + 2),
      }),
      ...(cfg.options !== undefined && {
        options: sanitizeValue(
          cfg.options,
          { kind: "map", value: any },
          depth + 2,
        ),
      }),
    };
  }
  return sanitizeLoaders(item, depth + 1);
};

const sanitizeLoaders = (value: unknown, depth: number): unknown => {
  if (typeof value === "string") {
    return sanitizeLoaderName(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => {
      return sanitizeLoaders(item, depth + 1);
    });
  }
  if (typeof value === "object" && value !== null && isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[sanitizeLoaderName(key)] = sanitizeLoaderEntry(item, depth);
    }
    return out;
  }
  return sanitizeValue(value, any, depth);
};

const sanitizeStringByRule = (value: string, rule: Rule): string => {
  switch (rule.kind) {
    case "enum":
      return rule.values.includes(value) ? value : maskString(value);
    case "url":
      return "<url>";
    case "path":
      return "<path>";
    case "formatter":
      return sanitizeFormatter(value);
    default:
      return rule.kind === "string" ? "<string>" : maskString(value);
  }
};

const sanitizeObjectByRule = (
  value: object,
  rule: Rule,
  depth: number,
): Record<string, unknown> | "<object>" => {
  if (!isPlainObject(value)) {
    return "<object>";
  }
  const entries = Object.entries(value as Record<string, unknown>);
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [key, item] of entries) {
    if (rule.kind === "object" && Object.hasOwn(rule.fields, key)) {
      const next = sanitizeValue(item, rule.fields[key], depth + 1);
      if (next !== undefined) {
        out[key] = next;
      }
      continue;
    }
    const itemRule = rule.kind === "map" ? rule.value : any;
    const next = sanitizeValue(item, itemRule, depth + 1);
    if (next !== undefined) {
      out[`<key:${n}>`] = next;
      n += 1;
    }
  }
  return out;
};

const sanitizePrimitive = (
  value: unknown,
): { handled: false } | { handled: true; value: unknown } => {
  if (value === null || typeof value === "boolean") {
    return { handled: true, value };
  }
  if (typeof value === "number") {
    return { handled: true, value: Number.isFinite(value) ? value : null };
  }
  if (typeof value === "function") {
    return { handled: true, value: "<function>" };
  }
  if (value === undefined) {
    return { handled: true, value: undefined };
  }
  if (typeof value === "symbol" || typeof value === "bigint") {
    return { handled: true, value: "<object>" };
  }
  return { handled: false };
};

const sanitizeValue = (value: unknown, rule: Rule, depth: number): unknown => {
  const primitive = sanitizePrimitive(value);
  if (primitive.handled) {
    return primitive.value;
  }
  if (depth > MAX_DEPTH || rule.kind === "opaque") {
    return typeof value === "string" ? "<string>" : "<object>";
  }
  if (rule.kind === "pointer") {
    return maskPointer(value);
  }
  if (rule.kind === "loaders") {
    return sanitizeLoaders(value, depth);
  }
  if (typeof value === "string") {
    return sanitizeStringByRule(value, rule);
  }
  if (Array.isArray(value)) {
    return value.map((item) => {
      return sanitizeValue(item, rule, depth + 1);
    });
  }
  if (typeof value === "object" && value !== null) {
    return sanitizeObjectByRule(value, rule, depth);
  }
  return "<object>";
};

/* eslint-enable @typescript-eslint/no-use-before-define */

/**
 * Sanitizes a config source. Top-level keys without a rule are dropped and
 * counted in `unknownKeys`.
 */
export const sanitizeConfig = (
  value: unknown,
  rules: Record<string, Rule>,
): SanitizeResult => {
  const result: SanitizeResult = { value: {}, unknownKeys: 0 };
  if (typeof value !== "object" || value === null) {
    return result;
  }
  for (const [key, item] of Object.entries(value)) {
    if (!Object.hasOwn(rules, key)) {
      result.unknownKeys += 1;
      continue;
    }
    const next = sanitizeValue(item, rules[key], 0);
    if (next !== undefined) {
      result.value[key] = next;
    }
  }
  return result;
};
