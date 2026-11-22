#!/usr/bin/env node
/**
 * Captures one screenshot per live demo (graphql-markdown.dev/demo-*) for the
 * README gallery. Each shot shows a generated object type page, so the gallery
 * compares the same kind of output across frameworks.
 *
 * Usage (from the repository root):
 *
 *   npm install --no-save playwright
 *   npx playwright install chromium
 *   node .github/scripts/demo-screenshots.mjs [demo-id ...]
 *
 * Without arguments, every demo is captured. Images are written to
 * .github/assets/demos/<demo-id>.jpg
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const BASE_URL = "https://graphql-markdown.dev";
const OUTPUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "demos",
);
const VIEWPORT = { width: 1280, height: 800 };

const DEMOS = [
  { id: "demo-docusaurus", page: "types/objects/project" },
  { id: "demo-nuxt", page: "api-reference/objects-project" },
  { id: "demo-astro-starlight", page: "types/objects/project/" },
  { id: "demo-nextjs-fumadocs", page: "docs/types/objects/project" },
  { id: "demo-docus", page: "docs/types/objects/project" },
  { id: "demo-vite-vocs", page: "types/objects/project" },
  { id: "demo-hugo", page: "graphql/types/objects/project/" },
  { id: "demo-mkdocs", page: "graphql/types/objects/project/" },
  { id: "demo-mdbook", page: "graphql/types/objects/project.html" },
  { id: "demo-docfx", page: "docs/graphql/types/objects/project.html" },
  { id: "demo-honkit", page: "graphql/objects-project.html" },
  { id: "demo-zola", page: "graphql/types/objects/project/" },
  {
    id: "demo-docsify",
    page: "#/graphql/types/objects/project",
    waitFor: ".markdown-section h1",
  },
  { id: "demo-pelican", page: "graphql/types/objects/project/" },
];

const selected = process.argv.slice(2);
const demos = selected.length
  ? DEMOS.filter(({ id }) => selected.includes(id))
  : DEMOS;

await mkdir(OUTPUT_DIR, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  colorScheme: "light",
});

let failures = 0;
for (const { id, page: path, waitFor } of demos) {
  const url = `${BASE_URL}/${id}/${path}`;
  const page = await context.newPage();
  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    if (!response?.ok()) {
      throw new Error(`HTTP ${response?.status() ?? "no response"}`);
    }
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 60_000 });
    }
    await page.waitForTimeout(1_000); // let fonts and client-side rendering settle
    const file = join(OUTPUT_DIR, `${id}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 80 });
    console.log(`✔ ${id} → ${file}`);
  } catch (error) {
    failures += 1;
    console.error(`✘ ${id} (${url}): ${error.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
process.exitCode = failures ? 1 : 0;
