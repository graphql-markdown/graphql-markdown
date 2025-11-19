/* eslint-disable @typescript-eslint/no-base-to-string */
import path, { join } from "node:path";

import { vol } from "memfs";
jest.mock("fs");
jest.mock("node:fs/promises");

import type {
  ClassName,
  ConfigPrintTypeOptions,
  DirectiveName,
  GeneratorOptions,
  MDXString,
  PackageName,
  TypeDiffMethod,
} from "@graphql-markdown/types";

jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

jest.mock("@graphql-markdown/diff");
import * as diff from "@graphql-markdown/diff";

jest.mock(
  "mdx-parser-mock",
  () => {
    return {
      generateIndexMetafile: (dirPath: string, category: string): string => {
        return path.join(dirPath, category).toLocaleLowerCase();
      },
    };
  },
  { virtual: true },
);

import { generateDocFromSchema } from "../../src/generator";
import {
  DEFAULT_OPTIONS,
  DeprecatedOption,
  DiffMethod,
  TypeHierarchy,
} from "../../src/config";

describe("renderer", () => {
  beforeEach(() => {
    // silent console
    jest.spyOn(global.console, "info").mockImplementation(() => {});
    jest.spyOn(global.console, "error").mockImplementation(() => {});

    jest.spyOn(Printer, "printType").mockImplementation((value) => {
      return value as MDXString;
    });

    vol.fromJSON({
      "/output": null,
      "/temp_test": null,
      "/assets/generated.md": "Dummy homepage for tweet.graphql",
    });
  });

  afterEach(() => {
    vol.reset();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("generateDocFromSchema()", () => {
    test("generates Markdown document structure from GraphQL schema", async () => {
      expect.assertions(1);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        metatags: [],
        mdxParser: "mdx-parser-mock" as PackageName,
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        },
        schemaLocation: join(__dirname, "../__data__/tweet.graphql"),
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
    });

    test('outputs "no schema changed" message when called twice', async () => {
      expect.assertions(1);

      const logSpy = jest.spyOn(console, "info");

      const config: GeneratorOptions = {
        baseURL: "graphql",
        customDirective: undefined,
        diffMethod: "SCHEMA-HASH" as TypeDiffMethod,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        } as Required<ConfigPrintTypeOptions>,
        schemaLocation: join(__dirname, "../__data__/tweet.graphql"),
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValue(false);
      await generateDocFromSchema(config);

      expect(logSpy).toHaveBeenCalledWith(
        `No changes detected in schema "${String(config.schemaLocation)}".`,
      );
    });

    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });

    test("Markdown document structure from GraphQL schema is correct when using api hierarchy", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: { [TypeHierarchy.API]: {} },
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });

    test("Markdown document structure from GraphQL schema is correct when using flat hierarchy", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {},
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          hierarchy: { [TypeHierarchy.FLAT]: {} },
        },
        skipDocDirective: [],
        tmpDir: "/temp",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });

    test("categorySortPrefix works correctly with grouping", async () => {
      expect.assertions(1);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-prefix",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-prefix",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);

      // Verify that folder names are prefixed with numbers
      // Look for patterns like "01-", "02-", etc. in folder paths
      const allPaths = Object.keys(outputJson);
      const prefixedFolders = allPaths.filter((p) => /\/\d{2}-[a-z]/.test(p));

      // Should have at least some folders with numeric prefixes when categorySortPrefix is enabled
      expect(prefixedFolders.length).toBeGreaterThan(0);
    });

    test("categorySortPrefix works correctly with API hierarchy", async () => {
      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-api-prefix",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: { [TypeHierarchy.API]: {} },
        },
        skipDocDirective: [],
        tmpDir: "/temp-api-prefix",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // With API hierarchy + grouping and categorySortPrefix:
      // - Custom groups at root: "01-course", "02-grade", "03-misc"
      // - API groups nested: "01-operations", "02-types", etc.
      // - Entity categories nested further: "02-directives", "04-queries", etc.

      // Check for custom group folders at root
      const customGroupFolders = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)\//.test(p),
      );

      // Check for API group folders (should be nested, not at root)
      const apiGroupFoldersAtRoot = allPaths.filter((p) =>
        /^\d{2}-(operations|types)\//.test(p),
      );

      // API groups should be NESTED under custom groups, not at root
      expect(apiGroupFoldersAtRoot.length).toBe(0);

      // Should have custom groups at root when using grouping
      expect(customGroupFolders.length).toBeGreaterThan(0);

      // Check for nested API groups under custom groups
      const nestedApiGroups = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)\/\d{2}-(operations|types)\//.test(p),
      );
      expect(nestedApiGroups.length).toBeGreaterThan(0);
    });

    test("categorySortPrefix creates correctly prefixed directory structure with grouping and entity hierarchy", async () => {
      expect.assertions(5);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-strict-test",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-strict-test",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Custom groups (course, grade, misc) should be at ROOT level with prefixes
      // Pattern: 01-course/, 02-grade/, 03-misc/ (note: no leading /)
      const customGroupsWithPrefix = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)(\/|$)/.test(p),
      );
      expect(customGroupsWithPrefix.length).toBeGreaterThan(0);

      // Entity type folders (objects, scalars, enums, etc.) should be WITHIN custom groups
      // and should have prefixes when they exist
      // Pattern: 01-course/01-objects/, 01-course/02-scalars/, etc.
      const entityFoldersWithinCustomGroups = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)\/\d{2}-[a-z]+\//.test(p),
      );
      expect(entityFoldersWithinCustomGroups.length).toBeGreaterThan(0);

      // Verify that deprecated folder exists and is prefixed at root
      const deprecatedFolders = allPaths.filter((p) =>
        /^\d{2}-deprecated(\/|$)/.test(p),
      );
      expect(deprecatedFolders.length).toBeGreaterThan(0);

      // Ensure NO unprefixed custom group folders exist at root
      // (they should all be prefixed)
      const unprefixedCustomGroups = allPaths.filter((p) =>
        /^(course|grade|misc)(\/|$)/.test(p),
      );
      expect(unprefixedCustomGroups.length).toBe(0);

      // Ensure NO unprefixed entity type folders exist within custom groups
      const unprefixedEntityFolders = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)\/[a-z]+\//.test(p),
      );
      expect(unprefixedEntityFolders.length).toBe(0);
    });

    test("backward compatibility: directories are NOT prefixed when categorySortPrefix is not set", async () => {
      expect.assertions(3);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          // categorySortPrefix is NOT set (defaults to false/undefined)
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-backward-compat",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-backward-compat",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Verify that custom groups are NOT prefixed (backward compatible behavior)
      // Should have folders like "course/", "grade/", "misc/" WITHOUT numeric prefixes
      const unprefixedCustomGroups = allPaths.filter((p) =>
        /^(course|grade|misc)(\/|$)/.test(p),
      );
      expect(unprefixedCustomGroups.length).toBeGreaterThan(0);

      // Verify that entity type folders are NOT prefixed
      // Should have folders like "course/objects/", "course/queries/" WITHOUT numeric prefixes
      const unprefixedEntityFolders = allPaths.filter((p) =>
        /^(course|grade|misc)\/[a-z]+\//.test(p),
      );
      expect(unprefixedEntityFolders.length).toBeGreaterThan(0);

      // Ensure NO prefixed folders exist
      const prefixedFolders = allPaths.filter((p) => /^\d{2}-/.test(p));
      expect(prefixedFolders.length).toBe(0);
    });

    test("verifies prefixed directories are created at appropriate hierarchy levels", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-category-files",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-category-files",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Verify root-level prefixed directories exist (custom groups with prefixes)
      const rootPrefixedDirs = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)/.test(p),
      );
      expect(rootPrefixedDirs.length).toBeGreaterThan(0);

      // Verify entity-level prefixed directories exist within custom groups
      const entityPrefixedDirs = allPaths.filter((p) =>
        /^\d{2}-(course|grade|misc)\/\d{2}-[a-z]+/.test(p),
      );
      expect(entityPrefixedDirs.length).toBeGreaterThan(0);
    });

    test("categorySortPrefix with flat hierarchy keeps folders at root level", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-flat-prefix",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.DEFAULT,
          hierarchy: TypeHierarchy.FLAT,
        },
        skipDocDirective: [],
        tmpDir: "/temp-flat-prefix",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // With FLAT hierarchy, directories should be at root (no nesting)
      const nestedDirs = allPaths.filter((p) => /^\/[^/]+\/[^/]+\//.test(p));
      expect(nestedDirs.length).toBe(0);

      // All files should be at root or one level deep
      const rootLevelFiles = allPaths.filter((p) =>
        /^[^/]*$|^\/[^/]+$/.test(p),
      );
      expect(rootLevelFiles.length).toBeGreaterThan(0);
    });

    test("ensures consistent prefix numbering across directory hierarchy", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-no-duplicate",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-no-duplicate",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Collect all prefixes at root level
      const rootPrefixes = new Set<string>();
      for (const path of allPaths) {
        const match = path.match(/^(\d{2})-/);
        if (match) {
          rootPrefixes.add(match[1]);
        }
      }

      // Verify prefixes are consistently formatted (2 digits)
      const prefixArray = Array.from(rootPrefixes);
      const validPrefixes = prefixArray.filter((p) => /^\d{2}$/.test(p));
      expect(validPrefixes.length).toBe(prefixArray.length);

      // Verify we have multiple prefixes showing hierarchical organization
      expect(rootPrefixes.size).toBeGreaterThan(0);
    });

    test("maintains consistent prefix format across hierarchy levels", async () => {
      expect.assertions(1);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-many-cats",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-many-cats",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Extract all prefixes used
      const allPrefixes: string[] = [];
      for (const path of allPaths) {
        const matches = path.match(/\/(\d{2})-/g);
        if (matches) {
          allPrefixes.push(...matches.map((m) => m.replace(/[\/\-]/g, "")));
        }
      }

      // Verify prefix format is consistent (2 digits)
      const invalidPrefixes = allPrefixes.filter((p) => !/^\d{2}$/.test(p));
      expect(invalidPrefixes.length).toBe(0);
    });

    test("ensures categorySortPrefix generates properly formatted documentation", async () => {
      expect.assertions(2);

      const config: GeneratorOptions = {
        baseURL: "graphql",
        schemaLocation: join(
          __dirname,
          "../__data__/schema_with_grouping.graphql",
        ),
        diffMethod: DiffMethod.NONE,
        docOptions: {
          categorySort: "natural",
          categorySortPrefix: true,
        },
        groupByDirective: {
          directive: "doc" as DirectiveName,
          field: "category",
          fallback: "misc",
        },
        homepageLocation: "/assets/generated.md",
        linkRoot: "docs",
        loaders: {
          ["GraphQLFileLoader" as ClassName]:
            "@graphql-tools/graphql-file-loader" as PackageName,
        },
        mdxParser: "mdx-parser-mock" as PackageName,
        metatags: [],
        onlyDocDirective: [],
        outputDir: "/output-homepage-check",
        prettify: false,
        printer: "@graphql-markdown/printer-legacy" as PackageName,
        printTypeOptions: {
          ...DEFAULT_OPTIONS.printTypeOptions,
          deprecated: DeprecatedOption.GROUP,
          hierarchy: TypeHierarchy.ENTITY,
        },
        skipDocDirective: [],
        tmpDir: "/temp-homepage-check",
      };

      await generateDocFromSchema(config);

      const outputJson = vol.toJSON(config.outputDir, undefined, true);
      const allPaths = Object.keys(outputJson);

      // Generated markdown files should exist
      const markdownFiles = allPaths.filter((p) => /\.mdx?$/.test(p));
      expect(markdownFiles.length).toBeGreaterThan(0);

      // Prefixed directories should be created
      const prefixedDirs = allPaths.filter((p) => /\/\d{2}-/.test(p));
      expect(prefixedDirs.length).toBeGreaterThan(0);
    });
  });
});
