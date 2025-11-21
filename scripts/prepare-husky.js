// scripts/prepare-husky.js
const { spawnSync } = require("node:child_process");

const HUSKY_DISABLED = process.env.HUSKY === "0" || !!process.env.CI;

if (HUSKY_DISABLED) {
  // Skip Husky in CI or when explicitly disabled
  process.exit(0);
}

const res = spawnSync("husky", [], { stdio: "inherit" });
process.exit(res.status || 0);
