// Posts (or updates in place) a single "sticky" PR comment summarizing a
// gate job's matrix: overall pass/fail plus a per-check breakdown. Each gate
// (Test/Mutation/Smoke) calls this with its own marker so re-runs edit the
// same comment instead of piling up a new one every push.
//
// Reads job results from the Actions run itself (`GET .../actions/runs/{id}/jobs`)
// rather than threading per-matrix-entry outputs through `needs`, since GitHub
// Actions does not expose that from a matrix job to a downstream job -- only
// the already-aggregated `needs.<job>.result`.
//
// Required env:
//   GITHUB_REPOSITORY, GITHUB_RUN_ID  -- set automatically by Actions
//   PR_NUMBER       -- github.event.pull_request.number
//   GATE_NAME       -- e.g. "Test Gate", shown in the comment heading
//   GATE_MARKER     -- unique id, e.g. "test", used as an HTML comment marker
//   JOB_PREFIXES    -- JSON array of job-name prefixes belonging to this gate
//   EXCLUDE_JOB_NAME -- the gate job's own name, excluded from the summary
//
// Usage: node .github/scripts/gate-comment.mts
//
// Run directly by Node (>= 22.18) through type stripping: no enums, no
// parameter properties, no namespaces.

import { execFileSync } from "node:child_process";

interface RunJob {
  name: string;
  status: string;
  conclusion: string | null;
  started_at: string;
}

interface IssueComment {
  id: number;
  body: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing required env var ${name}`);
  return value;
}

function ghApi(args: string[]): string {
  return execFileSync("gh", ["api", ...args], { encoding: "utf8" });
}

function ghApiJson<T>(args: string[]): T {
  return JSON.parse(ghApi(args)) as T;
}

const CONCLUSION_ICON: Record<string, string> = {
  success: "✅",
  skipped: "⏭️",
  failure: "❌",
  cancelled: "🚫",
  timed_out: "⏱️",
  action_required: "⚠️",
  neutral: "➖",
};

function main(): void {
  const repo = requireEnv("GITHUB_REPOSITORY");
  const runId = requireEnv("GITHUB_RUN_ID");
  const prNumber = requireEnv("PR_NUMBER");
  const gateName = requireEnv("GATE_NAME");
  const gateMarker = requireEnv("GATE_MARKER");
  const jobPrefixes: string[] = JSON.parse(requireEnv("JOB_PREFIXES"));
  const excludeJobName = process.env.EXCLUDE_JOB_NAME ?? "";

  const { jobs } = ghApiJson<{ jobs: RunJob[] }>([
    `repos/${repo}/actions/runs/${runId}/jobs`,
    "--paginate",
  ]);

  // A rerun can leave older attempts for the same job name in the response;
  // keep only the most recently started entry per name.
  const latestByName = new Map<string, RunJob>();
  for (const job of jobs) {
    if (job.name === excludeJobName) continue;
    if (!jobPrefixes.some((prefix) => job.name.startsWith(prefix))) continue;
    const existing = latestByName.get(job.name);
    if (!existing || job.started_at > existing.started_at) {
      latestByName.set(job.name, job);
    }
  }

  const results = [...latestByName.values()].sort((a, b) => a.name.localeCompare(b.name));
  const failed = results.filter(
    (job) => job.conclusion !== "success" && job.conclusion !== "skipped",
  );

  const heading =
    failed.length === 0
      ? `## ✅ ${gateName} — all checks passed`
      : `## ❌ ${gateName} — ${failed.length} check${failed.length === 1 ? "" : "s"} failed`;

  const rows = results
    .map((job) => `| ${job.name} | ${CONCLUSION_ICON[job.conclusion ?? ""] ?? "❔"} ${job.conclusion ?? "unknown"} |`)
    .join("\n");

  const marker = `<!-- gate:${gateMarker} -->`;
  const body = [
    marker,
    heading,
    "",
    "| Check | Result |",
    "| --- | --- |",
    rows,
    "",
    `<sub>Updated automatically for the latest commit.</sub>`,
  ].join("\n");

  const comments = ghApiJson<IssueComment[]>([
    `repos/${repo}/issues/${prNumber}/comments`,
    "--paginate",
  ]);
  const existing = comments.find((c) => c.body.includes(marker));

  if (existing) {
    execFileSync(
      "gh",
      ["api", "--method", "PATCH", `repos/${repo}/issues/comments/${existing.id}`, "--input", "-"],
      { input: JSON.stringify({ body }), stdio: ["pipe", "inherit", "inherit"] },
    );
  } else {
    execFileSync(
      "gh",
      ["api", "--method", "POST", `repos/${repo}/issues/${prNumber}/comments`, "--input", "-"],
      { input: JSON.stringify({ body }), stdio: ["pipe", "inherit", "inherit"] },
    );
  }
}

main();
