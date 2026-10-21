import { gzipSync } from "node:zlib";

import { detectCi } from "./ci.ts";
import { GZIP_THRESHOLD, NOTICE_VERSION, TIMEOUT_MS } from "./constants.ts";
import { printDisclaimer } from "./disclaimer.ts";
import { getEndpoint, isEnabled } from "./enabled.ts";
import { buildPayload, fingerprint } from "./payload.ts";
import type { PayloadInput } from "./payload.ts";
import { getStatePath, readState, writeState } from "./state.ts";

export interface TrackInput extends Omit<PayloadInput, "noStateBefore"> {
  /** Value of the `telemetry` option. */
  option?: boolean;
  /** Override of the `telemetry.json` location (tests). */
  statePath?: string;
  /** Receives the full notice instead of stderr (e.g. a prompt UI). */
  onFullNotice?: (notice: string) => void;
}

/** Builds the request body, gzipped above the size threshold. */
export const encodeBody = (
  json: string,
): { body: BodyInit; headers: Record<string, string> } => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (Buffer.byteLength(json) > GZIP_THRESHOLD) {
    headers["Content-Encoding"] = "gzip";
    return { body: gzipSync(json) as unknown as BodyInit, headers };
  }
  return { body: json, headers };
};

/**
 * Sends one anonymous config event. Never throws and never rejects.
 */
export const track = async (input: TrackInput): Promise<void> => {
  try {
    const env = input.env ?? process.env;
    const statePath = input.statePath ?? getStatePath();
    const state = readState(statePath);
    const decision = isEnabled({
      trigger: input.trigger,
      option: input.option,
      state,
      env,
    });
    if (!decision.enabled) {
      return;
    }

    const ci = detectCi(env);
    if (printDisclaimer(state, ci, input.onFullNotice)) {
      // Nothing is sent when the notice cannot be recorded.
      writeState({ enabled: true, noticeVersion: NOTICE_VERSION }, statePath);
    }

    const payload = buildPayload({
      ...input,
      env,
      trigger: decision.trigger,
      noStateBefore: state === undefined,
    });
    const json = JSON.stringify(payload);

    const debug = env.GRAPHQL_MARKDOWN_TELEMETRY_DEBUG;
    if (debug && debug !== "0" && debug !== "false") {
      process.stderr.write(`${JSON.stringify(payload, null, 2)}\n`);
      return;
    }

    // Generate events carry a duration, so their fingerprint never repeats.
    const dedupe = payload.event !== "generate";
    const fp = fingerprint(payload);
    if (dedupe && state?.lastSentConfigs.includes(fp)) {
      return;
    }

    const { body, headers } = encodeBody(json);
    const response = await fetch(getEndpoint(env), {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 202) {
      if (dedupe) {
        writeState({ lastSentConfigs: [fp] }, statePath);
      }
    } else if (response.status === 410) {
      writeState({ enabled: false, reason: "sunset" }, statePath);
    }
  } catch {
    // telemetry must never affect a run
  }
};
