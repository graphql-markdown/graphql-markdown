// @ts-check

// Renders a Stryker JSON report as a markdown table into the GitHub Actions step
// summary, so a PR shows the mutation score per package without a dashboard
// round-trip.
//
// StrykerJS has no markdown reporter: markdown-summary-reporter is a Stryker.NET
// feature, and the `html` reporter writes a page that boots a custom element,
// which a sanitized check summary cannot render. So the summary is built here
// from the `json` reporter output, aggregated with the same
// mutation-testing-metrics package the HTML report uses, so the numbers match
// the dashboard exactly.
//
// Usage: node mutation-summary.mjs <package> <path/to/mutation.json>

import { appendFile, readFile } from "node:fs/promises";

import { calculateMetrics } from "mutation-testing-metrics";

// Mirrors `thresholds` in packages/tooling-config/stryker/stryker.conf.mjs.
const THRESHOLDS = { high: 85, low: 75 };

/**
 * Appends to the step summary, or prints to stdout when run outside Actions.
 *
 * @param {string} markdown
 * @returns {Promise<void>}
 */
const write = async (markdown) => {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    await appendFile(summaryFile, markdown, "utf-8");
    return;
  }
  process.stdout.write(markdown);
};

/**
 * @param {number} score
 * @returns {string}
 */
const marker = (score) => {
  if (Number.isNaN(score)) {
    return "⚪";
  }
  if (score >= THRESHOLDS.high) {
    return "🟢";
  }
  return score >= THRESHOLDS.low ? "🟡" : "🔴";
};

/**
 * @param {number} score
 * @returns {string}
 */
const formatScore = (score) =>
  Number.isNaN(score) ? "n/a" : `${score.toFixed(2)}%`;

const [packageName, reportPath] = process.argv.slice(2);
if (!packageName || !reportPath) {
  console.error(
    "usage: mutation-summary.mjs <package> <path/to/mutation.json>",
  );
  process.exit(1);
}

let report;
try {
  report = JSON.parse(await readFile(reportPath, "utf-8"));
} catch {
  // A run that fell over must not turn into a second, confusing failure: the
  // mutation step itself already reported it.
  await write(
    `## \`${packageName}\` mutation score\n\nNo mutation report was produced (\`${reportPath}\`).\n\n`,
  );
  process.exit(0);
}

const { metrics } = calculateMetrics(report.files);
const { mutationScore } = metrics;

await write(
  [
    `## ${marker(mutationScore)} \`${packageName}\` — ${formatScore(mutationScore)}`,
    "",
    "| Killed | Survived | Timeout | No coverage | Ignored | Errors | Total |",
    "| -----: | -------: | ------: | ----------: | ------: | -----: | ----: |",
    `| ${metrics.killed} | ${metrics.survived} | ${metrics.timeout} | ${metrics.noCoverage} | ${metrics.ignored} | ${metrics.totalInvalid} | ${metrics.totalMutants} |`,
    "",
    `Thresholds: high ${THRESHOLDS.high}%, low ${THRESHOLDS.low}%.`,
    "",
    "",
  ].join("\n"),
);
