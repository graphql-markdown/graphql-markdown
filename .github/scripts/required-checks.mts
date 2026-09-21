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

function main(): void {
  if (!process.argv.includes("--apply") && !process.argv.includes("--dry-run")) {
    console.log(JSON.stringify(CI_CHECKS, null, 2));
    return;
  }

  const current = JSON.parse(execFileSync("gh", ["api", RULESET]).toString());
  const rule = current.rules.find((r: { type: string }) => r.type === "required_status_checks");
  const existing: RequiredCheck[] = rule?.parameters?.required_status_checks ?? [];

  // Third-party app checks always carry an `integration_id`; CI-owned checks
  // (ours or any stale leftovers from before this script) never do.
  const appChecks = existing.filter((c) => c.integration_id != null);
  const merged: RequiredCheck[] = [...appChecks, ...CI_CHECKS.map((context) => ({ context }))];

  if (process.argv.includes("--dry-run")) {
    console.log(`Kept (app, ${appChecks.length}):`, appChecks.map((c) => c.context));
    console.log(`Set (CI, ${CI_CHECKS.length}):`, CI_CHECKS);
    console.log(`Total after apply: ${merged.length}`);
    return;
  }

  for (const r of current.rules) {
    if (r.type === "required_status_checks") {
      r.parameters.required_status_checks = merged;
    }
  }

  execFileSync("gh", ["api", "--method", "PUT", RULESET, "--input", "-"], {
    input: JSON.stringify(current),
    stdio: ["pipe", "inherit", "inherit"],
  });
  console.log(`\nApplied ${merged.length} required checks (${CI_CHECKS.length} CI + ${appChecks.length} app).`);
}

main();
