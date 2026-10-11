import type { CiInfo } from "./ci";
import { NOTICE_VERSION } from "./constants";
import type { TelemetryState } from "./state";

const FULL_NOTICE = `ℹ GraphQL-Markdown collects anonymous usage data to help improve the tool.
  Sent: package/Node versions, OS, schema loader type, and the settings you use.
  Custom strings, URLs and paths are masked; schema content is never sent.
  Details: https://graphql-markdown.dev/telemetry
  Opt out: \`gqlmd telemetry disable\` or DO_NOT_TRACK=1
`;

const SHORT_NOTICE =
  "ℹ Anonymous telemetry enabled. Opt out: gqlmd telemetry disable\n";

/**
 * Writes the notice straight to stderr, bypassing the logger.
 *
 * @returns `true` when the full notice was shown (it must then be recorded).
 */
export const printDisclaimer = (
  state: TelemetryState | null | undefined,
  ci: CiInfo,
): boolean => {
  // In CI the full notice is never recorded: print the reminder every run.
  const full = !ci.ci && (!state || state.noticeVersion < NOTICE_VERSION);
  process.stderr.write(full ? FULL_NOTICE : SHORT_NOTICE);
  return full;
};
