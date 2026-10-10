import fs from "node:fs";
import path from "node:path";

import {
  EXAMPLE_SCHEMA_REF,
  defaultSchemaLine,
  isRemoteSchemaSource,
} from "../schema.mjs";
import { findIndentedLine } from "../rewrites/lines.mjs";

/**
 * Rewrite app.config.ts with custom title and/or color overrides.
 */
export function writeAppConfig(tempDir, titleOverride, colorOverride) {
  if (!titleOverride && !colorOverride) {
    return; // No changes needed
  }

  const appConfigPath = path.join(tempDir, "app", "app.config.ts");
  let appConfig = fs.readFileSync(appConfigPath, "utf-8");
  const originalContent = appConfig;

  if (titleOverride) {
    const searchString = "siteTitle: 'My API'";

    // A replacement identical to the original (e.g. the title is already
    // "My API") is fine; only a missing search string means template drift.
    if (!originalContent.includes(searchString)) {
      throw new Error(
        `Expected to find and replace "${searchString}" in ${appConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }

    appConfig = appConfig.replace(
      searchString,
      () => `siteTitle: ${JSON.stringify(titleOverride)}`,
    );
  }

  if (colorOverride) {
    // The template ships no `ui.colors` block at all (the layer's own
    // violet/zinc defaults apply via `extends` until overridden) — add
    // one rather than trying to replace a value that isn't there.
    const beforeColorOverride = appConfig;
    const searchString = "export default defineAppConfig({";
    appConfig = appConfig.replace(
      searchString,
      () =>
        `${searchString}\n  ui: {\n    colors: {\n      primary: ${JSON.stringify(colorOverride)},\n    },\n  },`,
    );
    if (appConfig === beforeColorOverride) {
      throw new Error(
        `Expected to find and replace "${searchString}" in ${appConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  fs.writeFileSync(appConfigPath, appConfig);
}

/** Single-quoted JS/TS string literal with backslashes, quotes and newlines escaped. */
function toSingleQuotedLiteral(value) {
  const escaped = value
    .replace(/[\\']/g, (c) => `\\${c}`)
    .replaceAll("\n", String.raw`\n`)
    .replaceAll("\r", String.raw`\r`);
  return `'${escaped}'`;
}

/**
 * Rewrite generate-docs.ts to use the resolved schema path and loader.
 */
export function writeGenerateDocs(tempDir, schemaRef, loader) {
  const generateDocsPath = path.join(tempDir, "generate-docs.ts");
  const originalContent = fs.readFileSync(generateDocsPath, "utf-8");

  // The default (bundled example, GraphQLFileLoader) needs no `loaders` option
  // at all — createGenerateDocs already defaults to it — so only inject
  // one when the detected loader differs.
  const defaultSchema = `${defaultSchemaLine},`;
  const schemaLiteral = toSingleQuotedLiteral(schemaRef);
  const packageLiteral = toSingleQuotedLiteral(loader.package);
  // Loaders needing an API token get it as a loadSchema option through
  // the `{ module, options }` form of the loader entry.
  const loaderEntry = loader.tokenEnvVar
    ? `{ module: ${packageLiteral}, options: { token: process.env.${loader.tokenEnvVar} } }`
    : packageLiteral;
  const replacementLines = loader.isDefault
    ? [`schema: ${schemaLiteral},`]
    : [
        `schema: ${schemaLiteral},`,
        `loaders: { ${loader.className}: ${loaderEntry} },`,
      ];

  // Only require a match when a change is expected (the default needs none).
  const found = findIndentedLine(originalContent, defaultSchema);
  if (!found) {
    if (replacementLines.join("\n") === defaultSchema) return;
    throw new Error(
      `Expected to find and replace "${defaultSchema}" in ${generateDocsPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  const { line, indent } = found;
  const updated = originalContent.replace(line, () =>
    replacementLines.map((entry) => indent + entry).join("\n"),
  );

  fs.writeFileSync(generateDocsPath, updated);
}

/**
 * Removes the layer's `watch: [...]` block (and its leading comment) using
 * linear string scanning, replacing it with a single newline. Returns the
 * input unchanged when the block isn't found.
 */
export function removeWatchBlock(content) {
  const marker = "// The layer's gqlmd-generate module";
  const markerIdx = content.indexOf(marker);
  if (markerIdx === -1) return content;
  const watchIdx = content.indexOf("watch: [", markerIdx);
  if (watchIdx === -1) return content;
  const lineStart = content.lastIndexOf("\n", watchIdx);
  if (lineStart < markerIdx || content.slice(lineStart + 1, watchIdx).trim()) {
    return content;
  }
  const closeIdx = content.indexOf("]", watchIdx);
  if (closeIdx === -1 || !content.startsWith(",\n", closeIdx + 1)) {
    return content;
  }
  let start = markerIdx;
  while (start > 0 && /\s/.test(content[start - 1])) start--;
  return `${content.slice(0, start)}\n${content.slice(closeIdx + 3)}`;
}

/**
 * Rewrite nuxt.config.ts's `watch` entry and/or schema filename to match the resolved schema.
 */
export function writeNuxtConfig(tempDir, schemaRef, isRemoteSource) {
  const nuxtConfigPath = path.join(tempDir, "nuxt.config.ts");
  const originalContent = fs.readFileSync(nuxtConfigPath, "utf-8");

  let updated = originalContent;

  if (isRemoteSource) {
    // A remote schema source (URL/git/github) has no local file to watch at all —
    // dev-server restarts on schema change simply aren't available for those,
    // so the entry is dropped rather than left pointing at a path that no longer
    // means anything.
    const beforeWatchRemoval = updated;
    updated = removeWatchBlock(updated);

    if (updated === beforeWatchRemoval) {
      throw new Error(
        `Expected to find and replace the watch block in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }

    const beforeImportRemoval = updated;
    updated = updated.replace(
      'import { fileURLToPath } from "node:url";\n\n',
      "",
    );

    if (updated === beforeImportRemoval) {
      throw new Error(
        `Expected to find and replace the fileURLToPath import in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  } else {
    // Local schema: replace the example filename with the actual one.
    // Only validate if we expect a change (schemaRef differs from the default).
    const beforeSchemaReplace = updated;
    updated = updated.replace(EXAMPLE_SCHEMA_REF, () => schemaRef);

    if (schemaRef !== EXAMPLE_SCHEMA_REF && updated === beforeSchemaReplace) {
      throw new Error(
        `Expected to find and replace "${EXAMPLE_SCHEMA_REF}" in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  fs.writeFileSync(nuxtConfigPath, updated);
}

/**
 * Rewrite README.md's schema section to document the actual schema source.
 */
export function writeReadme(tempDir, schemaPath, schemaRef, loader) {
  if (!schemaPath) {
    return; // No custom schema, keep the template's instructions
  }

  const readmePath = path.join(tempDir, "README.md");
  const originalContent = fs.readFileSync(readmePath, "utf-8");
  const schemaSectionRe = /### Your GraphQL Schema\n\n[\s\S]*?(?=\n### |\n## )/;

  const githubNote = loader.tokenEnvVar
    ? `\nGitHub sources require an API token: set the \`${loader.tokenEnvVar}\` environment variable before running \`generate\`, \`dev\` or \`build\`.\n`
    : "";
  const replacement = isRemoteSchemaSource(schemaRef)
    ? `### Your GraphQL Schema\n\nThis project reads its schema from \`${schemaRef}\` via ${loader.package} (${loader.className}) — configured in \`generate-docs.ts\`. There is no local schema file to edit; point \`generate-docs.ts\`'s \`schema\` option at a different source to change it.\n${githubNote}`
    : `### Your GraphQL Schema\n\nYour schema lives at \`${schemaRef}\`. To point at a different file, update both \`generate-docs.ts\`'s \`schema\` option and \`nuxt.config.ts\`'s \`watch\` entry.\n`;

  const updated = originalContent.replace(schemaSectionRe, () => replacement);

  if (updated === originalContent) {
    throw new Error(
      `Expected to find and replace the schema section in ${readmePath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  fs.writeFileSync(readmePath, updated);
}

/** Nuxt UI / Tailwind color names offered for the primary color. */
const COLORS = [
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "green",
  "lime",
  "amber",
  "orange",
  "red",
  "rose",
  "pink",
  "fuchsia",
  "purple",
  "indigo",
  "slate",
  "zinc",
  "neutral",
];

/** Nuxt scaffold descriptor (templates/nuxt). */
export const nuxt = {
  id: "nuxt",
  name: "Nuxt",
  label: "Nuxt (@graphql-markdown/nuxt-theme)",
  hint: "Nuxt UI theme, live reload on schema changes",
  detect: ["nuxt", "docus"],
  links: "router",
  contentRoot: "content",
  contentRoute: "/",
  outputHint: "Nuxt (@graphql-markdown/nuxt-theme) reads content from content/",
  nextSteps: ({ outputDir, route }) =>
    `Nuxt Content serves \`${outputDir}\` at \`${route}\`; add a navigation link to it.`,
  scaffold: {
    runScripts: ["dev"],
    copyExcludes: [/^\.nuxt$/, /^\.output$/],
    supportsColor: true,
    colors: COLORS,
    defaultColor: "violet",
    apply(tempDir, { schemaRef, schemaPath, loader, title, color }) {
      writeAppConfig(tempDir, title, color);
      writeGenerateDocs(tempDir, schemaRef, loader);
      writeNuxtConfig(tempDir, schemaRef, isRemoteSchemaSource(schemaRef));
      // README.md is independent of package.json, so running it here (before
      // the shared writePackageJson) is equivalent to running it after.
      writeReadme(tempDir, schemaPath, schemaRef, loader);
    },
  },
};
