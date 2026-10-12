import type { CiInfo } from "./ci";
import { NOTICE_VERSION } from "./constants";
import type { TelemetryState } from "./state";

export const FULL_NOTICE = `ℹ GraphQL-Markdown collects anonymous usage data to help improve the tool.
  Sent: package/Node versions, OS, schema loader type, the settings you use,
  and the page count, duration and error type of each run.
  Custom strings, URLs and paths are masked; schema content is never sent.
  Details: https://graphql-markdown.dev/telemetry
  Opt out: \`gqlmd telemetry disable\` or DO_NOT_TRACK=1
`;

const SHORT_NOTICE =
  "ℹ Anonymous telemetry enabled. Opt out: gqlmd telemetry disable\n";

/** Whether the full notice is due (never in CI, where it is not recorded). */
export const isNoticeDue = (
  state: TelemetryState | null | undefined,
  ci: CiInfo = { ci: false },
): boolean => {
  return !ci.ci && (!state || state.noticeVersion < NOTICE_VERSION);
};

let printed = false;

/** Resets the once-per-process guard. @internal */
export const resetDisclaimer = (): void => {
  printed = false;
};

/**
 * Writes the notice straight to stderr, bypassing the logger, at most once per process.
 *
 * When `onFullNotice` is given, the full notice is passed to it instead.
 *
 * @returns `true` when the full notice was shown (it must then be recorded).
 */
export const printDisclaimer = (
  state: TelemetryState | null | undefined,
  ci: CiInfo,
  onFullNotice?: (notice: string) => void,
): boolean => {
  if (printed) {
    return false;
  }
  // In CI the full notice is never recorded: print the reminder every run.
  const full = isNoticeDue(state, ci);
  if (onFullNotice && full) {
    onFullNotice(FULL_NOTICE);
  } else {
    process.stderr.write(full ? FULL_NOTICE : SHORT_NOTICE);
  }
  // Only once shown: a failed output must not let a later event skip it.
  printed = true;
  return full;
};
