import fs from "node:fs";
import path from "node:path";

import { writeGraphqlrc } from "../rewrites/graphqlrc.mjs";

/**
 * Rewrite the Docusaurus template's docusaurus.config.js site title.
 */
export function writeDocusaurusConfig(tempDir, titleOverride) {
  if (!titleOverride) {
    return; // No changes needed
  }

  const configPath = path.join(tempDir, "docusaurus.config.js");
  const originalContent = fs.readFileSync(configPath, "utf-8");
  const searchString = 'title: "My API",';
  const navbarSearchString = 'title: "GraphQL-Markdown",';

  // A replacement identical to the original (e.g. the title is already
  // "My API") is fine; only a missing search string means template drift.
  if (!originalContent.includes(searchString)) {
    throw new Error(
      `Expected to find and replace '${searchString}' in ${configPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }
  if (!originalContent.includes(navbarSearchString)) {
    throw new Error(
      `Expected to find and replace 'title: "GraphQL-Markdown",' in ${configPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  const updated = originalContent
    .replace(searchString, () => `title: ${JSON.stringify(titleOverride)},`)
    .replace(
      navbarSearchString,
      () => `title: ${JSON.stringify(titleOverride)},`,
    );

  fs.writeFileSync(configPath, updated);
}

/** Docusaurus scaffold descriptor (templates/docusaurus). */
export const docusaurus = {
  name: "Docusaurus",
  label: "Docusaurus",
  hint: "React + MDX, classic docs site",
  scaffold: {
    runScripts: ["doc", "start"],
    copyExcludes: [],
    supportsColor: false,
    // The Docusaurus README already documents editing .graphqlrc generically.
    apply(tempDir, { schemaRef, loader, title }) {
      writeDocusaurusConfig(tempDir, title);
      writeGraphqlrc(tempDir, schemaRef, loader);
    },
  },
};
