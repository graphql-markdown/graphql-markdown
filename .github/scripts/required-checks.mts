// Sets the `main-checklist` ruleset's required-status-checks list to the CI
// gate checks below, plus whatever third-party security-app checks are
// already required (GitGuardian, CodeQL, etc.).
//
// The ruleset's required_status_checks list is static (GitHub rulesets have
// no "required only if these paths changed" condition). It used to name every
// matrix combination individually (~30 entries across test.yml/mutation.yml/
// smoke.yml), which silently drifted out of sync with the matrices more than
// once and was wiped out entirely by an unrelated ruleset edit. Each of those
// workflows now ends in a `gate` job whose `needs:` aggregates its whole
// matrix into one success/failure/skipped verdict (that aggregation is done
// by GitHub Actions itself, not by this script) -- so the ruleset only needs
// to name the gate jobs, and adding/removing a matrix entry never requires
// touching it again.
//
// Non-CI checks (contexts with an `integration_id`, e.g. GitHub Apps like
// GitGuardian/CodeQL/Aikido) are read from the live ruleset and preserved;
// only the CI-owned contexts (no `integration_id`) are replaced.
//
// Usage:
//   node .github/scripts/required-checks.mts             # print the list
//   node .github/scripts/required-checks.mts --dry-run    # preview the merge
//   node .github/scripts/required-checks.mts --apply       # PUT it via `gh api`

import { execFileSync } from "node:child_process";

const RULESET = "repos/graphql-markdown/graphql-markdown/rulesets/21811019";

// One entry per gate job. Keep this in sync with the `gate` job's `name:` in
// each workflow -- there is no way to derive it automatically without also
// reintroducing the matrix-parsing this replaced.
const CI_CHECKS = ["Lint", "Test Gate", "Mutation Gate", "Smoke Gate"];

interface RequiredCheck {
  context: string;
  integration_id?: number;
}

interface RequiredStatusChecksRule {
  type: string;
  parameters?: { required_status_checks?: RequiredCheck[] };
}

interface Ruleset {
  rules: RequiredStatusChecksRule[];
}

interface Merge {
  ruleset: Ruleset;
  appChecks: RequiredCheck[];
  merged: RequiredCheck[];
}

function fetchRuleset(): Ruleset {
  return JSON.parse(execFileSync("gh", ["api", RULESET]).toString());
}

function putRuleset(ruleset: Ruleset): void {
  execFileSync("gh", ["api", "--method", "PUT", RULESET, "--input", "-"], {
    input: JSON.stringify(ruleset),
    stdio: ["pipe", "inherit", "inherit"],
  });
}

/**
 * The live ruleset merged with `CI_CHECKS`. Third-party app checks always
 * carry an `integration_id`; CI-owned checks never do, so that field alone
 * tells the two apart without needing to name every app check by hand.
 */
function computeMerge(): Merge {
  const ruleset = fetchRuleset();
  const rule = ruleset.rules.find((r) => r.type === "required_status_checks");
  const existing = rule?.parameters?.required_status_checks ?? [];
  const appChecks = existing.filter((c) => c.integration_id != null);
  const merged = [...appChecks, ...CI_CHECKS.map((context) => ({ context }))];

  return { ruleset, appChecks, merged };
}

function printChecks(): void {
  console.log(JSON.stringify(CI_CHECKS, null, 2));
}

function printDryRun({ appChecks, merged }: Merge): void {
  console.log(`Kept (app, ${appChecks.length}):`, appChecks.map((c) => c.context));
  console.log(`Set (CI, ${CI_CHECKS.length}):`, CI_CHECKS);
  console.log(`Total after apply: ${merged.length}`);
}

function apply({ ruleset, appChecks, merged }: Merge): void {
  for (const rule of ruleset.rules) {
    if (rule.type === "required_status_checks" && rule.parameters) {
      rule.parameters.required_status_checks = merged;
    }
  }

  putRuleset(ruleset);
  console.log(`\nApplied ${merged.length} required checks (${CI_CHECKS.length} CI + ${appChecks.length} app).`);
}

function main(): void {
  if (process.argv.includes("--apply")) {
    apply(computeMerge());
  } else if (process.argv.includes("--dry-run")) {
    printDryRun(computeMerge());
  } else {
    printChecks();
  }
}

main();
