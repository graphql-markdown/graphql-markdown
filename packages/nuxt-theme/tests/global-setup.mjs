// @ts-check

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * `tsconfig.json` extends `.nuxt/tsconfig.json`, which only exists once Nuxt
 * has prepared the layer. On a fresh checkout (every CI run) Vite's transform
 * fails on the missing tsconfig before a single test loads, so generate it
 * first. Skipped when it already exists, to keep local reruns fast.
 */
export default function setup() {
  if (existsSync(`${root}.nuxt/tsconfig.json`)) return;
  execFileSync(process.execPath, [`${root}node_modules/.bin/nuxi`, "prepare"], {
    cwd: root,
    stdio: "pipe",
  });
}
