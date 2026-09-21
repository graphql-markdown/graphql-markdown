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

interface GateConfig {
  repo: string;
  runId: string;
  prNumber: string;
  gateName: string;
  gateMarker: string;
  jobPrefixes: string[];
  excludeJobName: string;
}

function readConfig(): GateConfig {
  return {
    repo: requireEnv("GITHUB_REPOSITORY"),
    runId: requireEnv("GITHUB_RUN_ID"),
    prNumber: requireEnv("PR_NUMBER"),
    gateName: requireEnv("GATE_NAME"),
    gateMarker: requireEnv("GATE_MARKER"),
    jobPrefixes: JSON.parse(requireEnv("JOB_PREFIXES")),
    excludeJobName: process.env.EXCLUDE_JOB_NAME ?? "",
  };
}

function belongsToGate(job: RunJob, config: GateConfig): boolean {
  if (job.name === config.excludeJobName) return false;
  return config.jobPrefixes.some((prefix) => job.name.startsWith(prefix));
}

/** A rerun can leave older attempts for the same job name; keep only the latest. */
function dedupeByLatestStart(jobs: RunJob[]): RunJob[] {
  const latestByName = new Map<string, RunJob>();
  for (const job of jobs) {
    const existing = latestByName.get(job.name);
    if (!existing || job.started_at > existing.started_at) {
      latestByName.set(job.name, job);
    }
  }
  return [...latestByName.values()];
}

/** This gate's matrix jobs from the run, one entry per job name. */
function fetchMatrixJobs(config: GateConfig): RunJob[] {
  const { jobs } = ghApiJson<{ jobs: RunJob[] }>([
    `repos/${config.repo}/actions/runs/${config.runId}/jobs`,
    "--paginate",
  ]);

  const matching = jobs.filter((job) => belongsToGate(job, config));
  return dedupeByLatestStart(matching).sort((a, b) => a.name.localeCompare(b.name));
}

function renderHeading(gateName: string, results: RunJob[]): string {
  // `cancelled` almost always means a newer push superseded this run (this
  // workflow's `cancel-in-progress: true`), not a real failure -- reporting
  // it as "N checks failed" is misleading once the run for the latest commit
  // finishes and this same comment gets overwritten anyway.
  const cancelled = results.filter((job) => job.conclusion === "cancelled");
  const failed = results.filter(
    (job) => job.conclusion !== "success" && job.conclusion !== "skipped" && job.conclusion !== "cancelled",
  );

  if (failed.length > 0) {
    return `## ❌ ${gateName} — ${failed.length} check${failed.length === 1 ? "" : "s"} failed`;
  }
  if (cancelled.length > 0) {
    return `## ⏳ ${gateName} — superseded by a newer push (${cancelled.length} cancelled)`;
  }
  return `## ✅ ${gateName} — all checks passed`;
}

function renderBody(gateName: string, marker: string, results: RunJob[]): string {
  const heading = renderHeading(gateName, results);
  const rows = results
    .map((job) => `| ${job.name} | ${CONCLUSION_ICON[job.conclusion ?? ""] ?? "❔"} ${job.conclusion ?? "unknown"} |`)
    .join("\n");

  return [
    marker,
    heading,
    "",
    "| Check | Result |",
    "| --- | --- |",
    rows,
    "",
    `<sub>Updated automatically for the latest commit.</sub>`,
  ].join("\n");
}

/** Posts `body` as a new PR comment, or updates the one already carrying `marker`. */
function upsertComment(repo: string, prNumber: string, marker: string, body: string): void {
  const comments = ghApiJson<IssueComment[]>([`repos/${repo}/issues/${prNumber}/comments`, "--paginate"]);
  const existing = comments.find((c) => c.body.includes(marker));

  const [method, path] = existing
    ? ["PATCH", `repos/${repo}/issues/comments/${existing.id}`]
    : ["POST", `repos/${repo}/issues/${prNumber}/comments`];

  execFileSync("gh", ["api", "--method", method, path, "--input", "-"], {
    input: JSON.stringify({ body }),
    stdio: ["pipe", "inherit", "inherit"],
  });
}

function main(): void {
  const config = readConfig();
  const results = fetchMatrixJobs(config);
  const marker = `<!-- gate:${config.gateMarker} -->`;
  const body = renderBody(config.gateName, marker, results);
  upsertComment(config.repo, config.prNumber, marker, body);
}

main();
